# API Endpoint Convention Analysis & Fixes

## 🚨 Critical Issues Identified

### 1. Architecture Mismatch
**Problem:** TanukiMCP Atlas is an Electron desktop app that uses IPC (Inter-Process Communication), not HTTP APIs. The todo.md assumes web endpoints that don't exist.

**Current Architecture:**
- **Main Process** (Node.js) ↔ **Renderer Process** (React) via Electron IPC
- **External API calls** to Ollama at `http://localhost:11434/api/`
- **No internal HTTP server** for the main application

### 2. Inconsistent API Conventions

**✅ Mobile Server (Mostly Correct):**
```typescript
// Current mobile-server endpoints
POST /api/auth/token
POST /api/chat/message  
GET /api/tools/available
GET /api/status/health
```

**❌ Missing Versioning:**
Should be: `/api/v1/auth/token`, `/api/v1/chat/message`, etc.

**❌ Todo.md Validation URLs (All Wrong):**
```typescript
// These endpoints DON'T EXIST:
http://localhost:3000/admin/database
http://localhost:3000/qa/tournament
http://localhost:3000/models/management
```

## 🛠️ Required Actions

### Action 1: Fix Mobile Server API Versioning
**File:** `packages/mobile-server/src/mobile-server.ts`

**Update all endpoints to include `/api/v1/` prefix:**
```typescript
// Authentication routes  
this.app.post('/api/v1/auth/token', this.generateToken.bind(this));
this.app.post('/api/v1/auth/qr', this.generateQRCode.bind(this));

// Chat routes
this.app.post('/api/v1/chat/message', this.handleChatMessage.bind(this));
this.app.get('/api/v1/chat/history', this.getChatHistory.bind(this));
this.app.delete('/api/v1/chat/clear', this.clearChatHistory.bind(this));

// Tool routes
this.app.get('/api/v1/tools/available', this.getAvailableTools.bind(this));
this.app.post('/api/v1/tools/execute', this.executeTool.bind(this));

// Status routes
this.app.get('/api/v1/status/health', this.getHealthStatus.bind(this));
this.app.get('/api/v1/status/connection', this.getConnectionStatus.bind(this));
```

### Action 2: Create Optional HTTP API Server for Testing
**New File:** `packages/main/src/services/http-api-server.ts`

For management and testing purposes, create an optional HTTP server:
```typescript
export class HTTPAPIServer {
  private app: express.Application;
  private server: Server | null = null;
  
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }
  
  private setupRoutes(): void {
    // Admin routes
    this.app.get('/api/v1/admin/database/status', this.getDatabaseStatus.bind(this));
    this.app.get('/api/v1/admin/tier-management', this.getTierStatus.bind(this));
    
    // QA routes  
    this.app.get('/api/v1/qa/tournament/status', this.getTournamentStatus.bind(this));
    this.app.get('/api/v1/qa/council-management', this.getCouncilStatus.bind(this));
    
    // Model routes
    this.app.get('/api/v1/models/management', this.getModelStatus.bind(this));
    this.app.get('/api/v1/models/apollo', this.getApolloStatus.bind(this));
    
    // MCP routes
    this.app.get('/api/v1/mcp/transports', this.getTransportStatus.bind(this));
    this.app.get('/api/v1/mcp/health', this.getMCPHealth.bind(this));
  }
  
  async start(port: number = 3001): Promise<void> {
    this.server = this.app.listen(port, () => {
      console.log(`🌐 HTTP API Server running on http://localhost:${port}`);
    });
  }
}
```

### Action 3: Update Todo.md Validation Methods
Replace HTTP endpoint testing with appropriate validation:

**Option A: IPC Testing (Primary)**
```typescript
// Instead of: http://localhost:3000/admin/database
// Use: Electron IPC testing
const result = await window.electronAPI.invoke('db:health');
```

**Option B: HTTP API Server Testing (Optional)**
```typescript  
// If HTTP API server is enabled
const response = await fetch('http://localhost:3001/api/v1/admin/database/status');
```

**Option C: Direct Service Testing**
```typescript
// Test services directly through IPC
npm run dev
# Open DevTools Console and test:
window.electronAPI.invoke('ollama:listModels')
window.electronAPI.invoke('enhancedLLM:getStatus')
```

## 📝 Updated Todo.md Validation Pattern

Each task should use this pattern:

```markdown
**Validation Methodology:**
```bash
npm run dev
# Open Electron DevTools Console (Ctrl+Shift+I)
# Test via IPC:
await window.electronAPI.invoke('specific-ipc-channel', params)

# OR if HTTP API server is enabled:
# Navigate to http://localhost:3001/api/v1/specific/endpoint
```

**Success Metrics:**
- [ ] IPC call returns expected data structure
- [ ] Electron main process logs show correct processing
- [ ] UI updates reflect the backend changes
- [ ] Error handling works for invalid inputs
```

## 🎯 Recommended Implementation Order

1. **Immediate Fix:** Update mobile-server to use `/api/v1/` conventions
2. **Architecture Decision:** Decide if HTTP API server is needed for testing
3. **Todo.md Update:** Correct all validation methodologies  
4. **Documentation:** Update all API references to use consistent conventions

## 📚 Consistent API Convention Standard

**For all future APIs:**
```
/api/v1/{resource}/{action}

Examples:
/api/v1/auth/token
/api/v1/models/list  
/api/v1/chat/send
/api/v1/tools/execute
/api/v1/admin/health
```

**HTTP Methods:**
- GET: Retrieve data
- POST: Create/Send data  
- PUT: Update data
- DELETE: Remove data
- PATCH: Partial update

**Response Format:**
```json
{
  "success": true,
  "data": {...},
  "error": null,
  "version": "v1"
}
```