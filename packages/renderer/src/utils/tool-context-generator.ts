import { MCPTool } from '../types';

/**
 * Generates a formatted context message about available tools for LLMs
 * @param tools Array of available MCP tools
 * @param detailedMode Whether to include detailed tool descriptions
 * @returns Formatted context string about available tools
 */
export function generateToolContext(tools: MCPTool[], detailedMode = false): string {
  if (!tools || tools.length === 0) {
    return "No tools are currently available.";
  }

  let context = `You have access to the following tools that can help you perform tasks:\n\n`;
  
  // Group tools by category if available
  const categorizedTools: Record<string, MCPTool[]> = {};
  
  tools.forEach(tool => {
    const category = tool.category || 'Other';
    if (!categorizedTools[category]) {
      categorizedTools[category] = [];
    }
    categorizedTools[category].push(tool);
  });
  
  const categories = Object.keys(categorizedTools).sort();
  
  for (const category of categories) {
    context += `## ${category} Tools\n\n`;
    
    for (const tool of categorizedTools[category]) {
      context += `### ${tool.name}\n`;
      context += `${tool.description}\n\n`;
      
      if (detailedMode && tool.parameters && tool.parameters.length > 0) {
        context += `Parameters:\n`;
        for (const param of tool.parameters) {
          const required = param.required ? '[Required]' : '[Optional]';
          context += `- ${param.name} (${param.type}): ${required} ${param.description}\n`;
          if (param.defaultValue !== undefined) {
            context += `  Default: ${JSON.stringify(param.defaultValue)}\n`;
          }
        }
        context += '\n';
      }
      
      if (detailedMode && tool.examples && tool.examples.length > 0) {
        context += `Examples:\n`;
        for (const example of tool.examples) {
          context += `- ${example}\n`;
        }
        context += '\n';
      }
    }
  }
  
  context += `\nTo use these tools, you can call them by name. You should select the most appropriate tool based on the user's request and the task at hand.`;
  
  return context;
}

/**
 * Generates a system prompt with tool context
 * @param basePrompt Base system prompt
 * @param tools Array of available MCP tools
 * @param detailedMode Whether to include detailed tool descriptions
 * @returns System prompt with tool context
 */
export function generateSystemPromptWithToolContext(
  basePrompt: string, 
  tools: MCPTool[], 
  detailedMode = false
): string {
  const toolContext = generateToolContext(tools, detailedMode);
  
  return `${basePrompt}\n\n${toolContext}`;
}

/**
 * Generates a brief summary of Clear Thought's reasoning capabilities
 * @returns String describing Clear Thought's capabilities
 */
export function generateClearThoughtContext(): string {
  return `
You have access to Clear Thought's advanced reasoning capabilities through the following tools:

## Sequential Thinking
Use for breaking down complex problems into steps, revising thoughts as understanding deepens.

## Mental Models
Apply structured frameworks like First Principles, Opportunity Cost Analysis, and more.

## Design Patterns
Utilize software design patterns for architecture and implementation.

## Debugging Approaches
Employ systematic debugging methods like Binary Search or Divide and Conquer.

## Collaborative Reasoning
Simulate expert collaboration with diverse perspectives on complex problems.

## Scientific Method
Apply formal scientific reasoning with structured hypothesis testing.

These tools can significantly enhance your reasoning abilities for complex tasks. Use them when appropriate to deliver higher quality solutions.
`;
}

/**
 * Formats a set of tools for display in the UI
 * @param tools Array of MCP tools
 * @returns HTML-formatted tool description
 */
export function formatToolsForUI(tools: MCPTool[]): string {
  if (!tools || tools.length === 0) {
    return "<p>No tools available</p>";
  }
  
  let html = `<div class="tool-list">`;
  
  // Group tools by category
  const categorizedTools: Record<string, MCPTool[]> = {};
  
  tools.forEach(tool => {
    const category = tool.category || 'Other';
    if (!categorizedTools[category]) {
      categorizedTools[category] = [];
    }
    categorizedTools[category].push(tool);
  });
  
  const categories = Object.keys(categorizedTools).sort();
  
  for (const category of categories) {
    html += `<div class="tool-category">
      <h3>${category}</h3>
      <ul class="tool-items">`;
    
    for (const tool of categorizedTools[category]) {
      html += `<li class="tool-item">
        <span class="tool-name">${tool.name}</span>
        <span class="tool-description">${tool.description}</span>
      </li>`;
    }
    
    html += `</ul></div>`;
  }
  
  html += `</div>`;
  
  return html;
} 