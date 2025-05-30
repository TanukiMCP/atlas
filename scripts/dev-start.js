#!/usr/bin/env node

/**
 * TanukiMCP Atlas Development Startup Script
 * Handles dependency installation, OpenRouter setup guidance, and development server startup
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
      await this.setupOpenRouter();
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

  async setupOpenRouter() {
    console.log('\n🤖 Setting up OpenRouter...');
    
    console.log('ℹ️  OpenRouter is a cloud-based AI service that provides access to various models.');
    console.log('   To use TanukiMCP Atlas with OpenRouter:');
    console.log('');
    console.log('   1. Visit https://openrouter.ai and create a free account');
    console.log('   2. Go to https://openrouter.ai/keys to generate an API key');
    console.log('   3. Launch the application and go to Settings');
    console.log('   4. Enter your OpenRouter API key in the settings');
    console.log('');
    console.log('   Free tier includes access to several models like:');
    console.log('   • Llama 3.1 8B (Free)');
    console.log('   • Gemma 2 9B (Free)');
    console.log('   • Phi-3 Mini (Free)');
    console.log('   • Mistral 7B (Free)');
    console.log('');
    console.log('✅ OpenRouter setup guidance provided');
  }

  async startDevelopment() {
    console.log('\n🚀 Starting development servers...\n');
    
    console.log('🎯 TanukiMCP Atlas will be available at:');
    console.log('   • Main Application: Electron window will open automatically');
    console.log('   • Renderer Process: http://localhost:3000 (for debugging)');
    console.log('   • OpenRouter: Configure API key in Settings\n');
    
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