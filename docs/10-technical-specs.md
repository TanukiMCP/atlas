# Technical Specifications

## 🔧 Performance Requirements

### Response Time Targets
- **Startup Time**: < 3 seconds on modern hardware (SSD, 8GB+ RAM)
- **LLM Response Time**: < 2 seconds for simple queries (local models)
- **Tool Execution**: < 100ms for basic operations, < 5s for complex tasks
- **File Operations**: < 50ms for reads, < 200ms for writes with diff calculation
- **UI Responsiveness**: < 16ms frame time (60 FPS)

### Resource Usage Limits
- **Memory Usage**: < 500MB baseline, < 2GB with large projects loaded
- **CPU Usage**: < 25% average usage during normal operation
- **Disk Space**: < 200MB application bundle, variable for models and data
- **Network**: Local-only by default, optional external for web search/cloud models

## 📊 Scalability Specifications

### Data Handling Capacity
- **Project Size**: Support projects with 10,000+ files efficiently
- **Chat History**: Handle 10,000+ messages with pagination and search
- **Concurrent Operations**: Execute up to 5 tools simultaneously
- **Model Management**: Support 10+ installed Ollama models
- **Database Performance**: Handle 1M+ records with sub-second queries

### File System Performance
- **File Watching**: Monitor 1,000+ files for changes
- **Search Operations**: Full-text search across 100,000+ lines of code
- **Backup Operations**: Incremental backups with minimal performance impact

## 🖥️ Platform Compatibility

### Operating System Support
- **Windows**: Windows 10+ (version 1903+)
- **macOS**: macOS 10.15+ (Catalina and later)
- **Linux**: Ubuntu 18.04+, Debian 10+, Fedora 30+

### Hardware Requirements
- **Minimum**: 4GB RAM, 2GB disk space, dual-core CPU
- **Recommended**: 8GB+ RAM, 10GB+ disk space, quad-core CPU
- **Architecture**: x64, ARM64 (Apple Silicon native support)

### Runtime Dependencies
- **Node.js**: 18.0+ with ES2022 support
- **Electron**: 28.0+ with context isolation enabled
- **Ollama**: Latest stable version for local LLM support