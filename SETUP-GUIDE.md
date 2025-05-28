# 🚀 TanukiMCP Atlas - One-Click Setup Guide

This guide provides multiple ways to set up TanukiMCP Atlas with minimal effort. Choose the method that works best for your system.

## 📋 Prerequisites

Before running any setup script, ensure you have:

- **Node.js 18.x or higher** - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional but recommended) - [Download from git-scm.com](https://git-scm.com/)

## 🎯 One-Click Setup Options

### Windows Users

#### Option 1: Batch Script (Recommended for most users)
```bash
# Simply double-click the file or run in Command Prompt
setup.bat
```

#### Option 2: PowerShell Script (Advanced users)
```powershell
# Basic setup
.\install-dependencies.ps1

# With verbose output (see detailed progress)
.\install-dependencies.ps1 -Verbose

# Skip build test (faster setup)
.\install-dependencies.ps1 -SkipBuild
```

### macOS/Linux Users

```bash
# Make executable and run
chmod +x setup.sh
./setup.sh
```

## 🔍 What the Setup Scripts Do

✅ **System Check**: Verify Node.js, npm, and Git installation  
✅ **Dependency Installation**: Install all packages (root, main, renderer)  
✅ **Environment Setup**: Create necessary directories and configuration  
✅ **Build Test**: Verify everything compiles correctly  
✅ **Ready Confirmation**: Clear instructions for next steps  

## 🚀 Starting the Application

After setup completes, you have several options:

### Option 1: Convenience Scripts (Recommended)

**Windows:**
```bash
# Double-click or run in Command Prompt
start.bat
```

**macOS/Linux:**
```bash
# Make executable and run
chmod +x start.sh
./start.sh
```

### Option 2: Manual Start
```bash
# Terminal 1: Start development server
npm run dev

# Terminal 2: Start Electron app
npm start
```

### Option 3: NPM Scripts
```bash
# Windows
npm run start:dev

# Unix/Linux/macOS  
npm run start:unix
```

## 🔧 Verification

To check if your setup completed successfully:

```bash
npm run verify
```

This will check:
- All packages are installed
- Required directories exist
- Configuration files are present
- Environment is properly set up

## 📁 Created Files

The setup process creates these files:

| File | Purpose |
|------|---------|
| `setup.bat` | Windows batch setup script |
| `setup.sh` | Unix/Linux/macOS setup script |
| `install-dependencies.ps1` | PowerShell setup script |
| `start.bat` | Windows start script |
| `start.sh` | Unix/Linux/macOS start script |
| `verify-setup.js` | Setup verification script |
| `.env` | Environment configuration |
| `logs/`, `temp/`, `data/` | Working directories |

## 🛠️ Manual Setup (Fallback)

If the automated scripts don't work, you can set up manually:

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install main package dependencies:**
   ```bash
   cd packages/main
   npm install
   cd ../..
   ```

3. **Install renderer package dependencies:**
   ```bash
   cd packages/renderer
   npm install
   cd ../..
   ```

4. **Create environment file:**
   ```bash
   # Create .env file with these contents:
   NODE_ENV=development
   ELECTRON_IS_DEV=true
   VITE_DEV_SERVER_URL=http://localhost:3000
   ```

5. **Test build:**
   ```bash
   npm run build
   ```

## 🔍 Troubleshooting

### Common Issues

**"Node.js is not installed"**
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation
- Verify with: `node --version`

**"Permission denied" (Unix/Linux/macOS)**
- Make scripts executable: `chmod +x setup.sh start.sh`
- Or run with: `bash setup.sh`

**"Build test failed"**
- Check Node.js version: `node --version` (should be 18.x+)
- Clear cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**"Port 3000 already in use"**
- Stop other applications using port 3000
- Or change port in `.env`: `VITE_DEV_SERVER_URL=http://localhost:3001`

**PowerShell execution policy error**
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Or use: `powershell -ExecutionPolicy Bypass -File install-dependencies.ps1`

### Getting Help

1. Run the verification script: `npm run verify`
2. Check console output for specific error messages
3. Ensure you're using the correct Node.js version
4. Try the manual setup process
5. Check the main README.md for additional troubleshooting

## 📦 Available Commands

After setup, these commands are available:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm start` | Start Electron app |
| `npm run build` | Build for production |
| `npm run verify` | Verify setup |
| `npm run lint` | Run linter |
| `npm run type-check` | TypeScript checking |

## 🎉 Success!

Once setup is complete, you should see:
- Development server running on http://localhost:3000
- Electron app window opens
- All features working (chat, editor, tools, workflows, models)

Welcome to TanukiMCP Atlas! 🦝 