# TanukiMCP Atlas Mobile Proxy Architecture

## Overview

The TanukiMCP Atlas Mobile Proxy architecture enables seamless cross-device experiences by allowing mobile devices to connect to a desktop instance of TanukiMCP Atlas. The desktop application acts as a proxy server, enabling mobile clients to leverage the computational resources and LLM capabilities of the desktop environment while maintaining proper isolation of file systems and user data.

```
┌─────────────────────────────┐           ┌────────────────────────────┐
│                             │           │                            │
│  Desktop TanukiMCP Atlas    │◄─────────►│  Mobile TanukiMCP Atlas    │
│  (Proxy Server)             │    QR     │  (Client)                  │
│                             │   Code    │                            │
└───────────┬─────────────────┘  Pairing  └────────────────────────────┘
            │                      
            ▼                      
┌───────────────────────────┐     
│                           │     
│  OpenRouter API Services  │     
│                           │     
└───────────────────────────┘     
```

## Core Components

### 1. Desktop Proxy Server

The desktop application includes a WebSocket-based proxy server that:

- Exposes a secure local API for mobile clients
- Manages authentication and session tracking
- Proxies OpenRouter API requests
- Handles media processing (OCR, image/video analysis)
- Maintains separate contexts for mobile vs. desktop chat sessions

### 2. QR Code Pairing System

Secure device pairing is facilitated through a QR code system:

- Desktop generates a unique pairing token and QR code
- Mobile client scans QR code to establish initial connection
- Secure handshake exchanges encryption keys
- Persistent connection details stored on both devices

### 3. Mobile Client Application

The mobile application is designed to:

- Provide a mobile-optimized UI for TanukiMCP Atlas
- Connect to desktop proxy via QR code pairing
- Maintain local file system isolation
- Support media capture and upload
- Provide offline capabilities when disconnected

### 4. Media Processing Pipeline

Leverages existing Python libraries to enable:

- OCR for text extraction from images
- Image content analysis
- Video frame extraction and analysis
- Audio transcription
- Multi-modal context generation for LLMs

## Architecture Diagrams

### System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Desktop TanukiMCP Atlas                     │
│                                                                │
│  ┌─────────────┐   ┌──────────────┐    ┌───────────────────┐   │
│  │             │   │              │    │                   │   │
│  │  Electron   │   │  Proxy       │    │  Media Processing │   │
│  │  Main UI    │◄─►│  Server      │◄───┤  Pipeline         │   │
│  │             │   │              │    │                   │   │
│  └─────────────┘   └──────┬───────┘    └───────────────────┘   │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ WebSocket/Secure API
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                     Mobile TanukiMCP Atlas                     │
│                                                                │
│  ┌─────────────┐   ┌──────────────┐    ┌───────────────────┐   │
│  │             │   │              │    │                   │   │
│  │  React      │   │  Proxy       │    │  Media Capture    │   │
│  │  Native UI  │◄─►│  Client      │◄───┤  & Upload         │   │
│  │             │   │              │    │                   │   │
│  └─────────────┘   └──────────────┘    └───────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌───────────┐      ┌───────────┐      ┌───────────────┐      ┌──────────────┐
│           │      │           │      │               │      │              │
│  Mobile   │─────►│  Desktop  │─────►│  OpenRouter   │─────►│  LLM         │
│  Client   │◄─────│  Proxy    │◄─────│  API          │◄─────│  Processing  │
│           │      │           │      │               │      │              │
└───────────┘      └─────┬─────┘      └───────────────┘      └──────────────┘
                         │
                         ▼
                   ┌───────────┐
                   │           │
                   │  Media    │
                   │  Pipeline │
                   │           │
                   └───────────┘
```

## Security Model

The security architecture follows these principles:

1. **Secure Pairing**: One-time QR code pairing with expiring tokens
2. **Encrypted Communication**: All traffic between mobile and desktop is encrypted
3. **File System Isolation**: Complete separation of mobile and desktop file systems
4. **Authentication**: Session-based authentication with automatic expiry
5. **Localhost Binding**: Proxy server only available on local network
6. **Permission Model**: Explicit permissions for media access and processing

## Implementation Details

### 1. Desktop Proxy Server

The proxy server is implemented using a WebSocket server integrated with the Electron main process:

```typescript
// Simplified implementation overview
class ProxyServer {
  private server: WebSocketServer;
  private clients: Map<string, WebSocket>;
  private pairingTokens: Map<string, { token: string, expiry: number }>;
  
  constructor() {
    this.server = new WebSocketServer({ port: 0 }); // Dynamic port
    this.clients = new Map();
    this.pairingTokens = new Map();
    
    this.server.on('connection', this.handleConnection);
  }
  
  generatePairingToken(): string {
    // Generate secure random token for QR code
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minute expiry
    
    this.pairingTokens.set(token, { token, expiry });
    return token;
  }
  
  generateQRCode(token: string): string {
    // Generate QR code containing connection details and token
    const connectionDetails = {
      token,
      ip: this.getLocalIP(),
      port: this.server.address().port
    };
    
    return qrcode.generate(JSON.stringify(connectionDetails));
  }
  
  handleConnection(ws: WebSocket, req: IncomingMessage) {
    // Handle client connection and authentication
    // Validate pairing token
    // Setup secure session
  }
  
  // Additional methods for handling requests, media processing, etc.
}
```

### 2. Mobile Client

The mobile client establishes and maintains connection to the desktop proxy:

```typescript
// Simplified implementation overview
class ProxyClient {
  private ws: WebSocket | null = null;
  private connectionDetails: ConnectionDetails | null = null;
  
