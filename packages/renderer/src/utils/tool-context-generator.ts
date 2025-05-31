import { MCPTool } from '../types/index';

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

  let context = `You have access to the following tools that can help you perform tasks and enhance your reasoning capabilities.\nThese tools are organized by category. When a tool from the 'Clear Thought' category is used, it implies a more advanced reasoning process is being invoked.\n\n`;
  
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
  
  context += `\nTo use these tools, you should call them by their fully qualified name (e.g., 'clear.thought.sequentialThinking' or 'file.system.readFile'). You should select the most appropriate tool based on the user's request and the task at hand. For complex problems requiring structured thought, consider using tools from the 'Clear Thought' category.`;
  
  return context;
}

/**
 * Generates a system prompt with tool context
 * @param basePrompt Base system prompt
 * @param tools Array of available MCP tools
 * @param detailedMode Whether to include detailed tool descriptions for all tools.
 *                   This can be linked to a setting like 'clearThoughtReasoning' if 
 *                   detailed context is desired when advanced reasoning is enabled.
 * @returns System prompt with tool context
 */
export function generateSystemPromptWithToolContext(
  basePrompt: string, 
  tools: MCPTool[], 
  detailedMode = false // This now controls detail for ALL tools
): string {
  const toolContext = generateToolContext(tools, detailedMode);
  
  return `${basePrompt}\n\n${toolContext}`;
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