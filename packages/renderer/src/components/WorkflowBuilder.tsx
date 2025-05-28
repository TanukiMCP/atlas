import React, { useState, useRef, useCallback } from 'react';
import { Workflow, MCPTool, ProcessingTier } from '../types';

interface WorkflowNode {
  id: string;
  type: 'tool' | 'condition' | 'loop' | 'input' | 'output';
  name: string;
  position: { x: number; y: number };
  data: any;
  connections: string[];
}

interface WorkflowBuilderProps {
  availableTools: MCPTool[];
  processingTiers: ProcessingTier[];
  onSaveWorkflow: (workflow: Workflow) => void;
  onLoadWorkflow: (workflowId: string) => void;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  availableTools,
  processingTiers,
  onSaveWorkflow,
  onLoadWorkflow
}) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedTool, setDraggedTool] = useState<MCPTool | null>(null);
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);

  const handleDragStart = (tool: MCPTool) => {
    setDraggedTool(tool);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTool || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: 'tool',
      name: draggedTool.name,
      position: { x, y },
      data: { tool: draggedTool },
      connections: []
    };

    setNodes(prev => [...prev, newNode]);
    setDraggedTool(null);
  };

  const handleNodeClick = (nodeId: string) => {
    if (isConnecting && connectionStart && connectionStart !== nodeId) {
      // Create connection
      setNodes(prev => prev.map(node => 
        node.id === connectionStart 
          ? { ...node, connections: [...node.connections, nodeId] }
          : node
      ));
      setIsConnecting(false);
      setConnectionStart(null);
    } else {
      setSelectedNode(nodeId);
    }
  };

  const startConnection = (nodeId: string) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    // Remove connections to this node
    setNodes(prev => prev.map(node => ({
      ...node,
      connections: node.connections.filter(conn => conn !== nodeId)
    })));
  };

  const saveWorkflow = () => {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: workflowName,
      description: `Custom workflow with ${nodes.length} nodes`,
      status: 'available'
    };
    onSaveWorkflow(workflow);
  };

  const addControlNode = (type: 'condition' | 'loop' | 'input' | 'output') => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      position: { x: 100, y: 100 },
      data: { type },
      connections: []
    };
    setNodes(prev => [...prev, newNode]);
  };

  const renderNode = (node: WorkflowNode) => {
    const isSelected = selectedNode === node.id;
    
    return (
      <div
        key={node.id}
        className={`absolute bg-card border-2 rounded-lg p-3 cursor-pointer min-w-[120px] ${
          isSelected ? 'border-primary' : 'border-border'
        } ${isConnecting ? 'hover:border-blue-500' : 'hover:border-primary'}`}
        style={{ left: node.position.x, top: node.position.y }}
        onClick={() => handleNodeClick(node.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">{node.name}</div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startConnection(node.id);
              }}
              className="w-4 h-4 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center hover:bg-blue-600"
              title="Connect"
            >
              →
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              className="w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center hover:bg-red-600"
              title="Delete"
            >
              ×
            </button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {node.type === 'tool' ? '🔧 Tool' : 
           node.type === 'condition' ? '🔀 Condition' :
           node.type === 'loop' ? '🔄 Loop' :
           node.type === 'input' ? '📥 Input' : '📤 Output'}
        </div>
      </div>
    );
  };

  const renderConnections = () => {
    return nodes.map(node => 
      node.connections.map(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (!targetNode) return null;

        const startX = node.position.x + 60;
        const startY = node.position.y + 30;
        const endX = targetNode.position.x + 60;
        const endY = targetNode.position.y + 30;

        return (
          <line
            key={`${node.id}-${targetId}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            markerEnd="url(#arrowhead)"
          />
        );
      })
    ).flat();
  };

  return (
    <div className="h-full flex">
      {/* Tool Palette */}
      <div className="w-64 bg-card border-r border-border p-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Available Tools</h3>
            <div className="space-y-2">
              {availableTools.map(tool => (
                <div
                  key={tool.name}
                  draggable
                  onDragStart={() => handleDragStart(tool)}
                  className="p-2 bg-secondary rounded cursor-grab hover:bg-secondary/80 transition-colors"
                >
                  <div className="text-sm font-medium">{tool.name}</div>
                  <div className="text-xs text-muted-foreground">{tool.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Control Nodes</h3>
            <div className="space-y-2">
              {['input', 'output', 'condition', 'loop'].map(type => (
                <button
                  key={type}
                  onClick={() => addControlNode(type as any)}
                  className="w-full p-2 bg-secondary rounded text-left hover:bg-secondary/80 transition-colors"
                >
                  <div className="text-sm font-medium capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Workflow</h3>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full p-2 bg-background border border-border rounded text-sm"
              placeholder="Workflow name"
            />
            <button
              onClick={saveWorkflow}
              className="w-full mt-2 p-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
            >
              Save Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative bg-background"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            setSelectedNode(null);
            setIsConnecting(false);
            setConnectionStart(null);
          }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Connections */}
          <svg className="absolute inset-0 pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-primary" />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          {/* Nodes */}
          {nodes.map(renderNode)}

          {/* Instructions */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <div className="text-xl">🔧</div>
                <div>Drag tools from the palette to create your workflow</div>
                <div className="text-sm">Click nodes to connect them</div>
              </div>
            </div>
          )}

          {/* Connection mode indicator */}
          {isConnecting && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded text-sm">
              Click another node to connect
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder; 