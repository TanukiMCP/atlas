import fs from 'fs/promises';
import path from 'path';
import { ToolResult } from '../../types';
import { PathValidator } from '../../security/path-validator';

export class FileSystemCRUD {
  private pathValidator: PathValidator;

  constructor() {
    this.pathValidator = new PathValidator({
      allowedPaths: [],
      deniedPaths: ['/system', '/windows', '/etc'],
      maxFileSize: 10 * 1024 * 1024,
      allowedOperations: ['read', 'write', 'create', 'delete', 'list'],
      sandboxMode: true
    });
  }

  async createDirectory(params: {
    path: string;
    recursive?: boolean;
  }): Promise<ToolResult> {
    try {
      const validation = this.pathValidator.validatePath(params.path);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      await fs.mkdir(params.path, { recursive: params.recursive });
      
      return {
        success: true,
        result: {
          path: params.path,
          created: true,
          recursive: params.recursive
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create directory: ${error.message}`
      };
    }
  }

  async deleteFile(params: {
    path: string;
    backup?: boolean;
  }): Promise<ToolResult> {
    try {
      const validation = this.pathValidator.validatePath(params.path);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      if (params.backup) {
        const backupPath = params.path + '.backup.' + Date.now();
        await fs.copyFile(params.path, backupPath);
      }

      await fs.unlink(params.path);
      
      return {
        success: true,
        result: {
          path: params.path,
          deleted: true,
          backup: params.backup
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete file: ${error.message}`
      };
    }
  }
}