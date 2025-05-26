"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualWorkflowBuilder = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
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
        return ((0, jsx_runtime_1.jsxs)("div", { className: `absolute w-36 min-h-20 bg-white rounded-xl p-3 cursor-pointer transition-all duration-150 ${isSelected ? 'border-2 z-[100]' : 'border-2 border-gray-200 z-[1]'} ${isDragged ? 'shadow-2xl scale-105 z-[1000]' : 'shadow-md'}`, style: {
                left: node.position.x,
                top: node.position.y,
                borderColor: isSelected ? nodeType.color : undefined
            }, onClick: (e) => {
                e.stopPropagation();
                if (isConnecting && connectionStart !== node.id) {
                    endConnection(node.id);
                }
                else {
                    setSelectedNode(node.id);
                }
            }, onMouseDown: (e) => {
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
            }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg w-6 h-6 rounded-full flex items-center justify-center text-white text-sm", style: { backgroundColor: nodeType.color }, children: nodeType.icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-gray-700 flex-1", children: node.data.label }), (0, jsx_runtime_1.jsx)("button", { style: {
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
                            }, onClick: (e) => {
                                e.stopPropagation();
                                startConnection(node.id);
                            }, children: "\u27A4" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 leading-tight", children: node.data.description }), isSelected && node.type !== 'START' && ((0, jsx_runtime_1.jsx)("button", { style: {
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
                    }, onClick: (e) => {
                        e.stopPropagation();
                        deleteNode(node.id);
                    }, children: "\u2715" }))] }, node.id));
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
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f9fafb'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                    padding: '16px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: workflowName, onChange: (e) => setWorkflowName(e.target.value), style: {
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                } }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', gap: '8px' }, children: Object.entries(NODE_TYPES).map(([type, config]) => ((0, jsx_runtime_1.jsxs)("button", { style: {
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }, onClick: () => addNode(type, {
                                        x: 200 + Math.random() * 300,
                                        y: 150 + Math.random() * 200
                                    }), children: [config.icon, " ", config.label] }, type))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: saveWorkflow, style: {
                                    padding: '8px 16px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }, children: "\uD83D\uDCBE Save Workflow" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onWorkflowTest?.({
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
                                }), style: {
                                    padding: '8px 16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }, children: "\u25B6\uFE0F Test Run" })] })] }), (0, jsx_runtime_1.jsxs)("div", { ref: canvasRef, style: {
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#f9fafb',
                    backgroundImage: `
            radial-gradient(circle, #d1d5db 1px, transparent 1px)
          `,
                    backgroundSize: '20px 20px'
                }, onClick: handleCanvasClick, children: [(0, jsx_runtime_1.jsxs)("svg", { style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 0
                        }, children: [connections.map(connection => {
                                const sourceNode = nodes.find(n => n.id === connection.source);
                                const targetNode = nodes.find(n => n.id === connection.target);
                                if (!sourceNode || !targetNode)
                                    return null;
                                const startX = sourceNode.position.x + 140;
                                const startY = sourceNode.position.y + 40;
                                const endX = targetNode.position.x;
                                const endY = targetNode.position.y + 40;
                                return ((0, jsx_runtime_1.jsx)("path", { d: `M ${startX} ${startY} Q ${startX + 50} ${startY} ${endX - 20} ${endY}`, stroke: "#6b7280", strokeWidth: "2", fill: "none", markerEnd: "url(#arrowhead)" }, connection.id));
                            }), (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsx)("marker", { id: "arrowhead", markerWidth: "10", markerHeight: "7", refX: "9", refY: "3.5", orient: "auto", children: (0, jsx_runtime_1.jsx)("polygon", { points: "0 0, 10 3.5, 0 7", fill: "#6b7280" }) }) })] }), nodes.map(renderNode), nodes.length === 1 && ((0, jsx_runtime_1.jsxs)("div", { style: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            color: '#6b7280',
                            fontSize: '16px',
                            maxWidth: '400px'
                        }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '48px', marginBottom: '16px' }, children: "\uD83C\uDFA8" }), (0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '8px', fontWeight: '600' }, children: "Create Your Workflow" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '14px', lineHeight: '1.5' }, children: "Add nodes using the toolbar above, drag them to position, and click the arrow buttons to create connections." })] }))] })] }));
};
exports.VisualWorkflowBuilder = VisualWorkflowBuilder;
//# sourceMappingURL=visual-workflow-builder.js.map