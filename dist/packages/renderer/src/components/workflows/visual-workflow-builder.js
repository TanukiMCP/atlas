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
exports.VisualWorkflowBuilder = void 0;
const react_1 = __importStar(require("react"));
const NODE_TYPES = {
    START: { icon: '🚀', color: '#10b981', label: 'Start' },
    ACTION: { icon: '⚡', color: '#3b82f6', label: 'Action' },
    CONDITION: { icon: '❓', color: '#f59e0b', label: 'Condition' },
    LOOP: { icon: '🔄', color: '#8b5cf6', label: 'Loop' },
    END: { icon: '🎯', color: '#ef4444', label: 'End' }
};
const VisualWorkflowBuilder = ({ onWorkflowSave, onWorkflowTest }) => {
    const [nodes, setNodes] = (0, react_1.useState)([
        {
            id: 'start-1',
            type: 'START',
            position: { x: 100, y: 100 },
            data: { label: 'Start', description: 'Workflow entry point' }
        }
    ]);
    const [connections, setConnections] = (0, react_1.useState)([]);
    const [selectedNode, setSelectedNode] = (0, react_1.useState)(null);
    const [draggedNode, setDraggedNode] = (0, react_1.useState)(null);
    const [workflowName, setWorkflowName] = (0, react_1.useState)('New Workflow');
    const [isConnecting, setIsConnecting] = (0, react_1.useState)(false);
    const [connectionStart, setConnectionStart] = (0, react_1.useState)(null);
    const canvasRef = (0, react_1.useRef)(null);
    const addNode = (0, react_1.useCallback)((type, position) => {
        const newNode = {
            id: `${type.toLowerCase()}-${Date.now()}`,
            type,
            position,
            data: {
                label: NODE_TYPES[type].label,
                description: `${NODE_TYPES[type].label} node`,
                parameters: {}
            }
        };
        setNodes(prev => [...prev, newNode]);
    }, []);
    const moveNode = (0, react_1.useCallback)((nodeId, newPosition) => {
        setNodes(prev => prev.map(node => node.id === nodeId ? { ...node, position: newPosition } : node));
    }, []);
    const deleteNode = (0, react_1.useCallback)((nodeId) => {
        setNodes(prev => prev.filter(node => node.id !== nodeId));
        setConnections(prev => prev.filter(conn => conn.source !== nodeId && conn.target !== nodeId));
        if (selectedNode === nodeId) {
            setSelectedNode(null);
        }
    }, [selectedNode]);
    const startConnection = (0, react_1.useCallback)((nodeId) => {
        setIsConnecting(true);
        setConnectionStart(nodeId);
    }, []);
    const endConnection = (0, react_1.useCallback)((nodeId) => {
        if (isConnecting && connectionStart && connectionStart !== nodeId) {
            const newConnection = {
                id: `conn-${Date.now()}`,
                source: connectionStart,
                target: nodeId,
                type: 'success'
            };
            setConnections(prev => [...prev, newConnection]);
        }
        setIsConnecting(false);
        setConnectionStart(null);
    }, [isConnecting, connectionStart]);
    const handleCanvasClick = (0, react_1.useCallback)((e) => {
        if (e.target === canvasRef.current) {
            setSelectedNode(null);
            if (isConnecting) {
                setIsConnecting(false);
                setConnectionStart(null);
            }
        }
    }, [isConnecting]);
    const renderNode = (node) => {
        const nodeType = NODE_TYPES[node.type];
        const isSelected = selectedNode === node.id;
        const isDragged = draggedNode === node.id;
        return (<div key={node.id} style={{
                position: 'absolute',
                left: node.position.x,
                top: node.position.y,
                width: '140px',
                minHeight: '80px',
                backgroundColor: 'white',
                border: `2px solid ${isSelected ? nodeType.color : '#e5e7eb'}`,
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                boxShadow: isDragged ? '0 10px 25px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                transform: isDragged ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.15s ease',
                zIndex: isDragged ? 1000 : isSelected ? 100 : 1
            }} onClick={(e) => {
                e.stopPropagation();
                if (isConnecting && connectionStart !== node.id) {
                    endConnection(node.id);
                }
                else {
                    setSelectedNode(node.id);
                }
            }} onMouseDown={(e) => {
                e.preventDefault();
                setDraggedNode(node.id);
                setSelectedNode(node.id);
                const startX = e.clientX - node.position.x;
                const startY = e.clientY - node.position.y;
                const handleMouseMove = (e) => {
                    const newX = e.clientX - startX;
                    const newY = e.clientY - startY;
                    moveNode(node.id, { x: newX, y: newY });
                };
                const handleMouseUp = () => {
                    setDraggedNode(null);
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }}>
        {/* Node Header */}
        <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
            }}>
          <span style={{
                fontSize: '18px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: nodeType.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            {nodeType.icon}
          </span>
          <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                flex: 1
            }}>
            {node.data.label}
          </span>
          
          {/* Connection Handle */}
          <button style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid #6b7280',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }} onClick={(e) => {
                e.stopPropagation();
                startConnection(node.id);
            }}>
            ➤
          </button>
        </div>

        {/* Node Content */}
        <div style={{
                fontSize: '11px',
                color: '#6b7280',
                lineHeight: '1.3'
            }}>
          {node.data.description}
        </div>

        {/* Delete Button */}
        {isSelected && node.type !== 'START' && (<button style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                }}>
            ✕
          </button>)}
      </div>);
    };
    const saveWorkflow = () => {
        const workflow = {
            id: `workflow-${Date.now()}`,
            name: workflowName,
            description: 'Visual workflow created with drag-and-drop builder',
            category: 'custom',
            version: '1.0.0',
            nodes,
            connections,
            parameters: [],
            triggers: [],
            metadata: {
                created: new Date().toISOString(),
                author: 'Visual Builder',
                tags: ['visual', 'custom']
            }
        };
        onWorkflowSave?.(workflow);
    };
    return (<div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f9fafb'
        }}>
      {/* Toolbar */}
      <div style={{
            padding: '16px',
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="text" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600'
        }}/>
          <div style={{ display: 'flex', gap: '8px' }}>
            {Object.entries(NODE_TYPES).map(([type, config]) => (<button key={type} style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }} onClick={() => addNode(type, {
                x: 200 + Math.random() * 300,
                y: 150 + Math.random() * 200
            })}>
                {config.icon} {config.label}
              </button>))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={saveWorkflow} style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
        }}>
            💾 Save Workflow
          </button>
          <button onClick={() => onWorkflowTest?.({
            id: 'test',
            name: workflowName,
            nodes,
            connections,
            parameters: [],
            triggers: [],
            description: 'Test workflow',
            category: 'test',
            version: '1.0.0',
            metadata: { created: new Date().toISOString(), author: 'test', tags: [] }
        })} style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
        }}>
            ▶️ Test Run
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={canvasRef} style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#f9fafb',
            backgroundImage: `
            radial-gradient(circle, #d1d5db 1px, transparent 1px)
          `,
            backgroundSize: '20px 20px'
        }} onClick={handleCanvasClick}>
        {/* Render Connections */}
        <svg style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
        }}>
          {connections.map(connection => {
            const sourceNode = nodes.find(n => n.id === connection.source);
            const targetNode = nodes.find(n => n.id === connection.target);
            if (!sourceNode || !targetNode)
                return null;
            const startX = sourceNode.position.x + 140;
            const startY = sourceNode.position.y + 40;
            const endX = targetNode.position.x;
            const endY = targetNode.position.y + 40;
            return (<path key={connection.id} d={`M ${startX} ${startY} Q ${startX + 50} ${startY} ${endX - 20} ${endY}`} stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>);
        })}
          
          {/* Arrow marker */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280"/>
            </marker>
          </defs>
        </svg>

        {/* Render Nodes */}
        {nodes.map(renderNode)}

        {/* Instructions */}
        {nodes.length === 1 && (<div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '16px',
                maxWidth: '400px'
            }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
            <div style={{ marginBottom: '8px', fontWeight: '600' }}>
              Create Your Workflow
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              Add nodes using the toolbar above, drag them to position, 
              and click the arrow buttons to create connections.
            </div>
          </div>)}
      </div>
    </div>);
};
exports.VisualWorkflowBuilder = VisualWorkflowBuilder;
//# sourceMappingURL=visual-workflow-builder.js.map