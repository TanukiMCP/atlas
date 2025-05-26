"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolExecutionPanel = void 0;
const react_1 = __importStar(require("react"));
const mcp_service_1 = require("../../services/mcp-service");
const ToolExecutionPanel = ({ isVisible, onClose }) => {
    const [executionHistory, setExecutionHistory] = (0, react_1.useState)([]);
    const [isExecuting, setIsExecuting] = (0, react_1.useState)(false);
    const executeToolWithParameters = async (context) => {
        setIsExecuting(true);
        try {
            const result = await mcp_service_1.mcpService.executeTool(context);
            setExecutionHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10 results
        }
        catch (error) {
            console.error('Tool execution failed:', error);
        }
        finally {
            setIsExecuting(false);
        }
    };
    const clearHistory = () => {
        setExecutionHistory([]);
    };
    const getStatusColor = (success) => {
        return success ? 'var(--color-success)' : 'var(--color-error)';
    };
    const formatResult = (result) => {
        if (typeof result === 'object') {
            return JSON.stringify(result, null, 2);
        }
        return String(result);
    };
    if (!isVisible)
        return null;
    return (<div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-bg-primary)'
        }}>
      {/* Header */}
      <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🛠️</span>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            margin: 0,
            color: 'var(--color-text-primary)'
        }}>
            Tool Execution Results
          </h3>
          {isExecuting && (<div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--color-accent)'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                border: '2px solid var(--color-accent)',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}/>
              Executing...
            </div>)}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {executionHistory.length > 0 && (<button onClick={clearHistory} className="btn btn-sm" style={{ fontSize: '12px', padding: '4px 8px' }}>
              Clear
            </button>)}
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: 'var(--color-text-muted)'
        }}>
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px'
        }}>
        {executionHistory.length === 0 ? (<div style={{
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '14px',
                marginTop: '40px'
            }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛠️</div>
            <div>No tool executions yet</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>
              Use the @ symbol in chat to select and execute tools
            </div>
          </div>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {executionHistory.map((result, index) => (<div key={index} style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-bg-secondary)'
                }}>
                {/* Result Header */}
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(result.success)
                }}/>
                    <span style={{
                    fontWeight: '600',
                    fontSize: '13px',
                    color: 'var(--color-text-primary)'
                }}>
                      {result.toolName}
                    </span>
                    <span style={{
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-bg-quaternary)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)'
                }}>
                      {result.executionTime}ms
                    </span>
                  </div>
                  
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--color-text-muted)'
                }}>
                    {result.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {/* Result Content */}
                <div style={{ padding: '16px' }}>
                  {result.success ? (<div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '8px'
                    }}>
                        Result:
                      </div>
                      <pre style={{
                        backgroundColor: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        fontSize: '12px',
                        fontFamily: 'Monaco, Menlo, monospace',
                        overflow: 'auto',
                        margin: 0,
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.4'
                    }}>
                        {formatResult(result.result)}
                      </pre>
                    </div>) : (<div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--color-error)',
                        marginBottom: '8px'
                    }}>
                        Error:
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--color-error)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        fontSize: '13px',
                        color: 'var(--color-error)'
                    }}>
                        {result.error}
                      </div>
                    </div>)}
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
};
exports.ToolExecutionPanel = ToolExecutionPanel;
//# sourceMappingURL=tool-execution-panel.js.map