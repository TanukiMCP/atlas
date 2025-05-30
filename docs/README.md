# TanukiMCP Atlas - Documentation Index

This directory contains the design and technical documentation for TanukiMCP Atlas, an Electron-based AI development platform powered by OpenRouter, enhanced by Clear-Thought reasoning, and orchestrated by MCP Tools.

## Documentation Categories

### 1. Overview
1. [Project Overview](01-project-overview.md) – Vision, goals, and high-level requirements
2. [Design Map](02-design-map-updated.md) – Comprehensive system design overview

### 2. Core Architecture
3. [System Architecture](03-system-architecture.md) – Electron processes, IPC, and application structure
4. [Tool System Architecture](04-tool-system-architecture.md) – Tool framework and integration
5. [Task Management Core](05-task-management-core.md) – Task execution engine and workflow management
6. [Enhanced LLM Architecture](14-enhanced-llm-architecture.md) – Clear-Thought reasoning and multi-tier processing
7. [Agent vs Chat Modes](15-agent-chat-modes.md) – Dual operation modes and seamless switching
8. [Intelligent Orchestration](21-intelligent-orchestration-architecture.md) – Model and workflow orchestration strategies
9. [Workflow System Architecture](18-workflow-system-architecture.md) – Automated workflow generation and execution

### 3. Integration & Data
10. [LLM Integration](06-llm-integration.md) – OpenRouter API usage and model management
11. [MCP Integration](07-mcp-integration.md) – MCP server and client interaction
12. [Database Schema](08-database-schema.md) – SQLite schema and data models
13. [Security Framework](09-security-framework.md) – Security policies and sandbox guidelines

### 4. UI/UX
14. [UI Components](10-ui-components.md) – React components and design system
15. [UI Wireframes](ui-wireframes-detailed.md) – Detailed interface mockups
16. [Toolbar Architecture](toolbar-architecture.md) – Toolbar design and functionality
17. [Prompt Management UI](19-llm-prompt-management-ui.md) – System prompt customization interface

### 5. Guides & Reference
18. [Development Guide](DEVELOPMENT-GUIDE.md) – Setup, coding practices, and contributing
19. [Setup Guide](../scripts/SETUP-GUIDE.md) – One-click setup instructions
20. [Technical Specs](11-technical-specs.md) – Performance requirements and environment details
21. [Success Metrics](12-success-metrics.md) – Key performance indicators
22. [Future Roadmap](13-future-roadmap.md) – Upcoming features and long-term plans

## Deprecated & Archived
The following legacy documents have been archived in the `archive/` directory as they no longer reflect the current OpenRouter-only architecture:
- `17-local-only-architecture-changes.md`
- Any documents referencing Ollama or local-only model tiers

## 🎯 Quick Navigation Guide

### 🔨 **For Implementation**
**Start Here**: [Complete Design Map](02-design-map-updated.md) → [System Architecture](03-system-architecture.md) → [Tool System Architecture](04-tool-system-architecture.md) → [Complete MCP Architecture](16-mcp-architecture-complete.md) → [Workflow System Architecture](18-workflow-system-architecture.md)

### 🧠 **For AI/LLM Engineers**
**Start Here**: [Enhanced LLM Architecture](14-enhanced-llm-architecture.md) → [Agent Mode vs Chat Mode](15-agent-chat-modes.md) → [LLM Integration](06-llm-integration.md) → [Task Management](05-task-management-core.md)

### 👨‍💻 **For Backend Developers**
**Start Here**: [System Architecture](03-system-architecture.md) → [Enhanced LLM Architecture](14-enhanced-llm-architecture.md) → [Tool System Architecture](04-tool-system-architecture.md) → [Database Schema](08-database-schema.md)

### 🎨 **For Frontend/UX Designers** 
**Start Here**: [UI Components](10-ui-components.md) → [Agent Mode vs Chat Mode](15-agent-chat-modes.md) → [UI Wireframes](ui-wireframes-detailed.md)

### 📊 **For Product Managers**
**Start Here**: [Project Overview](01-project-overview.md) → [Complete Design Map](02-design-map-updated.md) → [Intelligent Orchestration Architecture](21-intelligent-orchestration-architecture.md) → [Agent Mode vs Chat Mode](15-agent-chat-modes.md) → [Success Metrics](12-success-metrics.md) → [Future Roadmap](13-future-roadmap.md)

### 🔒 **For Security Review**
**Start Here**: [Security Framework](09-security-framework.md) → [Enhanced LLM Architecture](14-enhanced-llm-architecture.md) → [Technical Specs](11-technical-specs.md)

### 🏗️ **For System Architects**
**Start Here**: [Enhanced LLM Architecture](14-enhanced-llm-architecture.md) → [Agent Mode vs Chat Mode](15-agent-chat-modes.md) → [System Architecture](03-system-architecture.md) → [MCP Integration](07-mcp-integration.md)

### 🔨 **For Developers Ready to Build**
**Start Here**: [DEVELOPMENT-GUIDE.md](DEVELOPMENT-GUIDE.md) - Complete development setup and implementation guide for building TanukiMCP Atlas.

## 🚀 Revolutionary Features Overview

