import express from 'express';
import cors from 'cors';
import { decisionFrameworkController } from '../controllers/decision-framework-controller';
import { mentalModelsController } from '../controllers/mental-models-controller';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Server health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Server info for MCP registry
app.get('/mcp/info', (req, res) => {
  res.json({
    name: 'Clear Thought MCP',
    version: '1.0.0',
    description: 'Advanced thinking and reasoning tools',
    capabilities: ['thinking', 'reasoning', 'analysis'],
    status: 'available'
  });
});

// List available tools
app.get('/mcp/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: 'ClearThought.SequentialThinking',
        description: 'Break down complex problems into sequential steps',
        category: 'Thinking',
        icon: '🧩',
        parameters: [
          { name: 'problem', type: 'string', required: true, description: 'The problem to analyze' }
        ]
      },
      {
        name: 'ClearThought.MentalModels',
        description: 'Apply frameworks like First Principles, Opportunity Cost, etc.',
        category: 'Thinking',
        icon: '💡',
        parameters: [
          { 
            name: 'modelName', 
            type: 'string', 
            required: true, 
            description: 'The mental model to apply. Options: first_principles, opportunity_cost, error_propagation, rubber_duck, pareto_principle, occams_razor',
            enum: ['first_principles', 'opportunity_cost', 'error_propagation', 'rubber_duck', 'pareto_principle', 'occams_razor']
          },
          { 
            name: 'problem', 
            type: 'string', 
            required: true, 
            description: 'The problem to analyze using the mental model' 
          }
        ]
      },
      {
        name: 'ClearThought.DecisionFramework',
        description: 'Structured decision analysis with criteria weighting',
        category: 'Thinking',
        icon: '⚖️',
        parameters: [
          { 
            name: 'decisionStatement', 
            type: 'string', 
            required: true, 
            description: 'The decision problem statement' 
          },
          { 
            name: 'analysisType', 
            type: 'string', 
            required: true, 
            description: 'The type of decision analysis to perform. Options: pros-cons, weighted-criteria, decision-tree, expected-value, scenario-analysis',
            enum: ['pros-cons', 'weighted-criteria', 'decision-tree', 'expected-value', 'scenario-analysis'] 
          },
          { 
            name: 'options', 
            type: 'array', 
            required: false, 
            description: 'Array of options to evaluate (optional)' 
          },
          { 
            name: 'sessionId', 
            type: 'string', 
            required: false, 
            description: 'Session ID for continuing an existing analysis (optional)' 
          }
        ]
      }
    ]
  });
});

// Tool execution endpoint
app.post('/mcp/execute', (req, res) => {
  const { tool, parameters } = req.body;
  
  if (!tool) {
    return res.status(400).json({ error: 'Missing tool name' });
  }
  
  // Route to appropriate controller based on tool name
  switch (tool) {
    case 'ClearThought.SequentialThinking':
      // TODO: Implement sequential thinking controller
      return res.status(501).json({ error: 'Sequential thinking not implemented yet' });
      
    case 'ClearThought.MentalModels':
      return mentalModelsController.apply(req, res);
      
    case 'ClearThought.DecisionFramework':
      return decisionFrameworkController.analyze(req, res);
      
    default:
      return res.status(404).json({ error: `Tool ${tool} not found` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Clear Thought MCP server running on port ${PORT}`);
});

export default app; 