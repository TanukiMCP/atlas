# Mobile PWA Server - Atlas Extension

## Overview

This package extends TanukiMCP Atlas to host a mobile-accessible server, allowing users to access their local LLM and tools from mobile devices via a Progressive Web App (PWA) client.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Desktop Atlas Host                       │
├─────────────────────────────────────────────────────────────┤
│  Core Atlas Application                                     │
│  ├── Local LLM (Ollama)                                     │
│  ├── Built-in Tools (Clear Thought, File Ops, etc.)        │
│  └── MCP Client Hub (External Tools)                       │
├─────────────────────────────────────────────────────────────┤
│  Mobile Server Extension                                    │
│  ├── HTTP/SSE Server (Express + Socket.io)                 │
│  ├── QR Code Generator (Mobile Pairing)                    │
│  ├── Mobile Tool Filter (Mobile-Safe Tools Only)           │
│  ├── Authentication & Security                             │
│  └── Auto-Startup Management                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/SSE + WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Mobile PWA Client                        │
├─────────────────────────────────────────────────────────────┤
│  Progressive Web App                                        │
│  ├── Mobile-Optimized Chat Interface                       │
│  ├── Touch-Friendly Tool Selection                         │
│  ├── Offline Capability (Service Worker)                   │
│  ├── Push Notifications                                     │
│  └── Auto-Update from GitHub Releases                      │
├─────────────────────────────────────────────────────────────┤
│  Mobile-Safe Tools Only                                     │
│  ├── Clear Thought Tools (All)                             │
│  ├── Web Research (Puppeteer)                              │
│  ├── Date/Time Context                                      │
│  ├── Image Generation (Stable Diffusion)                   │
│  ├── Text Processing                                        │
│  └── Knowledge Retrieval                                    │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Desktop Server Host
- **Auto-Startup**: Optional auto-run on system startup
- **QR Code Pairing**: Generate unique QR codes for mobile client installation
- **Security**: Token-based authentication, local network only
- **Tool Filtering**: Only expose mobile-safe tools (no file system access)
- **Connection Management**: Handle mobile client connections and disconnections

### Mobile PWA Client
- **ChatGPT-like UI**: Modern, mobile-optimized interface
- **Offline Support**: Service worker for offline functionality
- **Push Notifications**: Update notifications synced with GitHub releases
- **Touch Optimized**: Gesture-friendly interface design
- **Auto-Update**: Seamless updates from GitHub release pipeline

### Mobile-Safe Tools
- **Thinking Tools**: All Clear Thought reasoning frameworks
- **Web Research**: Puppeteer-based web browsing and research
- **Context Tools**: Date, time, location context
- **Image Generation**: Local Stable Diffusion integration
- **Text Processing**: Analysis, summarization, translation
- **Knowledge Retrieval**: Information lookup and synthesis

## Security Model

### Network Security
- **Local Network Only**: Server only accessible on local network
- **Token Authentication**: Unique tokens per mobile client
- **HTTPS/WSS**: Encrypted connections (self-signed certificates)
- **Rate Limiting**: Prevent abuse and resource exhaustion

### Tool Security
- **No File System Access**: Mobile clients cannot access desktop files
- **No System Commands**: No terminal or system-level operations
- **Sandboxed Operations**: All mobile tools run in isolated contexts
- **Resource Limits**: CPU, memory, and time limits for mobile operations

## Installation & Setup

### Desktop Configuration
1. Enable mobile server in Atlas settings
2. Configure auto-startup (optional)
3. Set network interface and port
4. Generate mobile client QR code

### Mobile Client Installation
1. Scan QR code from desktop Atlas
2. Install PWA to home screen
3. Authenticate with generated token
4. Begin using mobile interface

## API Endpoints

### Mobile Server API
```typescript
// Authentication
POST /api/auth/token - Generate authentication token
POST /api/auth/verify - Verify token validity

// Chat Interface
POST /api/chat/message - Send message to LLM
GET /api/chat/history - Get chat history
DELETE /api/chat/clear - Clear chat history

// Tool Operations
GET /api/tools/available - Get mobile-safe tools
POST /api/tools/execute - Execute tool with parameters

// System Status
GET /api/status/health - Server health check
GET /api/status/connection - Connection status
```

### WebSocket Events
```typescript
// Real-time communication
'message:stream' - Streaming LLM responses
'tool:progress' - Tool execution progress
'connection:status' - Connection state changes
'update:available' - App update notifications
```

## Development

### Local Development
```bash
# Start mobile server in development mode
npm run dev:mobile-server

# Build mobile PWA client
npm run build:mobile-client

# Test mobile connection
npm run test:mobile-connection
```

### Production Deployment
- Desktop server auto-starts with Atlas
- Mobile PWA served from desktop server
- Auto-update mechanism via GitHub releases
- Offline-first architecture with service workers 