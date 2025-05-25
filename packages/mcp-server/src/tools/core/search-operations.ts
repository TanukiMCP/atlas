import fs from 'fs/promises';
import path from 'path';
import { ToolResult } from '../../types';
import { PathValidator } from '../../security/path-validator';

export class SearchOperations {
  private pathValidator: PathValidator;

  constructor() {
    this.pathValidator = new PathValidator({
      allowedPaths: [],
      deniedPaths: ['/system', '/windows', '/etc'],
      maxFileSize: 10 * 1024 * 1024,
      allowedOperations: ['read', 'list'],
      sandboxMode: true
    });
  }

  async searchFiles(params: {
    directory: string;
    pattern: string;
    fileTypes?: string[];
  }): Promise<ToolResult> {
    try {
      const validation = this.pathValidator.validatePath(params.directory);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const results: any[] = [];
      await this.searchRecursive(params.directory, params.pattern, results, params.fileTypes);

      return {
        success: true,
        result: {
          matches: results,
          totalMatches: results.length
        }
      };
    } catch (error) {
      return { success: false, error: `Search failed: ${error.message}` };
    }
  }  private async searchRecursive(
    dir: string,
    pattern: string,
    results: any[],
    fileTypes?: string[]
  ): Promise<void> {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        await this.searchRecursive(fullPath, pattern, results, fileTypes);
      } else if (item.isFile()) {
        if (fileTypes && !fileTypes.some(ext => item.name.endsWith(ext))) {
          continue;
        }
        
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          if (content.includes(pattern)) {
            results.push({
              file: fullPath,
              matches: this.findMatchesInContent(content, pattern)
            });
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }

  private findMatchesInContent(content: string, pattern: string): any[] {
    const lines = content.split('\n');
    const matches: any[] = [];
    
    lines.forEach((line, index) => {
      if (line.includes(pattern)) {
        matches.push({
          line: index + 1,
          content: line.trim(),
          context: this.getLineContext(lines, index)
        });
      }
    });
    
    return matches;
  }

  private getLineContext(lines: string[], lineIndex: number): any {
    const start = Math.max(0, lineIndex - 2);
    const end = Math.min(lines.length, lineIndex + 3);
    return {
      before: lines.slice(start, lineIndex),
      after: lines.slice(lineIndex + 1, end)
    };
  }
}