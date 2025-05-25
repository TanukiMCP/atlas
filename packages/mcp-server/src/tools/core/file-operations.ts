import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { ToolResult, FileOperationOptions } from '../../types';
import { PathValidator } from '../../security/path-validator';

export class CoreFileOperations {
  private pathValidator: PathValidator;

  constructor() {
    this.pathValidator = new PathValidator({
      allowedPaths: [],
      deniedPaths: ['/system', '/windows', '/etc'],
      maxFileSize: 10 * 1024 * 1024,
      allowedOperations: ['read', 'write', 'create', 'list'],
      sandboxMode: true
    });
  }  async readFile(params: {
    path: string;
    offset?: number;
    length?: number;
    encoding?: string;
  }): Promise<ToolResult> {
    try {
      const validation = this.pathValidator.validatePath(params.path);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const content = await fs.readFile(params.path, {
        encoding: (params.encoding as any) || 'utf8'
      });

      if (params.offset !== undefined || params.length !== undefined) {
        const lines = content.split('\n');
        const start = params.offset || 0;
        const end = params.length ? start + params.length : lines.length;
        const selectedLines = lines.slice(start, end);
        
        return {
          success: true,
          result: {
            content: selectedLines.join('\n'),
            totalLines: lines.length,
            readLines: selectedLines.length
          }
        };
      }

      return {
        success: true,
        result: { content, size: content.length, lines: content.split('\n').length }
      };
    } catch (error) {
      return { success: false, error: `Failed to read file: ${error.message}` };
    }
  }  async writeFile(params: {
    path: string;
    content: string;
    mode?: 'write' | 'append';
    createDirs?: boolean;
  }): Promise<ToolResult> {
    try {
      const validation = this.pathValidator.validatePath(params.path);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      if (params.createDirs) {
        const dir = path.dirname(params.path);
        await fs.mkdir(dir, { recursive: true });
      }

      if (params.mode === 'append') {
        await fs.appendFile(params.path, params.content);
      } else {
        await fs.writeFile(params.path, params.content);
      }

      return {
        success: true,
        result: {
          path: params.path,
          size: params.content.length,
          mode: params.mode || 'write'
        }
      };
    } catch (error) {
      return { success: false, error: `Failed to write file: ${error.message}` };
    }
  }  async editBlock(params: {
    path: string;
    oldContent: string;
    newContent: string;
    expectedMatches?: number;
  }): Promise<ToolResult> {
    try {
      const validation = this.pathValidator.validatePath(params.path);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const content = await fs.readFile(params.path, 'utf8');
      const matches = (content.match(new RegExp(params.oldContent, 'g')) || []).length;
      
      if (params.expectedMatches && matches !== params.expectedMatches) {
        return {
          success: false,
          error: `Expected ${params.expectedMatches} matches, found ${matches}`
        };
      }

      const newContent = content.replace(params.oldContent, params.newContent);
      await fs.writeFile(params.path, newContent);

      return {
        success: true,
        result: {
          path: params.path,
          matchesFound: matches,
          replaced: matches > 0
        }
      };
    } catch (error) {
      return { success: false, error: `Failed to edit file: ${error.message}` };
    }
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
  }
}