  connectViaQRCode(qrData: string): Promise<boolean> {
    try {
      const details = JSON.parse(qrData);
      this.connectionDetails = details;
      
      return this.connect(details);
    } catch (error) {
      console.error('Failed to parse QR code:', error);
      return Promise.resolve(false);
    }
  }
  
  private connect(details: ConnectionDetails): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const { ip, port, token } = details;
      const ws = new WebSocket(`ws://${ip}:${port}`);
      
      ws.onopen = () => {
        // Perform authentication handshake with token
        ws.send(JSON.stringify({ type: 'auth', token }));
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'auth_success') {
          this.ws = ws;
          this.setupListeners();
          resolve(true);
        } else if (data.type === 'auth_failed') {
          reject(new Error(data.message));
        }
      };
      
      ws.onerror = (error) => {
        reject(error);
      };
    });
  }
  
  // Additional methods for sending requests, handling responses, etc.
}
```

### 3. File System Isolation

Files are isolated between devices by maintaining separate namespaces:

```typescript
// Simplified implementation overview
class FileSystemManager {
  private deviceId: string;
  
  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }
  
  // On desktop
  handleFileRequest(request: FileRequest, clientId: string): FileResponse {
    // Ensure client can only access their own namespace
    if (!this.validateFileAccess(request.path, clientId)) {
      return { success: false, error: 'Access denied' };
    }
    
    // Handle file operation
    switch (request.operation) {
      case 'read': return this.readFile(request.path, clientId);
      case 'write': return this.writeFile(request.path, request.content, clientId);
      case 'list': return this.listFiles(request.path, clientId);
      // other operations
    }
  }
  
  private validateFileAccess(path: string, clientId: string): boolean {
    // Ensure path is within client's namespace
    const normalizedPath = this.normalizePath(path);
    const clientRoot = this.getClientRoot(clientId);
    
    return normalizedPath.startsWith(clientRoot);
  }
  
  private getClientRoot(clientId: string): string {
    // Return isolated root directory for this client
    return path.join(this.getStorageRoot(), 'client_files', clientId);
  }
}
```

### 4. Media Processing

The media processing pipeline leverages Python libraries for advanced capabilities:

```typescript
// Simplified implementation overview
class MediaProcessor {
  private pythonProcess: ChildProcess | null = null;
  
  constructor() {
    // Start Python process for media processing
    this.pythonProcess = spawn('python', ['media_processor.py']);
    this.setupPythonIPC();
  }
  
  processImage(imagePath: string, options: ProcessingOptions): Promise<ProcessingResult> {
    // Send processing request to Python process
    return this.sendRequest({
      type: 'process_image',
      path: imagePath,
      options
    });
  }
  
  extractTextFromImage(imagePath: string): Promise<string> {
    // OCR processing
    return this.processImage(imagePath, { task: 'ocr' })
      .then(result => result.text || '');
  }
  
  // Additional methods for video processing, etc.
}
```

## API Contract

### Proxy Server API

| Endpoint               | Method | Description                      |
|------------------------|--------|----------------------------------|
| `/auth`                | POST   | Authenticate with pairing token  |
| `/chat/message`        | POST   | Send chat message                |
| `/media/process`       | POST   | Process media file               |
| `/files/list`          | GET    | List files in namespace          |
| `/files/read`          | GET    | Read file content                |
| `/files/write`         | POST   | Write file content               |
| `/files/upload`        | POST   | Upload file                      |

## WebSocket Message Types

| Message Type           | Direction      | Description                      |
|------------------------|----------------|----------------------------------|
| `auth`                 | Client→Server  | Authenticate with token          |
| `auth_success`         | Server→Client  | Authentication successful        |
| `auth_failed`          | Server→Client  | Authentication failed            |
| `chat_message`         | Both           | Chat message                     |
| `chat_response`        | Server→Client  | LLM response                     |
| `file_request`         | Client→Server  | File operation request           |
| `file_response`        | Server→Client  | File operation result            |
| `media_process`        | Client→Server  | Process media request            |
| `media_result`         | Server→Client  | Media processing result          |
| `status_update`        | Server→Client  | Proxy status update              |

## User Experience Flow

1. **Pairing Process**:
   - User clicks "Host Proxy" in desktop app
   - System generates QR code
   - User scans QR code with mobile app
   - Connection established with secure handshake

2. **Mobile Usage**:
   - User interacts with mobile interface
   - Requests proxied to desktop
   - LLM responses streamed back to mobile
   - File operations contained to mobile namespace

3. **Media Processing**:
   - User captures media on mobile
   - Media uploaded to desktop
   - Processing performed using Python libraries
   - Results sent back to mobile client

## Implementation Roadmap

1. **Phase 1: Core Infrastructure**
   - Implement WebSocket proxy server in Electron
   - Develop QR code generation and pairing system
   - Create basic proxy client for mobile

2. **Phase 2: File System Isolation**
   - Implement namespace separation
   - Develop file operation handling
   - Ensure secure access controls

3. **Phase 3: Media Processing**
   - Integrate Python libraries for media analysis
   - Implement OCR and image understanding
   - Add video frame extraction and analysis

4. **Phase 4: Mobile UI**
   - Develop mobile-optimized interface
   - Implement media capture capabilities
   - Create offline capabilities

## Performance Considerations

- WebSocket connections maintained with heartbeats
- Media processing performed in separate process to avoid blocking
- Progressive loading for large media files
- Caching of processing results to avoid redundant work

## Offline Capabilities

- Mobile client caches recent conversations
- Background sync when connection restored
- Local file operations when disconnected
- Queued media processing requests

## Conclusion

The TanukiMCP Atlas Mobile Proxy architecture provides a seamless cross-device experience while maintaining security and performance. By leveraging the computational resources of the desktop environment, mobile users can access advanced LLM and media processing capabilities that might otherwise be unavailable on mobile devices alone. 