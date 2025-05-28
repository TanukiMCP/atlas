# Image Generation - Stable Diffusion Integration

## Overview

This package provides local image generation capabilities using Stable Diffusion, integrated as a built-in tool for TanukiMCP Atlas. The system is designed to be 100% local, 100% free, and 100% private.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Atlas Image Generation                   │
├─────────────────────────────────────────────────────────────┤
│  LLM-Driven Prompt Enhancement                              │
│  ├── User Request Analysis                                  │
│  ├── Vivid Detail Generation                               │
│  ├── Style and Composition Guidance                        │
│  └── Technical Parameter Optimization                      │
├─────────────────────────────────────────────────────────────┤
│  Stable Diffusion Engine                                   │
│  ├── Model Management (SDXL, SD 1.5, etc.)               │
│  ├── Pipeline Optimization                                 │
│  ├── Progress Tracking & Animation                         │
│  └── Output Post-Processing                                │
├─────────────────────────────────────────────────────────────┤
│  Integration Layer                                          │
│  ├── MCP Tool Interface                                     │
│  ├── Mobile Client Support                                 │
│  ├── Desktop UI Integration                                │
│  └── File Management                                       │
└─────────────────────────────────────────────────────────────┘
```

## Features

### LLM-Enhanced Prompting
- **Automatic Enhancement**: LLM analyzes user requests and generates vivid, detailed prompts
- **Style Guidance**: Intelligent style suggestions based on request context
- **Technical Optimization**: Automatic parameter tuning for best results
- **Iterative Refinement**: Multi-step prompt improvement process

### Local Stable Diffusion
- **Multiple Models**: Support for SDXL, SD 1.5, and custom models
- **Optimized Performance**: GPU acceleration with fallback to CPU
- **Progress Animation**: Real-time generation progress in chat interface
- **Batch Generation**: Multiple variations and iterations
- **Memory Management**: Efficient VRAM usage and cleanup

### Integration Benefits
- **Zero Cost**: No API fees or external dependencies
- **Complete Privacy**: All processing happens locally
- **Offline Capable**: Works without internet connection
- **Mobile Support**: Available on mobile PWA clients
- **Atlas Integration**: Seamless integration with Atlas workflow

## Installation

### Automatic Installation
Stable Diffusion is automatically installed with Atlas desktop application:

```bash
# Included in Atlas installation script
npm run install:atlas-full
# This installs:
# - Ollama (LLM)
# - Stable Diffusion WebUI
# - Required Python dependencies
# - CUDA/ROCm support (if available)
```

### Manual Installation
If needed, install Stable Diffusion separately:

```bash
# Install Stable Diffusion WebUI
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
./webui.sh --api --listen --port 7860

# Install required models
# SDXL Base model will be downloaded automatically
```

## Usage

### Basic Image Generation
```typescript
// Via Atlas chat interface
"Generate an image of a serene mountain landscape at sunset"

// The system will:
// 1. Enhance the prompt with vivid details
// 2. Select appropriate model and parameters
// 3. Generate the image with progress animation
// 4. Display result in chat with options for variations
```

### Advanced Parameters
```typescript
// Detailed control
"Generate a portrait photo with:
- Subject: Professional businesswoman
- Style: Corporate headshot
- Lighting: Soft natural light
- Background: Blurred office environment
- Quality: High resolution, sharp focus"
```

### Mobile Generation
- Full image generation support on mobile PWA
- Optimized for mobile viewing and sharing
- Progress indicators and offline queueing
- Automatic compression for mobile networks

## Technical Implementation

### Prompt Enhancement Pipeline
```typescript
interface PromptEnhancement {
  originalRequest: string;
  enhancedPrompt: string;
  negativePrompt: string;
  styleGuidance: string;
  technicalParams: {
    steps: number;
    cfgScale: number;
    sampler: string;
    dimensions: { width: number; height: number };
  };
}
```

### Generation Process
1. **Request Analysis**: LLM analyzes user intent and context
2. **Prompt Enhancement**: Generate detailed, vivid description
3. **Parameter Selection**: Choose optimal technical settings
4. **Model Selection**: Pick best model for the request type
5. **Generation**: Execute with progress tracking
6. **Post-Processing**: Enhance and optimize output
7. **Presentation**: Display with options for variations

### Performance Optimization
- **Model Caching**: Keep frequently used models in memory
- **Batch Processing**: Generate multiple variations efficiently
- **Progressive Loading**: Stream results as they generate
- **Resource Management**: Automatic cleanup and memory optimization

## Configuration

### Model Management
```typescript
interface ModelConfig {
  name: string;
  path: string;
  type: 'sdxl' | 'sd15' | 'custom';
  specialties: string[];
  memoryRequirement: number;
  defaultParams: GenerationParams;
}
```

### Quality Settings
- **Draft Mode**: Fast generation for previews (512x512, 20 steps)
- **Standard Mode**: Balanced quality/speed (768x768, 30 steps)
- **High Quality**: Maximum quality (1024x1024, 50 steps)
- **Custom**: User-defined parameters

## Security & Privacy

### Local Processing
- All image generation happens on local hardware
- No data sent to external services
- Complete user privacy and control
- Offline capability

### Content Safety
- Built-in content filtering
- Configurable safety settings
- User control over generation parameters
- Audit logging for generated content

## Integration Points

### Atlas Desktop
- Integrated into main chat interface
- Progress animations and notifications
- File management and organization
- Batch operations and queuing

### Mobile PWA
- Touch-optimized generation interface
- Mobile-friendly image viewing
- Offline generation queueing
- Share and export capabilities

### Clear Thought Tools
- Integration with visual reasoning tools
- Concept visualization for complex ideas
- Iterative design improvement
- Multi-modal problem solving 