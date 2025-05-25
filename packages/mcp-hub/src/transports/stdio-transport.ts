import { spawn, ChildProcess } from 'child_process';
import { BaseTransport } from './base-transport';
import { StdioTransportConfig } from '../types';

export class StdioTransport extends BaseTransport {
  private childProcess?: ChildProcess;
  private messageBuffer: string = '';

  constructor(config: StdioTransportConfig) {
    super(config);
  }

  async connect(): Promise<void> {
    if (this.connected || this.childProcess) {
      await this.disconnect();
    }

    const config = this.config as StdioTransportConfig;
    
    try {
      this.childProcess = spawn(config.command, config.args || [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, ...config.env },
        cwd: config.cwd || process.cwd()
      });

      this.setupChildProcessHandlers();
      
      // Wait for the process to start
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.childProcess!.on('spawn', () => {
          clearTimeout(timeout);
          this.handleConnect();
          resolve();
        });

        this.childProcess!.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

    } catch (error) {
      throw new Error(`Failed to start MCP server: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.childProcess) {
      this.childProcess.kill('SIGTERM');
      
      // Wait for graceful shutdown, then force kill
      setTimeout(() => {
        if (this.childProcess && !this.childProcess.killed) {
          this.childProcess.kill('SIGKILL');
        }
      }, 5000);

      this.childProcess = undefined;
    }
    
    this.handleDisconnect();
  }

  async send(message: any): Promise<void> {
    if (!this.childProcess || !this.connected) {
      throw new Error('Transport not connected');
    }

    const jsonMessage = JSON.stringify(message) + '\n';
    
    return new Promise<void>((resolve, reject) => {
      this.childProcess!.stdin!.write(jsonMessage, 'utf8', (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private setupChildProcessHandlers(): void {
    if (!this.childProcess) return;

    // Handle stdout messages
    this.childProcess.stdout!.on('data', (data: Buffer) => {
      this.messageBuffer += data.toString('utf8');
      this.processMessages();
    });

    // Handle stderr for debugging
    this.childProcess.stderr!.on('data', (data: Buffer) => {
      console.warn(`MCP Server stderr: ${data.toString('utf8')}`);
    });

    // Handle process exit
    this.childProcess.on('exit', (code, signal) => {
      console.log(`MCP Server exited with code ${code}, signal ${signal}`);
      this.handleDisconnect();
      
      // Auto-reconnect if configured
      const config = this.config as StdioTransportConfig;
      if (code !== 0 && !signal) {
        this.scheduleReconnect();
      }
    });

    // Handle process errors
    this.childProcess.on('error', (error) => {
      console.error('MCP Server process error:', error);
      this.handleError(error);
    });
  }

  private processMessages(): void {
    const lines = this.messageBuffer.split('\n');
    this.messageBuffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.trim()) {
        try {
          const message = JSON.parse(line);
          this.handleMessage(message);
        } catch (error) {
          console.warn('Failed to parse JSON message:', line, error);
        }
      }
    }
  }

  destroy(): void {
    this.disconnect();
    super.destroy();
  }
} 