import { ipcMain } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import * as os from 'os';
import * as path from 'path';

interface TerminalInstance {
  process: ChildProcess;
  onData: (data: string) => void;
}

class TerminalService {
  private terminals: Map<number, TerminalInstance> = new Map();
  private shell: string;
  private shellArgs: string[];

  constructor() {
    // Determine the appropriate shell based on the platform
    if (process.platform === 'win32') {
      this.shell = 'powershell.exe';
      this.shellArgs = ['-NoLogo'];
    } else {
      this.shell = process.env.SHELL || '/bin/bash';
      this.shellArgs = ['-l'];
    }

    this.setupIPC();
  }

  private setupIPC() {
    // Create a new terminal instance
    ipcMain.handle('terminal:create', (event, { cwd }) => {
      const childProcess = spawn(this.shell, this.shellArgs, {
        cwd: cwd || os.homedir(),
        env: process.env,
        shell: true
      });

      const pid = childProcess.pid!;

      // Set up data handling
      const onData = (data: string) => {
        event.sender.send('terminal:data', data);
      };

      childProcess.stdout?.on('data', (data) => {
        onData(data.toString());
      });

      childProcess.stderr?.on('data', (data) => {
        onData(data.toString());
      });

      // Store the terminal instance
      this.terminals.set(pid, {
        process: childProcess,
        onData
      });

      return pid;
    });

    // Write data to the terminal
    ipcMain.handle('terminal:write', (event, { pid, data }) => {
      const terminal = this.terminals.get(pid);
      if (terminal) {
        terminal.process.stdin?.write(data);
      }
    });

    // Change working directory
    ipcMain.handle('terminal:cd', (event, { path: dirPath }) => {
      if (process.platform === 'win32') {
        return this.executeCommand(`cd "${dirPath}"`);
      } else {
        return this.executeCommand(`cd "${dirPath}"`);
      }
    });

    // Clean up when window is closed
    ipcMain.handle('terminal:cleanup', (event, { pid }) => {
      const terminal = this.terminals.get(pid);
      if (terminal) {
        terminal.process.kill();
        this.terminals.delete(pid);
      }
    });
  }

  private executeCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(command, [], {
        shell: true,
        env: process.env
      });

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      childProcess.on('error', reject);
    });
  }
}

export const terminalService = new TerminalService(); 