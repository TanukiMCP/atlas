import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { randomBytes, createHmac } from 'crypto';
import { networkInterfaces } from 'os';
import qrcode from 'qrcode';
import { EventEmitter } from 'events';
import { BrowserWindow, app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Connection details for mobile pairing
 */
interface ConnectionDetails {
  token: string;
  ip: string;
  port: number;
  appId: string;
  expires: number;
}

/**
 * Client device information
 */
interface ClientDevice {
  id: string;
  name: string;
  platform: string;
  lastConnected: Date;
  ipAddress: string;
}

/**
 * WebSocket message structure
 */
interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

/**
 * Proxy server configuration
 */
interface ProxyServerConfig {
  port?: number;
  tokenExpiryMinutes?: number;
  maxConnections?: number;
  storageRoot?: string;
}

/**
 * ProxyServer class for handling mobile connections
 */
export class ProxyServer extends EventEmitter {
  private server: WebSocketServer | null = null;
  private clients: Map<string, { ws: WebSocket, device: ClientDevice }> = new Map();
  private pairingTokens: Map<string, { token: string, expiry: number }> = new Map();
  private port: number;
  private tokenExpiryMinutes: number;
  private maxConnections: number;
  private storageRoot: string;
  private isRunning: boolean = false;
  private statusWindow: BrowserWindow | null = null;
  
  /**
   * Create a new ProxyServer instance
   */
  constructor(config: ProxyServerConfig = {}) {
    super();
    this.port = config.port || 0; // Dynamic port if not specified
    this.tokenExpiryMinutes = config.tokenExpiryMinutes || 10;
    this.maxConnections = config.maxConnections || 10;
    this.storageRoot = config.storageRoot || path.join(app.getPath('userData'), 'mobile_clients');
    
    // Ensure storage directory exists
    this.ensureStorageDirectory();
  }
  
  /**
   * Start the proxy server
   */
  public async start(): Promise<number> {
    if (this.isRunning) {
      return this.port;
    }
    
    return new Promise((resolve, reject) => {
      try {
        this.server = new WebSocketServer({ port: this.port });
        
        this.server.on('listening', () => {
          const address = this.server?.address();
          if (address && typeof address === 'object') {
            this.port = address.port;
            this.isRunning = true;
            console.log(`Proxy server started on port ${this.port}`);
            this.emit('started', this.port);
            resolve(this.port);
          }
        });
        
        this.server.on('connection', this.handleConnection.bind(this));
        
        this.server.on('error', (error) => {
          console.error('Proxy server error:', error);
          this.emit('error', error);
          reject(error);
        });
      } catch (error) {
        console.error('Failed to start proxy server:', error);
        this.emit('error', error);
        reject(error);
      }
    });
  }
  
  /**
   * Stop the proxy server
   */
  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isRunning || !this.server) {
        this.isRunning = false;
        resolve();
        return;
      }
      
      // Close all client connections
      this.clients.forEach(({ ws }) => {
        try {
          ws.close(1000, 'Server shutting down');
        } catch (e) {
          // Ignore errors when closing connections
        }
      });
      
      this.server.close(() => {
        this.isRunning = false;
        this.server = null;
        this.clients.clear();
        this.emit('stopped');
        resolve();
      });
    });
  }
  
  /**
   * Generate a pairing token and QR code
   */
  public generatePairingQRCode(): Promise<{ qrCode: string, token: string, connectionUrl: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        // Generate secure random token
        const token = randomBytes(16).toString('hex');
        const expiry = Date.now() + (this.tokenExpiryMinutes * 60 * 1000);
        
        // Store token with expiry
        this.pairingTokens.set(token, { token, expiry });
        
        // Clean up expired tokens
        this.cleanupExpiredTokens();
        
        // Get local IP address
        const ip = this.getLocalIP();
        
        if (!ip) {
          reject(new Error('Could not determine local IP address'));
          return;
        }
        
        // Create connection details
        const connectionDetails: ConnectionDetails = {
          token,
          ip,
          port: this.port,
          appId: 'tanukimcp-atlas',
          expires: expiry
        };
        
        // Generate connection URL for QR code
        const connectionUrl = `tanukimcp://connect?${Object.entries(connectionDetails)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('&')}`;
        
        // Generate QR code
        const qrCode = await qrcode.toDataURL(connectionUrl);
        
        this.emit('pairing-generated', { token, connectionUrl });
        resolve({ qrCode, token, connectionUrl });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Handle incoming WebSocket connection
   */
  private handleConnection(ws: WebSocket, request: IncomingMessage) {
    const clientIp = request.socket.remoteAddress || '';
    console.log(`New connection from ${clientIp}`);
    
    // Set up message handler
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString()) as WebSocketMessage;
        this.handleMessage(ws, message, clientIp);
      } catch (error) {
        console.error('Error parsing message:', error);
        this.sendErrorMessage(ws, 'invalid_message', 'Invalid message format');
      }
    });
    
    // Set up close handler
    ws.on('close', (code, reason) => {
      // Find and remove client
      let clientId = '';
      this.clients.forEach((client, id) => {
        if (client.ws === ws) {
          clientId = id;
        }
      });
      
      if (clientId) {
        const client = this.clients.get(clientId);
        this.clients.delete(clientId);
        this.emit('client-disconnected', client?.device);
        console.log(`Client disconnected: ${clientId}, Code: ${code}, Reason: ${reason.toString()}`);
      }
    });
    
    // Set up error handler
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    // Set initial timeout for authentication
    const authTimeout = setTimeout(() => {
      if (!this.isClientAuthenticated(ws)) {
        ws.close(1008, 'Authentication timeout');
      }
    }, 30000); // 30 seconds to authenticate
    
    // Store timeout to clear it later
    (ws as any).authTimeout = authTimeout;
  }
  
  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(ws: WebSocket, message: WebSocketMessage, clientIp: string) {
    // Check message type
    switch (message.type) {
      case 'auth':
        this.handleAuth(ws, message, clientIp);
        break;
        
      case 'heartbeat':
        this.handleHeartbeat(ws, message);
        break;
        
      case 'chat_message':
        this.handleChatMessage(ws, message);
        break;
        
      case 'file_request':
        this.handleFileRequest(ws, message);
        break;
        
      case 'media_process':
        this.handleMediaProcess(ws, message);
        break;
        
      default:
        console.warn(`Unknown message type: ${message.type}`);
        this.sendErrorMessage(ws, 'unknown_type', `Unknown message type: ${message.type}`);
    }
  }
  
  /**
   * Handle authentication message
   */
  private handleAuth(ws: WebSocket, message: WebSocketMessage, clientIp: string) {
    const { token, deviceId, deviceName, platform } = message;
    
    // Clear auth timeout
    if ((ws as any).authTimeout) {
      clearTimeout((ws as any).authTimeout);
      delete (ws as any).authTimeout;
    }
    
    // Validate token
    const tokenInfo = this.pairingTokens.get(token);
    if (!tokenInfo || tokenInfo.expiry < Date.now()) {
      this.sendErrorMessage(ws, 'auth_failed', 'Invalid or expired token');
      ws.close(1008, 'Authentication failed');
      return;
    }
    
    // Check if max connections reached
    if (this.clients.size >= this.maxConnections) {
      this.sendErrorMessage(ws, 'auth_failed', 'Maximum connections reached');
      ws.close(1008, 'Too many connections');
      return;
    }
    
    // Generate client ID if not provided
    const clientId = deviceId || randomBytes(8).toString('hex');
    
    // Create client device info
    const device: ClientDevice = {
      id: clientId,
      name: deviceName || `Mobile Device ${clientId.substring(0, 4)}`,
      platform: platform || 'unknown',
      lastConnected: new Date(),
      ipAddress: clientIp
    };
    
    // Store client
    this.clients.set(clientId, { ws, device });
    
    // Remove used token
    this.pairingTokens.delete(token);
    
    // Send success response
    this.sendMessage(ws, {
      type: 'auth_success',
      clientId,
      serverInfo: {
        name: 'TanukiMCP Atlas Desktop',
        version: app.getVersion(),
        platform: process.platform
      }
    });
    
    // Create client storage directory
    this.ensureClientDirectory(clientId);
    
    // Emit client connected event
    this.emit('client-connected', device);
    
    console.log(`Client authenticated: ${device.name} (${device.id})`);
  }
  
  /**
   * Handle heartbeat message
   */
  private handleHeartbeat(ws: WebSocket, message: WebSocketMessage) {
    // Send heartbeat response
    this.sendMessage(ws, {
      type: 'heartbeat_response',
      timestamp: Date.now()
    });
  }
  
  /**
   * Handle chat message
   */
  private handleChatMessage(ws: WebSocket, message: WebSocketMessage) {
    const clientId = this.getClientIdFromWebSocket(ws);
    if (!clientId) {
      this.sendErrorMessage(ws, 'unauthorized', 'Not authenticated');
      return;
    }
    
    // Emit chat message event
    this.emit('chat-message', {
      clientId,
      message: message.content,
      timestamp: Date.now()
    });
    
    // The main application will handle the actual LLM processing
    // and send responses back through sendChatResponse
  }
  
  /**
   * Handle file request
   */
  private handleFileRequest(ws: WebSocket, message: WebSocketMessage) {
    const clientId = this.getClientIdFromWebSocket(ws);
    if (!clientId) {
      this.sendErrorMessage(ws, 'unauthorized', 'Not authenticated');
      return;
    }
    
    const { operation, path: filePath, content } = message;
    
    // Validate file access
    if (!this.validateFileAccess(filePath, clientId)) {
      this.sendErrorMessage(ws, 'access_denied', 'Access to this file is denied');
      return;
    }
    
    // Handle different file operations
    switch (operation) {
      case 'read':
        this.handleFileRead(ws, clientId, filePath);
        break;
        
      case 'write':
        this.handleFileWrite(ws, clientId, filePath, content);
        break;
        
      case 'list':
        this.handleFileList(ws, clientId, filePath);
        break;
        
      case 'delete':
        this.handleFileDelete(ws, clientId, filePath);
        break;
        
      default:
        this.sendErrorMessage(ws, 'invalid_operation', `Invalid file operation: ${operation}`);
    }
  }
  
  /**
   * Handle media processing request
   */
  private handleMediaProcess(ws: WebSocket, message: WebSocketMessage) {
    const clientId = this.getClientIdFromWebSocket(ws);
    if (!clientId) {
      this.sendErrorMessage(ws, 'unauthorized', 'Not authenticated');
      return;
    }
    
    const { mediaType, mediaId, data, options } = message;
    
    // Emit media processing event
    this.emit('media-process', {
      clientId,
      mediaType,
      mediaId,
      data,
      options
    });
    
    // Acknowledge receipt
    this.sendMessage(ws, {
      type: 'media_processing',
      mediaId,
      status: 'processing'
    });
    
    // The main application will handle the actual media processing
    // and send results back through sendMediaResult
  }
  
  /**
   * Handle file read operation
   */
  private handleFileRead(ws: WebSocket, clientId: string, filePath: string) {
    try {
      const fullPath = this.getClientFilePath(clientId, filePath);
      
      if (!fs.existsSync(fullPath)) {
        this.sendErrorMessage(ws, 'file_not_found', `File not found: ${filePath}`);
        return;
      }
      
      const content = fs.readFileSync(fullPath, 'utf8');
      
      this.sendMessage(ws, {
        type: 'file_response',
        operation: 'read',
        path: filePath,
        content,
        success: true
      });
    } catch (error: any) {
      console.error('Error reading file:', error);
      this.sendErrorMessage(ws, 'file_error', `Error reading file: ${error.message}`);
    }
  }
  
  /**
   * Handle file write operation
   */
  private handleFileWrite(ws: WebSocket, clientId: string, filePath: string, content: string) {
    try {
      const fullPath = this.getClientFilePath(clientId, filePath);
      
      // Ensure directory exists
      const dirPath = path.dirname(fullPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
      
      this.sendMessage(ws, {
        type: 'file_response',
        operation: 'write',
        path: filePath,
        success: true
      });
    } catch (error: any) {
      console.error('Error writing file:', error);
      this.sendErrorMessage(ws, 'file_error', `Error writing file: ${error.message}`);
    }
  }
  
  /**
   * Handle file list operation
   */
  private handleFileList(ws: WebSocket, clientId: string, dirPath: string) {
    try {
      const fullPath = this.getClientFilePath(clientId, dirPath);
      
      if (!fs.existsSync(fullPath)) {
        this.sendErrorMessage(ws, 'directory_not_found', `Directory not found: ${dirPath}`);
        return;
      }
      
      const stats = fs.statSync(fullPath);
      if (!stats.isDirectory()) {
        this.sendErrorMessage(ws, 'not_a_directory', `Not a directory: ${dirPath}`);
        return;
      }
      
      const files = fs.readdirSync(fullPath);
      const fileList = files.map(file => {
        const fileStat = fs.statSync(path.join(fullPath, file));
        return {
          name: file,
          path: path.join(dirPath, file).replace(/\\/g, '/'),
          type: fileStat.isDirectory() ? 'directory' : 'file',
          size: fileStat.size,
          modified: fileStat.mtime.toISOString()
        };
      });
      
      this.sendMessage(ws, {
        type: 'file_response',
        operation: 'list',
        path: dirPath,
        files: fileList,
        success: true
      });
    } catch (error: any) {
      console.error('Error listing files:', error);
      this.sendErrorMessage(ws, 'file_error', `Error listing files: ${error.message}`);
    }
  }
  
  /**
   * Handle file delete operation
   */
  private handleFileDelete(ws: WebSocket, clientId: string, filePath: string) {
    try {
      const fullPath = this.getClientFilePath(clientId, filePath);
      
      if (!fs.existsSync(fullPath)) {
        this.sendErrorMessage(ws, 'file_not_found', `File not found: ${filePath}`);
        return;
      }
      
      fs.unlinkSync(fullPath);
      
      this.sendMessage(ws, {
        type: 'file_response',
        operation: 'delete',
        path: filePath,
        success: true
      });
    } catch (error: any) {
      console.error('Error deleting file:', error);
      this.sendErrorMessage(ws, 'file_error', `Error deleting file: ${error.message}`);
    }
  }
  
  /**
   * Send a chat response to a client
   */
  public sendChatResponse(clientId: string, message: string, messageId: string): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;
    
    return this.sendMessage(client.ws, {
      type: 'chat_response',
      content: message,
      messageId,
      timestamp: Date.now()
    });
  }
  
  /**
   * Send a media processing result to a client
   */
  public sendMediaResult(clientId: string, mediaId: string, result: any): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;
    
    return this.sendMessage(client.ws, {
      type: 'media_result',
      mediaId,
      result,
      timestamp: Date.now()
    });
  }
  
  /**
   * Send a status update to a client
   */
  public sendStatusUpdate(clientId: string, status: { [key: string]: any }): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;
    
    return this.sendMessage(client.ws, {
      type: 'status_update',
      status,
      timestamp: Date.now()
    });
  }
  
  /**
   * Send a message to a WebSocket client
   */
  private sendMessage(ws: WebSocket, message: any): boolean {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }
  
  /**
   * Send an error message to a WebSocket client
   */
  private sendErrorMessage(ws: WebSocket, code: string, message: string): boolean {
    return this.sendMessage(ws, {
      type: 'error',
      code,
      message,
      timestamp: Date.now()
    });
  }
  
  /**
   * Get the client ID associated with a WebSocket
   */
  private getClientIdFromWebSocket(ws: WebSocket): string | null {
    for (const [clientId, client] of this.clients.entries()) {
      if (client.ws === ws) {
        return clientId;
      }
    }
    return null;
  }
  
  /**
   * Check if a WebSocket client is authenticated
   */
  private isClientAuthenticated(ws: WebSocket): boolean {
    return this.getClientIdFromWebSocket(ws) !== null;
  }
  
  /**
   * Validate file access permission for a client
   */
  private validateFileAccess(filePath: string, clientId: string): boolean {
    // Normalize path
    const normalizedPath = path.normalize(filePath).replace(/\\/g, '/');
    
    // Don't allow absolute paths or paths with ..
    if (path.isAbsolute(normalizedPath) || normalizedPath.includes('..')) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Get the full file path for a client's file
   */
  private getClientFilePath(clientId: string, filePath: string): string {
    // Normalize path
    const normalizedPath = path.normalize(filePath).replace(/\\/g, '/');
    
    // Create path within client's directory
    return path.join(this.getClientRoot(clientId), normalizedPath);
  }
  
  /**
   * Get the root directory for a client's files
   */
  private getClientRoot(clientId: string): string {
    return path.join(this.storageRoot, 'client_files', clientId);
  }
  
  /**
   * Ensure the storage directory exists
   */
  private ensureStorageDirectory(): void {
    if (!fs.existsSync(this.storageRoot)) {
      fs.mkdirSync(this.storageRoot, { recursive: true });
    }
    
    const clientFilesDir = path.join(this.storageRoot, 'client_files');
    if (!fs.existsSync(clientFilesDir)) {
      fs.mkdirSync(clientFilesDir, { recursive: true });
    }
  }
  
  /**
   * Ensure the client directory exists
   */
  private ensureClientDirectory(clientId: string): void {
    const clientDir = this.getClientRoot(clientId);
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }
  }
  
  /**
   * Clean up expired pairing tokens
   */
  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, info] of this.pairingTokens.entries()) {
      if (info.expiry < now) {
        this.pairingTokens.delete(token);
      }
    }
  }
  
  /**
   * Get the local IP address for connections
   */
  private getLocalIP(): string | null {
    const interfaces = networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
      const networkInterface = interfaces[name];
      
      if (!networkInterface) continue;
      
      for (const iface of networkInterface) {
        // Skip internal and non-IPv4 addresses
        if (!iface.internal && iface.family === 'IPv4') {
          return iface.address;
        }
      }
    }
    
    return null;
  }
  
  /**
   * Get connected clients
   */
  public getConnectedClients(): ClientDevice[] {
    const clients: ClientDevice[] = [];
    for (const [, client] of this.clients.entries()) {
      clients.push(client.device);
    }
    return clients;
  }
  
  /**
   * Get server status
   */
  public getStatus(): { 
    running: boolean;
    port: number;
    clientCount: number;
    clients: ClientDevice[];
  } {
    return {
      running: this.isRunning,
      port: this.port,
      clientCount: this.clients.size,
      clients: this.getConnectedClients()
    };
  }
  
  /**
   * Show status window
   */
  public async showStatusWindow(): Promise<void> {
    if (this.statusWindow) {
      this.statusWindow.focus();
      return;
    }
    
    this.statusWindow = new BrowserWindow({
      width: 400,
      height: 500,
      title: 'TanukiMCP Atlas Mobile Proxy',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    
    // Generate QR code ahead of time to avoid await in template string
    let qrCodeDataUrl = '';
    try {
      const qrResult = await this.generatePairingQRCode();
      qrCodeDataUrl = qrResult.qrCode;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      qrCodeDataUrl = '';
    }
    
    // Get clients HTML
    const clientsHtml = Array.from(this.clients.values())
      .map(client => `
        <div class="client">
          <p>Name: ${client.device.name}</p>
          <p>ID: ${client.device.id}</p>
          <p>Platform: ${client.device.platform}</p>
          <p>Connected: ${client.device.lastConnected.toISOString()}</p>
        </div>
      `)
      .join('');
    
    // Load status page
    // In a real implementation, this would load an HTML file
    this.statusWindow.loadURL(`data:text/html,
      <html>
        <head>
          <title>Mobile Proxy Status</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { font-size: 18px; }
            .status { margin-bottom: 20px; }
            .client { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
            .qr-container { text-align: center; margin: 20px 0; }
            button { padding: 8px 16px; }
          </style>
        </head>
        <body>
          <h1>TanukiMCP Atlas Mobile Proxy</h1>
          <div class="status">
            <p>Status: ${this.isRunning ? 'Running' : 'Stopped'}</p>
            <p>Port: ${this.port}</p>
            <p>Connected Clients: ${this.clients.size}</p>
          </div>
          <div class="qr-container">
            <img id="qrcode" width="200" height="200" src="${qrCodeDataUrl}" />
          </div>
          <button id="regenerate">Regenerate QR Code</button>
          <h2>Connected Clients</h2>
          <div id="clients">${clientsHtml}</div>
          <script>
            // Simple script to update the status
            const updateStatus = async () => {
              // In a real implementation, this would fetch data from the main process
              // This is a placeholder that would be replaced with actual IPC calls
              console.log('Update status triggered');
            };
            
            // Generate QR code
            const generateQR = async () => {
              // In a real implementation, this would call the main process
              // This is a placeholder that would be replaced with actual IPC calls
              console.log('Generate QR triggered');
            };
            
            // Initial updates
            updateStatus();
            
            // Set up refresh
            document.getElementById('regenerate').addEventListener('click', generateQR);
            setInterval(updateStatus, 5000);
          </script>
        </body>
      </html>
    `);
    
    this.statusWindow.on('closed', () => {
      this.statusWindow = null;
    });
  }
}

// Export singleton instance
export const proxyServer = new ProxyServer(); 