import path from 'path';
import fs from 'fs';
import { SecurityContext } from '../types';

export class PathValidator {
  private securityContext: SecurityContext;

  constructor(securityContext: SecurityContext) {
    this.securityContext = securityContext;
  }

  validatePath(filePath: string): { valid: boolean; error?: string } {
    try {
      const normalizedPath = path.resolve(filePath);
      
      if (this.hasPathTraversal(filePath)) {
        return { valid: false, error: 'Path traversal detected' };
      }

      if (this.isDeniedPath(normalizedPath)) {
        return { valid: false, error: 'Access denied' };
      }

      if (this.securityContext.allowedPaths.length > 0) {
        if (!this.isAllowedPath(normalizedPath)) {
          return { valid: false, error: 'Path not allowed' };
        }
      }

      if (fs.existsSync(normalizedPath)) {
        const stats = fs.statSync(normalizedPath);
        if (stats.size > this.securityContext.maxFileSize) {
          return { valid: false, error: 'File too large' };
        }
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: `Validation error: ${error.message}` };
    }
  }  private hasPathTraversal(filePath: string): boolean {
    const dangerous = ['../', '..\\', '/../', '\\..\\'];
    return dangerous.some(pattern => filePath.includes(pattern));
  }

  private isDeniedPath(normalizedPath: string): boolean {
    return this.securityContext.deniedPaths.some(deniedPath => 
      normalizedPath.startsWith(path.resolve(deniedPath))
    );
  }

  private isAllowedPath(normalizedPath: string): boolean {
    return this.securityContext.allowedPaths.some(allowedPath => 
      normalizedPath.startsWith(path.resolve(allowedPath))
    );
  }

  validateOperation(operation: string): boolean {
    return this.securityContext.allowedOperations.includes(operation);
  }

  createSecureContext(projectPath: string): SecurityContext {
    return {
      allowedPaths: [projectPath],
      deniedPaths: [
        '/system',
        '/windows',
        '/etc',
        '/root',
        '/usr/bin'
      ],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedOperations: ['read', 'write', 'create', 'list'],
      sandboxMode: true
    };
  }
}