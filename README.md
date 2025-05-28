# 🦝 TanukiMCP Atlas

**The Future of Local AI: Revolutionary Multi-Layered Intelligence System**

TanukiMCP Atlas is a groundbreaking **100% local AI reasoning platform** that redefines how we interact with artificial intelligence. Built on an innovative Enhanced LLM Processing Architecture, Atlas delivers sophisticated AI capabilities without compromising your privacy or requiring cloud subscriptions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![Local](https://img.shields.io/badge/AI-100%25%20Local-green.svg)
![Open Source](https://img.shields.io/badge/open%20source-community%20driven-orange.svg)

## 🌟 What Makes Atlas Revolutionary?

### 🧠 **Enhanced Multi-Layered Intelligence**
Atlas features a sophisticated **4-tier processing architecture** that adapts to task complexity:
- **Tier 1**: Lightning-fast simple requests (instant responses)
- **Tier 2**: Atomic task processing (optimized single-step execution)  
- **Tier 3**: Moderate complexity handling (multi-step reasoning)
- **Tier 4**: Complex task orchestration (full AI agent capabilities)

### 🎭 **Dual-Mode Operation**
- **Agent Mode**: Full autonomous execution with comprehensive tool access
- **Chat Mode**: High-quality conversational intelligence with thinking tools
- **Seamless Switching**: Context-preserving transitions between modes

### 🏆 **AI Quality Assurance Council**
- **Tournament Bracket Enhancement**: 4-agent competition system
- **Voting Panel Consensus**: 10-judge quality evaluation
- **Expert Panel Review**: Final validation for critical tasks
- **80% Agreement Requirement**: Ensures exceptional output quality

### 🛡️ **Complete Privacy & Control**
- **100% Local Operation**: No cloud APIs, no data tracking, no subscriptions
- **Always-Available Stop Button**: Instant halt capability for any operation
- **Granular Control**: Intervene at any phase, task, or tool level
- **Your Data Stays Yours**: Everything runs on your hardware

## 🚀 One-Click Setup

### Windows Users

**Option 1: Batch Script (Recommended)**
```bash
# Double-click or run in Command Prompt
setup.bat
```

**Option 2: PowerShell Script**
```powershell
# Run in PowerShell (with optional parameters)
.\install-dependencies.ps1
# Or with verbose output
.\install-dependencies.ps1 -Verbose
# Or skip build test
.\install-dependencies.ps1 -SkipBuild
```

### macOS/Linux Users

```bash
# Make executable and run
chmod +x setup.sh
./setup.sh
```

### What the Setup Scripts Do

✅ **Dependency Verification**: Check for Node.js, npm, and Git  
✅ **Package Installation**: Install all dependencies for root, main, and renderer packages  
✅ **Environment Setup**: Create necessary directories and `.env` file  
✅ **Build Verification**: Run initial build test to ensure everything works  
✅ **Ready to Use**: Complete setup with clear next steps  

## 🎯 Quick Start

After running the setup script:

### Option 1: Manual Start
```bash
# Terminal 1: Start development server
npm run dev

# Terminal 2: Start Electron app
npm start
```

### Option 2: Convenience Scripts

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm start` | Start Electron application |
| `npm run build` | Build for production |
| `npm run test` | Run test suite |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## 🏗️ Project Structure

```
tanukimcp-atlas/
├── packages/
│   ├── main/           # Electron main process
│   └── renderer/       # React frontend
├── setup.bat           # Windows setup script
├── setup.sh            # Unix setup script
├── install-dependencies.ps1  # PowerShell setup script
├── start.bat           # Windows start script
├── start.sh            # Unix start script
└── README.md
```

## 🎨 Features

### 🧠 **Clear-Thought Integration**
- Sequential thinking processes
- Mental model applications
- Collaborative reasoning
- Decision frameworks
- Scientific method application

### 🤖 **Model Management (TanukiMCP Apollo)**
- Greek mythology-themed model categorization
- Real-time model switching
- Performance benchmarking
- System capability assessment
- Installation progress tracking

### 🔧 **MCP Tools & Workflows**
- Tool execution interface
- Drag-and-drop workflow builder
- Visual workflow management
- Real-time tool status

### 📝 **Code Editor**
- Monaco Editor integration
- Multi-language support
- File system integration
- Syntax highlighting

### 💬 **Chat Interface**
- AI conversation interface
- Model-aware responses
- Context management
- Error handling

## 🛠️ Development

### Prerequisites

- **Node.js** 18.x or higher
- **npm** (comes with Node.js)
- **Git** (optional but recommended)

### Manual Setup (if scripts don't work)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tanukimcp-atlas
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd packages/main && npm install
   cd ../renderer && npm install
   cd ../..
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env  # or create manually
   ```

4. **Build and test**
   ```bash
   npm run build
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
ELECTRON_IS_DEV=true
VITE_DEV_SERVER_URL=http://localhost:3000
# Add your custom variables below
```

## 🔍 Troubleshooting

### Common Issues

**Build Errors:**
- Ensure Node.js version is 18.x or higher
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run type-check`

**Electron Won't Start:**
- Make sure development server is running first (`npm run dev`)
- Check if port 3000 is available
- Verify `.env` file exists and has correct values

**File System Errors:**
- Ensure you're running the desktop application, not in browser
- Check file permissions in the workspace directory

### Getting Help

1. Check the console for error messages
2. Verify all dependencies are installed correctly
3. Ensure you're using the correct Node.js version
4. Try running the setup script again

## 📦 Building for Production

```bash
npm run build
npm run electron:build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

Atlas is released under the **MIT License**, which means:
- ✅ **Free for personal use**
- ✅ **Free for commercial use**
- ✅ **Modify and distribute freely**
- ✅ **No attribution required** (but appreciated!)

See the [LICENSE](LICENSE) file for full details.

## 🎉 Start Your AI Journey Today

Atlas represents a **new paradigm in AI interaction** - one where you have complete control, absolute privacy, and unlimited potential. Whether you're a developer, researcher, student, or just curious about AI, Atlas provides the tools and intelligence you need.

**No subscriptions. No cloud dependencies. No limits.**

**Just pure, local AI intelligence that grows with your needs.**

### Ready to experience the future of AI?

```bash
git clone https://github.com/TanukiMCP/atlas.git
cd tanukimcp-atlas
npm install && npm run dev
```

**Welcome to the Atlas community. Let's build the future of AI together.** 🦝✨

---

*Built with ❤️ by the community, for the community*  
*Empowering everyone with local AI intelligence*