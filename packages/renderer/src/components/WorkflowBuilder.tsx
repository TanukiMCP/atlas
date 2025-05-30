import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Zap, Save, ChevronLeft, Layout, ZoomIn, ZoomOut, Play } from 'lucide-react';

interface WorkflowBuilderProps {
  onClose: () => void;
  onSave: (workflow: any) => void;
  initialWorkflow?: any;
}

export function WorkflowBuilder({ onClose, onSave, initialWorkflow }: WorkflowBuilderProps) {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [nodes, setNodes] = useState<any[]>(initialWorkflow?.nodes || []);
  const [connections, setConnections] = useState<any[]>(initialWorkflow?.connections || []);
  const [activeNode, setActiveNode] = useState<any | null>(null);
  const [workflowName, setWorkflowName] = useState(initialWorkflow?.name || 'New Workflow');
  const [workflowDescription, setWorkflowDescription] = useState(
    initialWorkflow?.description || 'Workflow description'
  );

  // Handle zoom in/out
  const handleZoomIn = () => {
    if (zoomLevel < 2) {
      setZoomLevel(prev => prev + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(prev => prev - 0.1);
    }
  };

  // Handle save workflow
  const handleSave = () => {
    const workflow = {
      id: initialWorkflow?.id || `workflow-${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      nodes,
      connections,
      status: 'available',
    };
    onSave(workflow);
  };

  // Handle node addition
  const addNode = (type: string) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 200, y: 200 },
      data: { label: type, params: {} },
    };
    setNodes([...nodes, newNode]);
  };

  // Handle connection creation
  const addConnection = (source: string, target: string) => {
    // Check if connection already exists
    const exists = connections.some(
      conn => conn.source === source && conn.target === target
    );
    
    if (!exists) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        source,
        target,
      };
      setConnections([...connections, newConnection]);
    }
  };

  return (
    <div className={`bg-background ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full w-full'}`}>
      {/* Workflow Builder Header */}
      <div className="border-b border-border h-12 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Workflow Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            <Layout className="w-4 h-4" />
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <div className="text-sm px-2">{Math.round(zoomLevel * 100)}%</div>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Play className="w-4 h-4" />
            Test
          </Button>
          <Button variant="default" size="sm" className="gap-1" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Workflow Builder Content */}
      <div className="flex h-[calc(100%-3rem)]">
        {/* Left Sidebar - Node Palette */}
        <div className="w-56 border-r border-border overflow-y-auto p-4">
          <h2 className="font-medium mb-3">Node Types</h2>
          <div className="space-y-2">
            <div
              className="p-2 border border-border rounded-md bg-card hover:bg-accent cursor-pointer"
              onClick={() => addNode('Start')}
            >
              <div className="font-medium">Start</div>
              <div className="text-xs text-muted-foreground">Entry point</div>
            </div>
            <div
              className="p-2 border border-border rounded-md bg-card hover:bg-accent cursor-pointer"
              onClick={() => addNode('Action')}
            >
              <div className="font-medium">Action</div>
              <div className="text-xs text-muted-foreground">Execute a command</div>
            </div>
            <div
              className="p-2 border border-border rounded-md bg-card hover:bg-accent cursor-pointer"
              onClick={() => addNode('Condition')}
            >
              <div className="font-medium">Condition</div>
              <div className="text-xs text-muted-foreground">Branch based on condition</div>
            </div>
            <div
              className="p-2 border border-border rounded-md bg-card hover:bg-accent cursor-pointer"
              onClick={() => addNode('Loop')}
            >
              <div className="font-medium">Loop</div>
              <div className="text-xs text-muted-foreground">Iterate over items</div>
            </div>
            <div
              className="p-2 border border-border rounded-md bg-card hover:bg-accent cursor-pointer"
              onClick={() => addNode('Tool')}
            >
              <div className="font-medium">Tool</div>
              <div className="text-xs text-muted-foreground">Use external tool</div>
            </div>
            <div
              className="p-2 border border-border rounded-md bg-card hover:bg-accent cursor-pointer"
              onClick={() => addNode('End')}
            >
              <div className="font-medium">End</div>
              <div className="text-xs text-muted-foreground">Workflow endpoint</div>
            </div>
          </div>
        </div>

        {/* Center - Workflow Canvas */}
        <div 
          className="flex-1 bg-secondary/20 overflow-auto relative"
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: '0 0',
            height: `${100 / zoomLevel}%`,
            width: `${100 / zoomLevel}%`
          }}
        >
          {/* Render Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className="absolute p-4 bg-card border border-border rounded-md shadow-md w-48"
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                cursor: 'move'
              }}
              onClick={() => setActiveNode(node)}
              draggable={true}
              onDragStart={(e) => {
                setIsDraggingNode(true);
                e.dataTransfer.setData('node-id', node.id);
              }}
              onDragEnd={() => setIsDraggingNode(false)}
            >
              <div className="font-medium">{node.data.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{node.type}</div>
              
              {/* Connection Points */}
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                <div 
                  className="w-3 h-3 bg-primary rounded-full cursor-pointer border border-white"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('source-id', node.id);
                  }}
                ></div>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div 
                  className="w-3 h-3 bg-muted-foreground rounded-full cursor-pointer border border-white"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const sourceId = e.dataTransfer.getData('source-id');
                    if (sourceId && sourceId !== node.id) {
                      addConnection(sourceId, node.id);
                    }
                  }}
                ></div>
              </div>
            </div>
          ))}

          {/* Render Connections */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {connections.map(conn => {
              const sourceNode = nodes.find(n => n.id === conn.source);
              const targetNode = nodes.find(n => n.id === conn.target);
              
              if (!sourceNode || !targetNode) return null;
              
              const sourceX = sourceNode.position.x + 192; // Right of node
              const sourceY = sourceNode.position.y + 32; // Middle of node
              const targetX = targetNode.position.x; // Left of node
              const targetY = targetNode.position.y + 32; // Middle of node
              
              return (
                <g key={conn.id}>
                  <path
                    d={`M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY}, ${targetX - 50} ${targetY}, ${targetX} ${targetY}`}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-primary"
                  />
                  {/* Arrow at the end */}
                  <polygon
                    points={`${targetX},${targetY} ${targetX - 8},${targetY - 4} ${targetX - 8},${targetY + 4}`}
                    fill="currentColor"
                    className="text-primary"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-64 border-l border-border overflow-y-auto p-4">
          <h2 className="font-medium mb-3">Properties</h2>
          {activeNode ? (
            <div>
              <div className="mb-3">
                <label className="block text-xs mb-1">Node Type</label>
                <div className="p-2 bg-card border border-border rounded-md">
                  {activeNode.type}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs mb-1">Label</label>
                <input
                  type="text"
                  className="w-full p-2 bg-background border border-border rounded-md"
                  value={activeNode.data.label}
                  onChange={(e) => {
                    const updatedNodes = nodes.map(n => 
                      n.id === activeNode.id 
                        ? { ...n, data: { ...n.data, label: e.target.value } } 
                        : n
                    );
                    setNodes(updatedNodes);
                    setActiveNode({ ...activeNode, data: { ...activeNode.data, label: e.target.value } });
                  }}
                />
              </div>
              
              {/* Node-specific properties would go here */}
              
              <Button 
                variant="destructive" 
                size="sm"
                className="mt-4 w-full"
                onClick={() => {
                  setNodes(nodes.filter(n => n.id !== activeNode.id));
                  setConnections(connections.filter(
                    c => c.source !== activeNode.id && c.target !== activeNode.id
                  ));
                  setActiveNode(null);
                }}
              >
                Delete Node
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <label className="block text-xs mb-1">Workflow Name</label>
                <input
                  type="text"
                  className="w-full p-2 bg-background border border-border rounded-md"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs mb-1">Description</label>
                <textarea
                  className="w-full p-2 bg-background border border-border rounded-md h-24"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Select a node to view and edit its properties
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 