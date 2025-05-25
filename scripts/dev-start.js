#!/usr/bin/env node

/**
 * TanukiMCP Atlas Development Startup Script
 * Handles dependency installation, Ollama setup, and development server startup
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class DevSetup {
  constructor() {
    this.isWindows = os.platform() === 'win32';
    this.isMacOS = os.platform() === 'darwin';
    this.isLinux = os.platform() === 'linux';
  }

  async run() {
    console.log('🦝 Starting TanukiMCP Atlas Development Environment...\n');
    
    try {
      await this.checkPrerequisites();
      await this.installDependencies();
      await this.setupOllama();
      await this.startDevelopment();
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`Node.js 18+ required. Current version: ${nodeVersion}`);
    }
    
    console.log(`✅ Node.js ${nodeVersion} detected`);
    
    // Check if npm is available
    try {
      await this.execCommand('npm --version');
      console.log('✅ npm is available');
    } catch (error) {
      throw new Error('npm not found. Please install Node.js with npm.');
    }
  }

  async installDependencies() {
    console.log('\n📦 Installing dependencies...');
    
    try {
      // Install root dependencies first
      console.log('📦 Installing root dependencies...');
      await this.execCommand('npm install', { cwd: process.cwd() });
      
      console.log('✅ All dependencies installed successfully');
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error.message}`);
    }
  }

  async setupOllama() {
    console.log('\n🤖 Setting up Ollama...');
    
    try {
      // Check if Ollama is installed
      await this.execCommand('ollama --version');
      console.log('✅ Ollama is already installed');
      
      // Check if Ollama is running
      try {
        await this.execCommand('curl -s http://localhost:11434/api/tags');
        console.log('✅ Ollama is running');
      } catch (error) {
        console.log('🚀 Starting Ollama...');
        if (this.isWindows) {
          spawn('ollama', ['serve'], { detached: true, stdio: 'ignore' });
        } else {
          spawn('ollama', ['serve'], { detached: true, stdio: 'ignore' });
        }
        
        // Wait a moment for Ollama to start
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('✅ Ollama started');
      }
      
      // Check for a default model
      try {
        const result = await this.execCommand('ollama list');
        if (result.includes('llama')) {
          console.log('✅ LLaMA model found');
        } else {
          console.log('📥 Downloading recommended model (llama3.2:3b)...');
          console.log('   This may take a few minutes...');
          await this.execCommand('ollama pull llama3.2:3b');
          console.log('✅ Model downloaded successfully');
        }
      } catch (error) {
        console.log('⚠️  Could not check models. Continuing anyway...');
      }
      
    } catch (error) {
      console.log('\n⚠️  Ollama not found. Please install Ollama:');
      console.log('   Windows: https://ollama.ai/download/windows');
      console.log('   macOS: https://ollama.ai/download/mac');
      console.log('   Linux: https://ollama.ai/download/linux');
      console.log('\n   After installation, run this script again.');
      throw new Error('Ollama installation required');
    }
  }

  async startDevelopment() {
    console.log('\n🚀 Starting development servers...\n');
    
    console.log('🎯 TanukiMCP Atlas will be available at:');
    console.log('   • Main Application: Electron window will open automatically');
    console.log('   • Renderer Process: http://localhost:3000 (for debugging)');
    console.log('   • Ollama API: http://localhost:11434\n');
    
    console.log('📝 Development commands:');
    console.log('   • npm run dev     - Start development');
    console.log('   • npm run build   - Build for production');
    console.log('   • npm run start   - Start built application\n');
    
    // Start the development server
    await this.execCommand('npm run dev:renderer', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
  }

  execCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const child = exec(command, options, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
      
      if (options.stdio === 'inherit') {
        child.stdout?.pipe(process.stdout);
        child.stderr?.pipe(process.stderr);
      }
    });
  }
}

// Run the setup
new DevSetup().run();