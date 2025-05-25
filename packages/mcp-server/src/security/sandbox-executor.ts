import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { SecurityContext } from '../types';

const execAsync = promisify(exec);

export class SandboxExecutor {
  private securityContext: SecurityContext;

  constructor(securityContext: SecurityContext) {
    this.securityContext = securityContext;
  }

  async executeCommand(
    command: string,
    options: {
      timeout?: number;
      cwd?: string;
      env?: Record<string, string>;
    } = {}
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    if (!this.securityContext.sandboxMode) {
      throw new Error('Sandbox mode is disabled');
    }

    if (!this.isCommandAllowed(command)) {
      throw new Error('Command not allowed in sandbox mode');
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: options.timeout || 30000,
        cwd: options.cwd,
        env: { ...process.env, ...options.env },
        maxBuffer: 1024 * 1024
      });

      return { stdout, stderr, exitCode: 0 };
    } catch (error) {
      return {
        stdout: '',
        stderr: error.message,
        exitCode: error.code || 1
      };
    }
  }  private isCommandAllowed(command: string): boolean {
    const dangerous = [
      'rm -rf',
      'del /f',
      'format',
      'fdisk',
      'sudo',
      'su ',
      'chmod 777',
      'chown',
      'kill -9',
      'shutdown',
      'reboot'
    ];
    
    return !dangerous.some(danger => command.includes(danger));
  }

  async executePython(
    script: string,
    options: { timeout?: number; cwd?: string } = {}
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const safeScript = this.sanitizePythonScript(script);
    return this.executeCommand(`python -c "${safeScript}"`, options);
  }

  private sanitizePythonScript(script: string): string {
    // Remove dangerous imports and functions
    const forbidden = [
      'import os',
      'import subprocess',
      'import sys',
      '__import__',
      'exec(',
      'eval(',
      'open('
    ];
    
    let sanitized = script;
    forbidden.forEach(item => {
      sanitized = sanitized.replace(new RegExp(item, 'g'), '');
    });
    
    return sanitized;
  }
}