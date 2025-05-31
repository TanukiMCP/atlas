/**
 * Utility for parsing tool invocations from chat input
 * Handles @tool_name param1=value1 param2=value2 syntax
 */

export interface ToolInvocation {
  toolName: string;
  parameters: Record<string, string>;
  originalText: string;
}

/**
 * Parses a string to extract tool name and parameters if it starts with @
 * @param input Input string potentially containing a tool invocation
 * @returns ToolInvocation object if valid, null otherwise
 */
export function parseToolInvocation(input: string): ToolInvocation | null {
  if (!input.startsWith('@')) {
    return null;
  }

  // Match the tool name: everything after @ until a space or end of string
  // Updated to handle dots in tool names (e.g., ClearThought.DecisionFramework)
  const toolNameMatch = input.match(/@([a-zA-Z0-9_.-]+)/);
  if (!toolNameMatch || !toolNameMatch[1]) {
    return null;
  }

  const toolName = toolNameMatch[1];
  const parametersText = input.substring(toolNameMatch[0].length).trim();
  const parameters: Record<string, string> = {};

  if (parametersText) {
    // Match parameters in format: param=value or param="value with spaces"
    const paramRegex = /([a-zA-Z0-9_-]+)=(?:"([^"]*)"|([\w.-]+))/g;
    let match;
    
    while ((match = paramRegex.exec(parametersText)) !== null) {
      const paramName = match[1];
      // Use the quoted value if available, otherwise use the non-quoted value
      const paramValue = match[2] !== undefined ? match[2] : match[3];
      parameters[paramName] = paramValue;
    }
  }

  return {
    toolName,
    parameters,
    originalText: input
  };
}

/**
 * Formats a tool invocation object back into string form
 * @param toolInvocation Tool invocation object
 * @returns Formatted string representation
 */
export function formatToolInvocation(toolInvocation: ToolInvocation): string {
  let result = `@${toolInvocation.toolName}`;
  
  const paramEntries = Object.entries(toolInvocation.parameters);
  if (paramEntries.length > 0) {
    const params = paramEntries.map(([key, value]) => {
      // If value contains spaces, wrap in quotes
      const formattedValue = value.includes(' ') ? `"${value}"` : value;
      return `${key}=${formattedValue}`;
    });
    
    result += ' ' + params.join(' ');
  }
  
  return result;
} 