### 🎭 Dual-Mode Operation System
- **Agent Mode**: Full autonomous execution with comprehensive tool access
- **Chat Mode**: High-quality conversational intelligence with thinking tools only
- **Seamless Mode Switching**: Context-preserving transitions between modes
- **Intelligent Mode Detection**: Automatic routing based on request analysis

### 🎭 Multi-Tiered Intelligence Processing
- **Tier 1**: Hidden LLM Router (Request Classification & Routing)
- **Tier 2**: Atomic Task Processing (Lightning-fast simple tasks)
- **Tier 3**: Moderate Task Processing (Balanced multi-step execution)
- **Tier 4**: Complex Task Processing (Full sophisticated pipeline)

### 🏆 AI Agent Council Quality Assurance
- **Tournament Bracket System**: 4-agent enhancement competition
- **Voting Panel**: 10-judge consensus-based evaluation  
- **Expert Panel Review**: Final quality validation
- **80% Consensus Requirement**: Ensures high-quality outputs

### 🔄 Hybrid Mode Management
- **Dynamic Complexity Assessment**: Real-time tier switching
- **Adaptive Resource Optimization**: Intelligent load balancing
- **User Preference Learning**: Personalized approach adaptation

### 🛑 Advanced User Intervention
- **Always-Available Stop Button**: Instant halt capability
- **Granular Control**: Phase/task/tool level intervention
- **Dynamic Course Correction**: Real-time plan adjustment
- **Context Preservation**: Never lose progress

### 🛡️ Comprehensive Failure Recovery
- **Multi-Level Detection**: Proactive issue identification
- **Intelligent Recovery**: Context-aware problem resolution
- **Graceful Degradation**: Maintain service during issues
- **Learning Adaptation**: Improve from past failures

### 🔧 Intelligent Workflow Automation
- **Chat-to-Workflow Conversion**: Transform successful conversations into reusable workflows
- **LangChain Integration**: Advanced workflow orchestration with state management
- **Variable Detection**: Automatic parameter identification for workflow reuse
- **Community Sharing**: Public workflow marketplace with ratings and templates
- **A/B Testing**: Workflow optimization through experimentation

## 📏 Documentation Standards

✅ **Enhanced Standards**:
- **Sophisticated Architecture**: Multi-layered LLM processing system
- **Dual-Mode Operation**: Agent vs Chat mode specifications
- **Adaptive Complexity**: Intelligent routing based on task complexity
- **Quality Assurance**: Tournament-bracket enhancement system
- **User Control**: Comprehensive intervention and stop mechanisms
- **Focused scope**: Each file covers specific system aspects
- **TypeScript interfaces**: Complete type definitions for implementation
- **Cross-references**: Linked related documents 
- **Implementation-ready**: Detailed enough for direct development use

## 🎉 Revolutionary Advancement

### **Before**: Standard LLM Integration
- ❌ Single-tier processing for all requests
- ❌ No quality assurance mechanisms
- ❌ Limited failure recovery
- ❌ Basic user interaction
- ❌ No adaptive complexity management
- ❌ Single operation mode

### **After**: Enhanced Multi-Layered Intelligence System  
- ✅ 4-tier adaptive processing architecture
- ✅ Dual-mode operation (Agent + Chat)
- ✅ Tournament-bracket quality enhancement
- ✅ Comprehensive failure recovery & resilience
- ✅ Advanced user intervention & stop controls
- ✅ Hybrid mode with dynamic complexity assessment
- ✅ AI agent council review system
- ✅ Early stopping & quality optimization
- ✅ Context-aware task sequencing
- ✅ Real-time performance monitoring
- ✅ Seamless mode switching with context preservation

## 🎯 Key Architecture Innovations

### **Dual-Mode Intelligence**
Agent Mode provides full autonomous execution capabilities while Chat Mode offers sophisticated conversational intelligence, both utilizing the enhanced LLM processing architecture.

### **Intelligent Request Routing**
Every user input is classified and routed to the appropriate processing tier based on complexity, ensuring optimal resource usage and response time.

### **Quality Assurance Through Competition**
A tournament-bracket system where multiple AI agents compete to enhance task plans, with voting panels ensuring only the highest quality approaches proceed.

### **Adaptive Complexity Management**
The system dynamically adjusts processing complexity based on real-time assessment of task requirements, user preferences, and resource constraints.

### **Comprehensive User Control**
Advanced stop, correction, and redirection capabilities that preserve context and allow for dynamic course correction without losing progress.

### **Failure Resilience**
Multi-layered failure detection and recovery mechanisms ensure the system remains functional and helpful even when individual components encounter issues.

## 📁 Archive

Historical documentation has been moved to the [`archive/`](archive/) directory to maintain a clean documentation structure. This includes:
- Phase validation documents
- Implementation summaries  
- Temporary documentation
- Consolidated redundant files

See [`archive/README.md`](archive/README.md) for details on archived content.

---

*This documentation now provides a complete foundation for building TanukiMCP: Atlas as a sophisticated AI reasoning system that revolutionizes how LLMs process, plan, and execute complex tasks through intelligent multi-layered architecture with dual operational modes for maximum flexibility and user control.*