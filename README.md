# 🦝 TanukiMCP Atlas

**The Future of AI Development: Revolutionary Cloud-Powered Intelligence System**

TanukiMCP Atlas is a groundbreaking **OpenRouter-powered AI development platform** that redefines how we interact with artificial intelligence. Built on an innovative Enhanced LLM Processing Architecture, Atlas delivers sophisticated AI capabilities through a streamlined, user-friendly interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![Open Source](https://img.shields.io/badge/open%20source-community%20driven-orange.svg)
![OpenRouter](https://img.shields.io/badge/powered%20by-OpenRouter-green.svg)

## 🌟 What Makes Atlas Revolutionary?

### 🧠 **Enhanced Multi-Layered Intelligence**
Atlas features a sophisticated architecture that leverages OpenRouter's powerful models:
- **Free Model Access**: Utilize powerful models through OpenRouter's free tier
- **Task-Optimized Processing**: Intelligent routing to the right model for each task
- **Advanced Reasoning**: Multi-step reasoning through Clear-Thought integration
- **Agent Capabilities**: Comprehensive tool access and orchestration

### 🎭 **Dual-Mode Operation**
- **Agent Mode**: Full autonomous execution with comprehensive tool access
- **Chat Mode**: High-quality conversational intelligence with thinking tools
- **Seamless Switching**: Context-preserving transitions between modes

### 🏆 **AI Quality Assurance**
- **Enhanced Reasoning Tools**: Clear-Thought's advanced reasoning capabilities
- **Tool Integration**: Comprehensive toolkit for complex workflows
- **Quality Verification**: Multi-stage verification of complex outputs

### 🛡️ **Simplified Setup & Control**
- **OpenRouter Integration**: Easy setup with just an API key
- **Always-Available Stop Button**: Instant halt capability for any operation
- **Granular Control**: Intervene at any phase, task, or tool level
- **Privacy-Respecting**: Configure data sharing settings to your preferences

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
│   ├── renderer/       # React frontend
│   ├── shared/         # Shared utilities and types
│   ├── mcp-server/     # MCP integration server
│   └── tools/          # Tool definitions and implementations
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

### 🤖 **OpenRouter Model Integration**
- Access to powerful AI models through OpenRouter
- Easy API key management
- Performance optimized requests
- Free model tier support

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
- **OpenRouter API Key** (free tier available at [openrouter.ai](https://openrouter.ai))

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
# Add your OpenRouter API key below
OPENROUTER_API_KEY=your_api_key_here
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

**OpenRouter Connection Issues:**
- Verify your API key is correctly entered in settings
- Check your internet connection
- Ensure you're using a valid OpenRouter API key

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

Atlas represents a **new paradigm in AI interaction** - one where you have access to powerful AI capabilities through a streamlined, user-friendly interface. Whether you're a developer, researcher, student, or just curious about AI, Atlas provides the tools and intelligence you need.

**Just pure AI intelligence that grows with your needs.**

### Ready to experience the future of AI?

```bash
git clone https://github.com/TanukiMCP/atlas.git
cd tanukimcp-atlas
npm install && npm run dev
```

**Welcome to the Atlas community. Let's build the future of AI together.** 🦝✨

---

*Built with ❤️ by the community, for the community*  
*Empowering everyone with AI intelligence*

## Features

- Connect to OpenRouter API for access to state-of-the-art language models
- Advanced reasoning capabilities with Clear-Thought MCPs
- Contextual code analysis and generation
- Media understanding (OCR, image analysis, document processing)
- Mobile companion app for on-the-go access
- Desktop-to-mobile proxy for seamless cross-device experience
- File system isolation for secure operation
- Modern, accessible UI built with shadcn/ui

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tanukimcp-atlas.git
cd tanukimcp-atlas

# Install dependencies
npm install

# Start the development version
npm run dev
```

### Configuration

1. Launch the application
2. Navigate to Settings
3. Enter your OpenRouter API key
4. Select your preferred models

## Desktop-Mobile Connection

TanukiMCP Atlas includes a unique cross-device experience:

1. Enable the mobile proxy from the desktop toolbar
2. Scan the QR code with the TanukiMCP Atlas mobile app
3. Your mobile device will connect to your desktop instance
4. Use all AI capabilities from your mobile device, powered by your desktop

## Architecture

The application is built using Electron with a TypeScript/React frontend. The main components are:

- **Main Process**: Handles system operations, file access, and proxy server
- **Renderer**: The user interface built with React and shadcn/ui
- **Mobile App**: React Native application for iOS and Android
- **Proxy Server**: WebSocket server enabling desktop-mobile communication

## Directory Structure

```
tanukimcp-atlas/
├── docs/                 # Documentation and architecture diagrams
├── packages/
│   ├── main/             # Electron main process
│   ├── preload/          # Electron preload scripts
│   ├── renderer/         # Frontend UI (React)
│   └── mobile/           # Mobile companion app (React Native)
├── scripts/              # Build and development scripts
└── README.md             # This file
```

## Development

### Available Scripts

- `npm run dev` - Start the application in development mode
- `npm run build` - Build the application for production
- `npm run lint` - Run the linter
- `npm run test` - Run tests

### Mobile Development

For mobile app development, see the [Mobile README](packages/mobile/README.md).

## Media Processing

TanukiMCP Atlas can process various media types:

- **Images**: OCR, object detection, analysis
- **Documents**: Text extraction, summarization
- **Video**: Frame analysis, transcription
- **Audio**: Speech-to-text, analysis

The media processing pipeline uses specialized libraries like Tesseract.js for OCR and integrates with OpenRouter for advanced AI analysis.

## License

MIT License - see LICENSE file for details.

## Acknowledgements

- OpenRouter for API access to state-of-the-art models
- Electron for the cross-platform desktop framework
- React and shadcn/ui for the beautiful UI
- React Native for the mobile experience