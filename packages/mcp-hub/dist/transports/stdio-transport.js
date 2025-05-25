"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdioTransport = void 0;
const child_process_1 = require("child_process");
const base_transport_1 = require("./base-transport");
class StdioTransport extends base_transport_1.BaseTransport {
    childProcess;
    messageBuffer = '';
    constructor(config) {
        super(config);
    }
    async connect() {
        if (this.connected || this.childProcess) {
            await this.disconnect();
        }
        const config = this.config;
        try {
            this.childProcess = (0, child_process_1.spawn)(config.command, config.args || [], {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: { ...process.env, ...config.env },
                cwd: config.cwd || process.cwd()
            });
            this.setupChildProcessHandlers();
            // Wait for the process to start
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 10000);
                this.childProcess.on('spawn', () => {
                    clearTimeout(timeout);
                    this.handleConnect();
                    resolve();
                });
                this.childProcess.on('error', (error) => {
                    clearTimeout(timeout);
                    reject(error);
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to start MCP server: ${error}`);
        }
    }
    async disconnect() {
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
    async send(message) {
        if (!this.childProcess || !this.connected) {
            throw new Error('Transport not connected');
        }
        const jsonMessage = JSON.stringify(message) + '\n';
        return new Promise((resolve, reject) => {
            this.childProcess.stdin.write(jsonMessage, 'utf8', (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    setupChildProcessHandlers() {
        if (!this.childProcess)
            return;
        // Handle stdout messages
        this.childProcess.stdout.on('data', (data) => {
            this.messageBuffer += data.toString('utf8');
            this.processMessages();
        });
        // Handle stderr for debugging
        this.childProcess.stderr.on('data', (data) => {
            console.warn(`MCP Server stderr: ${data.toString('utf8')}`);
        });
        // Handle process exit
        this.childProcess.on('exit', (code, signal) => {
            console.log(`MCP Server exited with code ${code}, signal ${signal}`);
            this.handleDisconnect();
            // Auto-reconnect if configured
            const config = this.config;
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
    processMessages() {
        const lines = this.messageBuffer.split('\n');
        this.messageBuffer = lines.pop() || ''; // Keep incomplete line in buffer
        for (const line of lines) {
            if (line.trim()) {
                try {
                    const message = JSON.parse(line);
                    this.handleMessage(message);
                }
                catch (error) {
                    console.warn('Failed to parse JSON message:', line, error);
                }
            }
        }
    }
    destroy() {
        this.disconnect();
        super.destroy();
    }
}
exports.StdioTransport = StdioTransport;
