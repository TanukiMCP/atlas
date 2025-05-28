"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const qrcode_1 = __importDefault(require("qrcode"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
class MobileServer {
    app;
    server;
    io;
    config;
    clients = new Map();
    tokens = new Map();
    isRunning = false;
    constructor(config) {
        this.config = config;
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "*", // In production, restrict to local network
                methods: ["GET", "POST"]
            }
        });
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
    }
    setupMiddleware() {
        // CORS for local network access
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                // Allow local network origins
                if (!origin || this.isLocalNetworkOrigin(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        }));
        // Rate limiting
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP'
        });
        this.app.use('/api/', limiter);
        // JSON parsing
        this.app.use(express_1.default.json({ limit: '10mb' }));
        // Serve PWA static files
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../client/dist')));
        // Authentication middleware
        this.app.use('/api/', this.authenticateToken.bind(this));
    }
    setupRoutes() {
        // Authentication routes (no auth required)
        this.app.post('/api/auth/token', this.generateToken.bind(this));
        this.app.post('/api/auth/qr', this.generateQRCode.bind(this));
        // Chat routes
        this.app.post('/api/chat/message', this.handleChatMessage.bind(this));
        this.app.get('/api/chat/history', this.getChatHistory.bind(this));
        this.app.delete('/api/chat/clear', this.clearChatHistory.bind(this));
        // Tool routes
        this.app.get('/api/tools/available', this.getAvailableTools.bind(this));
        this.app.post('/api/tools/execute', this.executeTool.bind(this));
        // Status routes
        this.app.get('/api/status/health', this.getHealthStatus.bind(this));
        this.app.get('/api/status/connection', this.getConnectionStatus.bind(this));
        // PWA manifest and service worker
        this.app.get('/manifest.json', this.servePWAManifest.bind(this));
        this.app.get('/sw.js', this.serveServiceWorker.bind(this));
        // Catch-all for PWA routing
        this.app.get('*', (req, res) => {
            res.sendFile(path_1.default.join(__dirname, '../client/dist/index.html'));
        });
    }
    setupWebSocket() {
        this.io.on('connection', (socket) => {
            console.log('Mobile client connected:', socket.id);
            socket.on('authenticate', async (token) => {
                const tokenData = this.tokens.get(token);
                if (tokenData && tokenData.expiresAt > new Date()) {
                    socket.join(tokenData.clientId);
                    socket.emit('authenticated', { success: true });
                }
                else {
                    socket.emit('authenticated', { success: false, error: 'Invalid token' });
                    socket.disconnect();
                }
            });
            socket.on('chat:message', async (data) => {
                try {
                    // Forward to Atlas LLM processor
                    const response = await this.forwardToAtlas('chat', data);
                    socket.emit('chat:response', response);
                }
                catch (error) {
                    socket.emit('chat:error', { error: error.message });
                }
            });
            socket.on('tool:execute', async (data) => {
                try {
                    // Validate tool is mobile-safe
                    if (!this.isMobileSafeTool(data.toolName)) {
                        throw new Error('Tool not available on mobile');
                    }
                    const response = await this.forwardToAtlas('tool', data);
                    socket.emit('tool:response', response);
                }
                catch (error) {
                    socket.emit('tool:error', { error: error.message });
                }
            });
            socket.on('disconnect', () => {
                console.log('Mobile client disconnected:', socket.id);
            });
        });
    }
    async generateToken(req, res) {
        try {
            const clientId = crypto_1.default.randomUUID();
            const token = crypto_1.default.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + this.config.tokenExpiry * 60 * 60 * 1000);
            this.tokens.set(token, { clientId, expiresAt });
            const client = {
                id: clientId,
                token,
                connectedAt: new Date(),
                lastActivity: new Date(),
                userAgent: req.headers['user-agent'] || 'Unknown',
                ipAddress: req.ip || 'Unknown'
            };
            this.clients.set(clientId, client);
            res.json({
                success: true,
                token,
                clientId,
                expiresAt: expiresAt.toISOString()
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async generateQRCode(req, res) {
        try {
            const { token } = req.body;
            const serverUrl = `http://${this.config.host}:${this.config.port}`;
            const pwaUrl = `${serverUrl}?token=${token}`;
            const qrCodeDataUrl = await qrcode_1.default.toDataURL(pwaUrl, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            res.json({
                success: true,
                qrCode: qrCodeDataUrl,
                url: pwaUrl
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async handleChatMessage(req, res) {
        try {
            const { message, context } = req.body;
            // Forward to Atlas enhanced LLM processor
            const response = await this.forwardToAtlas('chat', {
                message,
                context,
                source: 'mobile',
                clientId: req.clientId
            });
            res.json({ success: true, response });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async getChatHistory(req, res) {
        try {
            const { limit = 50 } = req.query;
            const history = await this.forwardToAtlas('chat:history', {
                clientId: req.clientId,
                limit: parseInt(limit)
            });
            res.json({ success: true, history });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async clearChatHistory(req, res) {
        try {
            await this.forwardToAtlas('chat:clear', {
                clientId: req.clientId
            });
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async getAvailableTools(req, res) {
        try {
            const allTools = await this.forwardToAtlas('tools:list', {});
            // Filter to mobile-safe tools only
            const mobileTools = allTools.filter((tool) => this.isMobileSafeTool(tool.name));
            res.json({ success: true, tools: mobileTools });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async executeTool(req, res) {
        try {
            const { toolName, parameters } = req.body;
            if (!this.isMobileSafeTool(toolName)) {
                throw new Error('Tool not available on mobile');
            }
            const result = await this.forwardToAtlas('tools:execute', {
                toolName,
                parameters,
                clientId: req.clientId,
                source: 'mobile'
            });
            res.json({ success: true, result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async getHealthStatus(req, res) {
        const status = {
            server: 'healthy',
            uptime: process.uptime(),
            connections: this.clients.size,
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString()
        };
        res.json({ success: true, status });
    }
    async getConnectionStatus(req, res) {
        const client = this.clients.get(req.clientId);
        if (!client) {
            return res.status(404).json({ success: false, error: 'Client not found' });
        }
        res.json({
            success: true,
            connection: {
                clientId: client.id,
                connectedAt: client.connectedAt,
                lastActivity: client.lastActivity,
                isActive: true
            }
        });
    }
    servePWAManifest(req, res) {
        const manifest = {
            name: 'TanukiMCP Atlas Mobile',
            short_name: 'Atlas Mobile',
            description: 'Mobile client for TanukiMCP Atlas',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#000000',
            icons: [
                {
                    src: '/icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: '/icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        };
        res.json(manifest);
    }
    serveServiceWorker(req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(path_1.default.join(__dirname, '../client/dist/sw.js'));
    }
    authenticateToken(req, res, next) {
        // Skip auth for certain routes
        if (req.path.includes('/auth/') || req.path === '/manifest.json' || req.path === '/sw.js') {
            return next();
        }
        const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
        if (!token) {
            return res.status(401).json({ success: false, error: 'No token provided' });
        }
        const tokenData = this.tokens.get(token);
        if (!tokenData || tokenData.expiresAt < new Date()) {
            return res.status(401).json({ success: false, error: 'Invalid or expired token' });
        }
        req.clientId = tokenData.clientId;
        // Update last activity
        const client = this.clients.get(tokenData.clientId);
        if (client) {
            client.lastActivity = new Date();
        }
        next();
    }
    isMobileSafeTool(toolName) {
        const mobileSafeTools = [
            // Clear Thought tools (all safe)
            'sequential_thinking',
            'mental_models',
            'design_patterns',
            'programming_paradigms',
            'debugging_approaches',
            'collaborative_reasoning',
            'decision_framework',
            'metacognitive_monitoring',
            'scientific_method',
            'structured_argumentation',
            'visual_reasoning',
            // Research and context tools
            'web_search',
            'web_browse',
            'get_current_time',
            'get_current_date',
            'get_weather',
            // Image generation
            'generate_image',
            'enhance_image_prompt',
            // Text processing
            'analyze_text',
            'summarize_text',
            'translate_text',
            'extract_keywords'
        ];
        return mobileSafeTools.includes(toolName);
    }
    isLocalNetworkOrigin(origin) {
        // Check if origin is from local network
        const localPatterns = [
            /^https?:\/\/localhost/,
            /^https?:\/\/127\.0\.0\.1/,
            /^https?:\/\/192\.168\./,
            /^https?:\/\/10\./,
            /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./
        ];
        return localPatterns.some(pattern => pattern.test(origin));
    }
    async forwardToAtlas(operation, data) {
        // This would integrate with the main Atlas application
        // For now, return mock responses
        switch (operation) {
            case 'chat':
                return { message: 'Mock response from Atlas LLM', timestamp: new Date() };
            case 'chat:history':
                return [];
            case 'tools:list':
                return this.getMockMobileTools();
            case 'tools:execute':
                return { result: 'Mock tool execution result' };
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    }
    getMockMobileTools() {
        return [
            {
                name: 'sequential_thinking',
                description: 'Structured thought processes with revision support',
                category: 'thinking',
                parameters: {},
                mobileSafe: true
            },
            {
                name: 'web_search',
                description: 'Search the web for information',
                category: 'research',
                parameters: {},
                mobileSafe: true
            },
            {
                name: 'generate_image',
                description: 'Generate images using Stable Diffusion',
                category: 'image',
                parameters: {},
                mobileSafe: true
            }
        ];
    }
    async start() {
        if (this.isRunning) {
            throw new Error('Mobile server is already running');
        }
        return new Promise((resolve, reject) => {
            this.server.listen(this.config.port, this.config.host, () => {
                this.isRunning = true;
                console.log(`Mobile server running on http://${this.config.host}:${this.config.port}`);
                resolve();
            });
            this.server.on('error', (error) => {
                reject(error);
            });
        });
    }
    async stop() {
        if (!this.isRunning) {
            return;
        }
        return new Promise((resolve) => {
            this.server.close(() => {
                this.isRunning = false;
                console.log('Mobile server stopped');
                resolve();
            });
        });
    }
    getConnectionInfo() {
        const url = `http://${this.config.host}:${this.config.port}`;
        return { url };
    }
    getConnectedClients() {
        return Array.from(this.clients.values());
    }
}
exports.MobileServer = MobileServer;
//# sourceMappingURL=mobile-server.js.map