#!/usr/bin/env node

/**
 * TanukiMCP Atlas MSI Build Script
 * Creates a Windows MSI installer for easy distribution
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class MSIBuilder {
  constructor() {
    this.version = require('../package.json').version;
    this.appName = 'TanukiMCP Atlas';
    this.outputDir = path.join(__dirname, '..', 'dist');
  }

  async build() {
    console.log('🏗️  Building TanukiMCP Atlas MSI Installer...\n');
    
    try {
      await this.prepareBuild();
      await this.buildApplication();
      await this.createInstaller();
      console.log('\n🎉 MSI installer created successfully!');
      console.log(`📦 Location: ${this.outputDir}`);
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    }
  }

  async prepareBuild() {
    console.log('🔧 Preparing build environment...');
    
    // Clean previous builds
    if (fs.existsSync(this.outputDir)) {
      fs.rmSync(this.outputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(this.outputDir, { recursive: true });
    
    console.log('✅ Build environment ready');
  }

  async buildApplication() {
    console.log('🔨 Building application...');
    
    try {
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Application built successfully');
    } catch (error) {
      throw new Error('Failed to build application');
    }
  }

  async createInstaller() {
    console.log('📦 Creating MSI installer...');
    
    // Check if electron-builder is available
    try {
      execSync('npx electron-builder --version', { stdio: 'pipe' });
    } catch (error) {
      console.log('📥 Installing electron-builder...');
      execSync('npm install --save-dev electron-builder', { stdio: 'inherit' });
    }
    
    // Create installer
    try {
      execSync('npx electron-builder --win --publish=never', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ MSI installer created');
    } catch (error) {
      throw new Error('Failed to create installer');
    }
  }
}

new MSIBuilder().build();