import { spawn, ChildProcess } from 'child_process';
import { app } from 'electron';
import { join } from 'path';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { download } from 'electron-dl';
import { BrowserWindow } from 'electron';

class OllamaService {
  private ollamaProcess: ChildProcess | null = null;
  private isRunning: boolean = false;
  private serverUrl: string = 'http://localhost:11434';
  private installPath: string = '';
  private isInstalling: boolean = false;
  private installProgress: number = 0;
  
  constructor() {
    // Determine Ollama install path based on platform
    if (process.platform === 'win32') {
      this.installPath = join(homedir(), 'AppData', 'Local', 'Programs', 'Ollama');
    } else if (process.platform === 'darwin') {
      this.installPath = '/Applications/Ollama.app';
    } else if (process.platform === 'linux') {
      this.installPath = '/usr/local/bin';
    }
    
    // Check if Ollama is already running
    this.checkIfRunning();
  }
  
  /**
   * Check if Ollama server is already running
   */
  async checkIfRunning(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/api/version`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      this.isRunning = response.ok;
      return this.isRunning;
    } catch (error) {
      this.isRunning = false;
      return false;
    }
  }
  
  /**
   * Start the Ollama server
   */
  async startServer(): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Check if already running
      const isAlreadyRunning = await this.checkIfRunning();
      if (isAlreadyRunning) {
        return { success: true, url: this.serverUrl };
      }
      
      // Check if Ollama is installed
      const isInstalled = await this.checkIfInstalled();
      if (!isInstalled) {
        return { success: false, error: 'Ollama is not installed. Please install it first.' };
      }
      
      // Start Ollama server
      let executablePath = '';
      
      if (process.platform === 'win32') {
        executablePath = join(this.installPath, 'ollama.exe');
      } else if (process.platform === 'darwin') {
        executablePath = join(this.installPath, 'Contents', 'MacOS', 'Ollama');
      } else if (process.platform === 'linux') {
        executablePath = join(this.installPath, 'ollama');
      }
      
      if (!existsSync(executablePath)) {
        return { success: false, error: `Ollama executable not found at ${executablePath}` };
      }
      
      // Spawn Ollama process
      this.ollamaProcess = spawn(executablePath, ['serve'], {
        detached: true,
        stdio: 'ignore',
      });
      
      // Wait for server to start
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const isRunning = await this.checkIfRunning();
        
        if (isRunning) {
          this.isRunning = true;
          return { success: true, url: this.serverUrl };
        }
        
        attempts++;
      }
      
      return { success: false, error: 'Failed to start Ollama server after multiple attempts' };
    } catch (error) {
      console.error('Error starting Ollama server:', error);
      return { success: false, error: `Failed to start Ollama server: ${error instanceof Error ? error.message : String(error)}` };
    }
  }
  
  /**
   * Stop the Ollama server
   */
  async stopServer(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isRunning) {
        return { success: true };
      }
      
      if (this.ollamaProcess) {
        // Kill the process
        if (process.platform === 'win32') {
          // On Windows, we need to use taskkill to kill the process tree
          spawn('taskkill', ['/pid', this.ollamaProcess.pid.toString(), '/f', '/t']);
        } else {
          // On Unix-like systems, we can kill the process group
          process.kill(-this.ollamaProcess.pid, 'SIGTERM');
        }
        
        this.ollamaProcess = null;
      } else {
        // If we didn't start the server but it's running, try to kill it by name
        if (process.platform === 'win32') {
          spawn('taskkill', ['/im', 'ollama.exe', '/f']);
        } else if (process.platform === 'darwin') {
          spawn('pkill', ['Ollama']);
        } else if (process.platform === 'linux') {
          spawn('pkill', ['ollama']);
        }
      }
      
      // Wait for server to stop
      let attempts = 0;
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const isRunning = await this.checkIfRunning();
        
        if (!isRunning) {
          this.isRunning = false;
          return { success: true };
        }
        
        attempts++;
      }
      
      return { success: false, error: 'Failed to stop Ollama server after multiple attempts' };
    } catch (error) {
      console.error('Error stopping Ollama server:', error);
      return { success: false, error: `Failed to stop Ollama server: ${error instanceof Error ? error.message : String(error)}` };
    }
  }
  
  /**
   * Check if Ollama is installed
   */
  async checkIfInstalled(): Promise<boolean> {
    try {
      let executablePath = '';
      
      if (process.platform === 'win32') {
        executablePath = join(this.installPath, 'ollama.exe');
      } else if (process.platform === 'darwin') {
        executablePath = join(this.installPath, 'Contents', 'MacOS', 'Ollama');
      } else if (process.platform === 'linux') {
        executablePath = join(this.installPath, 'ollama');
      }
      
      return existsSync(executablePath);
    } catch (error) {
      console.error('Error checking if Ollama is installed:', error);
      return false;
    }
  }
  
  /**
   * Install Ollama
   */
  async installOllama(window: BrowserWindow): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.isInstalling) {
        return { success: false, error: 'Ollama installation is already in progress' };
      }
      
      this.isInstalling = true;
      this.installProgress = 0;
      
      // Get download URL based on platform
      let downloadUrl = '';
      
      if (process.platform === 'win32') {
        downloadUrl = 'https://ollama.ai/download/ollama-windows.exe';
      } else if (process.platform === 'darwin') {
        if (process.arch === 'arm64') {
          downloadUrl = 'https://ollama.ai/download/Ollama-darwin-arm64.zip';
        } else {
          downloadUrl = 'https://ollama.ai/download/Ollama-darwin.zip';
        }
      } else if (process.platform === 'linux') {
        downloadUrl = 'https://ollama.ai/download/ollama-linux-amd64';
      } else {
        return { success: false, error: `Unsupported platform: ${process.platform}` };
      }
      
      // Download Ollama
      const dl = await download(window, downloadUrl, {
        directory: app.getPath('temp'),
        onProgress: (progress) => {
          this.installProgress = progress.percent * 100;
        }
      });
      
      // Handle installation based on platform
      if (process.platform === 'win32') {
        // Run the installer
        spawn(dl.getSavePath(), [], {
          detached: true,
          stdio: 'ignore',
        });
      } else if (process.platform === 'darwin') {
        // Unzip and move to Applications
        spawn('unzip', ['-o', dl.getSavePath(), '-d', '/Applications']);
      } else if (process.platform === 'linux') {
        // Make executable and move to /usr/local/bin
        spawn('chmod', ['+x', dl.getSavePath()]);
        spawn('mv', [dl.getSavePath(), '/usr/local/bin/ollama']);
      }
      
      this.isInstalling = false;
      return { success: true };
    } catch (error) {
      console.error('Error installing Ollama:', error);
      this.isInstalling = false;
      return { success: false, error: `Failed to install Ollama: ${error instanceof Error ? error.message : String(error)}` };
    }
  }
  
  /**
   * Get installation status
   */
  getInstallStatus(): { isInstalling: boolean; progress: number } {
    return {
      isInstalling: this.isInstalling,
      progress: this.installProgress
    };
  }
  
  /**
   * Get server status
   */
  getServerStatus(): { isRunning: boolean; url: string } {
    return {
      isRunning: this.isRunning,
      url: this.serverUrl
    };
  }
}

export const ollamaService = new OllamaService(); 