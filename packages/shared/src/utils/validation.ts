// Validation utilities for TanukiMCP Atlas

// Basic validation functions
export function isValidString(value: any, minLength = 0, maxLength = Infinity): boolean {
  return typeof value === 'string' && 
         value.length >= minLength && 
         value.length <= maxLength;
}

export function isValidNumber(value: any, min = -Infinity, max = Infinity): boolean {
  return typeof value === 'number' && 
         !isNaN(value) && 
         value >= min && 
         value <= max;
}

export function isValidArray(value: any, minLength = 0, maxLength = Infinity): boolean {
  return Array.isArray(value) && 
         value.length >= minLength && 
         value.length <= maxLength;
}

export function isValidObject(value: any): boolean {
  return typeof value === 'object' && 
         value !== null && 
         !Array.isArray(value);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isValidPath(path: string): boolean {
  if (!isValidString(path, 1)) return false;
  
  // Basic path validation - can be enhanced based on OS
  const invalidChars = /[<>:"|?*]/;
  return !invalidChars.test(path);
}

export function isValidFilename(filename: string): boolean {
  if (!isValidString(filename, 1, 255)) return false;
  
  // Invalid filename characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
  
  return !invalidChars.test(filename) && !reservedNames.test(filename);
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Project validation
export function validateProject(project: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!isValidString(project?.name, 1, 100)) {
    errors.push('Project name must be a string between 1 and 100 characters');
  }
  
  if (!isValidString(project?.path, 1, 500)) {
    errors.push('Project path must be a string between 1 and 500 characters');
  }
  
  if (!isValidPath(project?.path)) {
    errors.push('Project path contains invalid characters');
  }
  
  if (project?.description && !isValidString(project.description, 0, 1000)) {
    errors.push('Project description must be a string up to 1000 characters');
  }
  
  if (project?.language && !isValidString(project.language, 0, 50)) {
    errors.push('Project language must be a string up to 50 characters');
  }
  
  if (project?.framework && !isValidString(project.framework, 0, 50)) {
    errors.push('Project framework must be a string up to 50 characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Chat session validation
export function validateChatSession(session: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!isValidString(session?.title, 1, 200)) {
    errors.push('Chat session title must be a string between 1 and 200 characters');
  }
  
  if (session?.description && !isValidString(session.description, 0, 1000)) {
    errors.push('Chat session description must be a string up to 1000 characters');
  }
  
  if (session?.projectId && !isValidUUID(session.projectId)) {
    errors.push('Project ID must be a valid UUID');
  }
  
  if (session?.subjectMode && !isValidString(session.subjectMode, 1, 50)) {
    errors.push('Subject mode must be a string between 1 and 50 characters');
  }
  
  if (session?.tags && !isValidArray(session.tags, 0, 20)) {
    errors.push('Tags must be an array with up to 20 items');
  }
  
  if (session?.tags && session.tags.some((tag: any) => !isValidString(tag, 1, 50))) {
    errors.push('Each tag must be a string between 1 and 50 characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Chat message validation
export function validateChatMessage(message: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const validRoles = ['user', 'assistant', 'system', 'tool'];
  if (!validRoles.includes(message?.role)) {
    errors.push('Message role must be one of: user, assistant, system, tool');
  }
  
  if (!isValidString(message?.content, 1, 100000)) {
    errors.push('Message content must be a string between 1 and 100000 characters');
  }
  
  if (!isValidUUID(message?.sessionId)) {
    errors.push('Session ID must be a valid UUID');
  }
  
  if (message?.parentMessageId && !isValidUUID(message.parentMessageId)) {
    errors.push('Parent message ID must be a valid UUID');
  }
  
  if (message?.toolsUsed && !isValidArray(message.toolsUsed, 0, 50)) {
    errors.push('Tools used must be an array with up to 50 items');
  }
  
  if (message?.executionTime && !isValidNumber(message.executionTime, 0)) {
    errors.push('Execution time must be a non-negative number');
  }
  
  if (message?.tokenCount && !isValidNumber(message.tokenCount, 0)) {
    errors.push('Token count must be a non-negative number');
  }
  
  if (message?.temperature && !isValidNumber(message.temperature, 0, 2)) {
    errors.push('Temperature must be a number between 0 and 2');
  }
  
  const validComplexities = ['atomic', 'moderate', 'complex', 'expert'];
  if (message?.complexity && !validComplexities.includes(message.complexity)) {
    errors.push('Complexity must be one of: atomic, moderate, complex, expert');
  }
  
  if (message?.qualityScore && !isValidNumber(message.qualityScore, 0, 1)) {
    errors.push('Quality score must be a number between 0 and 1');
  }
  
  return { isValid: errors.length === 0, errors };
}

// MCP server validation
export function validateMCPServer(server: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!isValidString(server?.name, 1, 100)) {
    errors.push('MCP server name must be a string between 1 and 100 characters');
  }
  
  if (server?.description && !isValidString(server.description, 0, 500)) {
    errors.push('MCP server description must be a string up to 500 characters');
  }
  
  const validTransports = ['stdio', 'sse', 'websocket'];
  if (!validTransports.includes(server?.transport?.type)) {
    errors.push('Transport type must be one of: stdio, sse, websocket');
  }
  
  if (server?.transport?.type === 'stdio') {
    if (!isValidString(server.transport.command, 1, 200)) {
      errors.push('Command must be a string between 1 and 200 characters for stdio transport');
    }
    
    if (server.transport.args && !isValidArray(server.transport.args, 0, 50)) {
      errors.push('Args must be an array with up to 50 items for stdio transport');
    }
  }
  
  if ((server?.transport?.type === 'sse' || server?.transport?.type === 'websocket')) {
    if (!isValidString(server.transport.url, 1, 500)) {
      errors.push('URL must be a string between 1 and 500 characters for HTTP-based transports');
    }
    
    if (!isValidURL(server.transport.url)) {
      errors.push('URL must be a valid URL for HTTP-based transports');
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Subject mode validation
export function validateSubjectMode(mode: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!isValidString(mode?.name, 1, 50)) {
    errors.push('Subject mode name must be a string between 1 and 50 characters');
  }
  
  if (!isValidString(mode?.displayName, 1, 100)) {
    errors.push('Display name must be a string between 1 and 100 characters');
  }
  
  if (mode?.description && !isValidString(mode.description, 0, 500)) {
    errors.push('Description must be a string up to 500 characters');
  }
  
  if (!isValidArray(mode?.tools, 1, 100)) {
    errors.push('Tools must be an array with 1 to 100 items');
  }
  
  if (mode?.tools && mode.tools.some((tool: any) => !isValidString(tool, 1, 100))) {
    errors.push('Each tool name must be a string between 1 and 100 characters');
  }
  
  if (mode?.systemPrompt && !isValidString(mode.systemPrompt, 0, 5000)) {
    errors.push('System prompt must be a string up to 5000 characters');
  }
  
  if (mode?.color && !isValidString(mode.color, 0, 20)) {
    errors.push('Color must be a string up to 20 characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Setting validation
export function validateSetting(setting: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!isValidString(setting?.key, 1, 100)) {
    errors.push('Setting key must be a string between 1 and 100 characters');
  }
  
  if (setting?.value === undefined || setting?.value === null) {
    errors.push('Setting value cannot be undefined or null');
  }
  
  if (setting?.category && !isValidString(setting.category, 1, 50)) {
    errors.push('Setting category must be a string between 1 and 50 characters');
  }
  
  if (setting?.description && !isValidString(setting.description, 0, 500)) {
    errors.push('Setting description must be a string up to 500 characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Generic validation wrapper
export function validateData<T>(
  data: any,
  validator: (data: any) => { isValid: boolean; errors: string[] }
): { isValid: boolean; errors: string[]; data?: T } {
  const result = validator(data);
  return {
    isValid: result.isValid,
    errors: result.errors,
    data: result.isValid ? data as T : undefined
  };
}

// Sanitization functions
export function sanitizeString(str: string, maxLength = 1000): string {
  return str.trim().slice(0, maxLength);
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s*javascript:/gi, '')
    .replace(/\s*on\w+\s*=/gi, '');
}

export function sanitizePath(path: string): string {
  // Remove dangerous path components
  return path
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/\/+/g, '/') // Normalize multiple slashes
    .replace(/^\/+/, '') // Remove leading slashes
    .trim();
}

// Rate limiting utilities
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}
  
  canMakeRequest(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

// Error handling utilities
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function createValidationError(field: string, value: any, message: string): ValidationError {
  return new ValidationError(`Validation failed for ${field}: ${message}`, field, value);
}

// Type guards
export function isProject(obj: any): obj is { name: string; path: string } {
  return isValidObject(obj) && 
         isValidString(obj.name) && 
         isValidString(obj.path);
}

export function isChatSession(obj: any): obj is { title: string; subjectMode: string } {
  return isValidObject(obj) && 
         isValidString(obj.title) && 
         isValidString(obj.subjectMode);
}

export function isChatMessage(obj: any): obj is { role: string; content: string; sessionId: string } {
  const validRoles = ['user', 'assistant', 'system', 'tool'];
  return isValidObject(obj) && 
         validRoles.includes(obj.role) && 
         isValidString(obj.content) && 
         isValidString(obj.sessionId);
} 