# TanukiMCP: Atlas - Detailed UI Wireframes (Updated)

## 🎨 Application Layout Architecture (Current Implementation + Planned)

### Main Window Structure (Current + Enhanced)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ TITLE BAR (30px height)                                              🌙 ⚙️ ⚡ ⊞ ✕ │
├────────────────────────────────────────────────────────────────────────────────────┤
│ MENU BAR (28px height)                                                             │
│ File  Edit  View  Navigate  Code  Run  Terminal  Tools  Window  Help              │
│ [CURRENT: File, Edit, View implemented | PLANNED: Full menu structure]            │
├────────────────────────────────────────────────────────────────────────────────────┤
│ TOOLBAR (36px height)                                                              │
│ [📁] [💾] [✂️] [📋] [↩️] [↪️] │ [▶️] [⏸️] [⏹️] │ [🔍] [⚙️] [📊] [🎯 Mode] [💬] │
│ [CURRENT: Basic toolbar | PLANNED: Context-sensitive controls]                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│                            MAIN CONTENT AREA                                       │
├──────────────────────┬─────────────────────────────┬──────────────────────────────┤
│    FILE EXPLORER     │        CHAT INTERFACE       │    PREVIEW/TOOL PANEL       │
│      (280px)         │         (Flexible)          │        (350px)               │
│   [✅ IMPLEMENTED]   │    [✅ BASIC STRUCTURE]     │    [⚠️ PLACEHOLDER]         │
│                      │                             │        [Optional]            │
├──────────────────────┴─────────────────────────────┴──────────────────────────────┤
│ STATUS BAR (24px height)                                                           │
│ 🟢 Connected | 🎯 Current Mode | 💾 Ready | 📊 Stats | [✅ IMPLEMENTED]          │
└────────────────────────────────────────────────────────────────────────────────────┘
```

## 📋 IDE Menu & Toolbar Structure (Updated Implementation Status)

### Menu Bar Layout (Current vs Planned)
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ [✅] File  [✅] Edit  [✅] View  [🔄] Tools  [🔄] Window  [🔄] Help              │
│                                                                                    │
│ Legend: ✅ Implemented | 🔄 Planned/Needs Enhancement | ❌ Missing                │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Menu Dropdown Structures

#### File Menu
```
┌─────────────────────────┐
│ 📄 New File         Ctrl+N │
│ 📁 New Folder            │
│ 💬 New Chat         Ctrl+T │
│ ├─────────────────────  │
│ 📂 Open File        Ctrl+O │
│ 📁 Open Folder           │
│ 📋 Open Recent           │ ➤ Recent Files/Projects
│ ├─────────────────────  │
│ 💾 Save             Ctrl+S │
│ 💾 Save As         Ctrl+Shift+S │
│ 💾 Save All        Ctrl+K S │
│ ├─────────────────────  │
│ 📤 Export Chat           │
│ 📥 Import Workflow       │
│ ├─────────────────────  │
│ ⚙️ Preferences      Ctrl+, │
│ ❌ Exit             Ctrl+Q │
└─────────────────────────┘
```

#### Edit Menu
```
┌─────────────────────────┐
│ ↩️ Undo             Ctrl+Z │
│ ↪️ Redo             Ctrl+Y │
│ ├─────────────────────  │
│ ✂️ Cut              Ctrl+X │
│ 📋 Copy             Ctrl+C │
│ 📋 Paste            Ctrl+V │
│ 🔍 Select All       Ctrl+A │
│ ├─────────────────────  │
│ 🔍 Find             Ctrl+F │
│ 🔍 Find & Replace   Ctrl+H │
│ 🔍 Find in Files    Ctrl+Shift+F │
│ ├─────────────────────  │
│ 📝 Format Document  Shift+Alt+F │
│ 🧹 Clear Chat            │
│ 🗑️ Delete Chat           │
└─────────────────────────┘
```

#### View Menu
```
┌─────────────────────────┐
│ 🎨 Appearance            │ ➤ Light/Dark/Auto
│ 🔍 Zoom In          Ctrl++ │
│ 🔍 Zoom Out         Ctrl+- │
│ 🔍 Reset Zoom       Ctrl+0 │
│ ├─────────────────────  │
│ 📁 Toggle Explorer  Ctrl+Shift+E │
│ 💬 Toggle Chat      Ctrl+Shift+C │
│ 🔍 Toggle Search    Ctrl+Shift+S │
│ 📊 Toggle Preview   Ctrl+Shift+V │
│ ├─────────────────────  │
│ 🧠 Subject Modes         │ ➤ Math/Science/Programming/Languages
│ 📋 Show TodoLists        │
│ 🔧 Show Workflows        │
│ ├─────────────────────  │
│ 📊 Command Palette  Ctrl+Shift+P │
│ 🔍 Quick Open       Ctrl+P │
└─────────────────────────┘
```

#### Tools Menu (NEW - From Prompt 10)
```
┌─────────────────────────┐
│ 🤖 Model Management      │
│ 🔧 MCP Servers           │
│ 🔄 Workflow Manager      │
│ ├─────────────────────  │
│ 📊 Performance Monitor  │
│ 🧪 Benchmark System     │
│ 📈 Analytics Dashboard  │
│ ├─────────────────────  │
│ 🎯 Subject Mode Switcher│ ➤ Quick mode switching
│ 🛠️ Tool Catalog         │
│ 📝 Context Manager      │
│ ├─────────────────────  │
│ 🧠 LLM Prompt Management│ ← NEW FROM PROMPT 10
│ 🛠️ Settings         Ctrl+, │
│ 🔧 Advanced Options     │
└─────────────────────────┘
```

### Toolbar Components
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ FILE OPERATIONS          │ EXECUTION           │ TOOLS & MODES                      │
│ [📁] [💾] [✂️] [📋]     │ [▶️] [⏸️] [⏹️]    │ [🔍] [⚙️] [📊] [🎯 Math] [💬 New] │
│ [↩️] [↪️]               │                    │                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Context-Sensitive Toolbar States
```typescript
interface ToolbarState {
  // File operations - always available
  fileOperations: {
    newFile: boolean;
    save: boolean;
    cut: boolean;
    copy: boolean;
    paste: boolean;
    undo: boolean;
    redo: boolean;
  };
  
  // Execution controls - context dependent
  execution: {
    run: boolean;        // Available when code/workflow selected
    pause: boolean;      // Available during execution
    stop: boolean;       // Available during execution
    debug: boolean;      // Available for debuggable content
  };
  
  // Tools and modes
  tools: {
    search: boolean;
    settings: boolean;
    analytics: boolean;
    subjectMode: string; // Current active mode
    newChat: boolean;
  };
  
  // Dynamic based on current context
  contextActions: ToolbarAction[];
}
```

### Chat History Management Interface
```
┌─────────────────────────────────────────────────────────────┐
│ 💬 CHAT HISTORY MANAGER                    [🔍] [📤] [⚙️] │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Search chats...]              [Filter ▼] [Sort ▼]      │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ TODAY                                                      │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 💬 Project Analysis Discussion        [⭐] [📋] [🗑️] │   │
│ │    Last: "Create the React dashboard components"     │   │
│ │    5 minutes ago • 23 messages • 🧠 Programming     │   │
│ │    Tags: react, dashboard, components                │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 💬 Math Problem Solving            [⭐] [📋] [🗑️]    │   │
│ │    Last: "Plot the function f(x) = sin(x) + cos(2x)" │   │
│ │    2 hours ago • 15 messages • 🧠 Mathematics        │   │
│ │    Tags: mathematics, plotting, trigonometry        │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ YESTERDAY                                                  │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 💬 Chemistry Equation Balancing    [⭐] [📋] [🗑️]    │   │
│ │    Last: "Balance this complex organic reaction"     │   │
│ │    1 day ago • 8 messages • 🧠 Science              │   │
│ │    Tags: chemistry, balancing, organic               │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ THIS WEEK                                                  │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 💬 Workflow Creation Session       [⭐] [📋] [🗑️]    │   │
│ │    Last: "Save this as a workflow template"          │   │
│ │    3 days ago • 31 messages • 🔧 Workflow           │   │
│ │    Tags: workflow, automation, template              │   │
│ │    💾 Saved as: "Code Review Workflow"               │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ARCHIVED (12 chats)                        [Show All]     │
│                                                            │
│ [➕ New Chat] [📁 Import] [🗑️ Bulk Delete] [📤 Export All] │
└─────────────────────────────────────────────────────────────┘
```

### Chat Actions Context Menu
```
┌─────────────────────────┐
│ 📂 Open Chat            │
│ 📝 Rename Chat          │
│ 🏷️ Edit Tags            │
│ ├─────────────────────  │
│ ⭐ Add to Favorites     │
│ 📁 Move to Folder       │
│ 🗂️ Duplicate Chat       │
│ ├─────────────────────  │
│ 💾 Save as Workflow     │
│ 📤 Export Chat          │
│ 🔗 Share Link           │
│ ├─────────────────────  │
│ 📦 Archive Chat         │
│ 🗑️ Delete Chat          │
└─────────────────────────┘
```

## 🔧 Workflow Management Interface

### Save Chat as Workflow Dialog
```
┌─────────────────────────────────────────────────────────────┐
│ 💾 SAVE CHAT AS WORKFLOW                         [✕ Close] │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ WORKFLOW DETAILS                                           │
│ Name *        [Project Analysis Workflow           ]       │
│ Description   [Analyzes project requirements and creates ] │
│               [development plan with task breakdown       ] │
│ Category      [Project Management            ▼]           │
│ Tags          [analysis, planning, development, react]     │
│                                                            │
│ CHAT SELECTION                                             │
│ ┌─ Start Message ──────────────────────────────────────┐   │
│ │ 💬 "I need to build a React dashboard with user mgmt" │   │
│ │    Today at 2:15 PM                                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌─ End Message ────────────────────────────────────────┐   │
│ │ 💬 "Perfect! The development plan looks comprehensive │   │
│ │    and the task breakdown is very detailed."         │   │
│ │    Today at 2:45 PM                                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                            │
│ [📊 Analyze Pattern] Messages: 23 | Tools Used: 3         │
│                                                            │
│ DETECTED VARIABLES                                         │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ✅ project_requirements (String)                     │   │
│ │    Example: "React dashboard with user management"   │   │
│ │                                                      │   │
│ │ ✅ project_path (String)                             │   │
│ │    Example: "./src"                                  │   │
│ │                                                      │   │
│ │ ⚪ technology_stack (Array)                          │   │
│ │    Example: ["React", "TypeScript", "Node.js"]      │   │ ← Optional
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ WORKFLOW PREVIEW                                           │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 1. Analyze requirements → analyze_requirements       │   │
│ │ 2. Identify project files → search_files            │   │
│ │ 3. Create development plan → generate_plan           │   │
│ │ 4. Break down into tasks → create_todolist          │   │
│ │                                                      │   │
│ │ Estimated execution time: 2-3 minutes               │   │
│ │ Success probability: 95%                             │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│                           [Cancel] [Preview] [Save Workflow] │
└─────────────────────────────────────────────────────────────┘
```

### Workflow Manager Interface  
```
┌─────────────────────────────────────────────────────────────┐
│ 🔧 WORKFLOW MANAGER                               [+ Create] │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Search workflows...]              [Category ▼] [Sort ▼] │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ MY WORKFLOWS                                               │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🏗️ Project Analysis                      [▶️ Run]    │   │
│ │    Analyzes requirements and creates development plan │   │
│ │    Variables: requirements, project_path              │   │
│ │    Last used: 2 days ago • Success rate: 95%         │   │
│ │    [✏️ Edit] [📋 Copy] [🗑️ Delete] [📤 Share]       │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🧪 Code Review                           [▶️ Run]    │   │
│ │    Reviews code changes and suggests improvements     │   │
│ │    Variables: file_path, review_type                  │   │
│ │    Last used: 1 week ago • Success rate: 87%         │   │
│ │    [✏️ Edit] [📋 Copy] [🗑️ Delete] [📤 Share]       │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 📊 Data Analysis Pipeline            [▶️ Run]        │   │
│ │    Processes CSV data and generates insights          │   │
│ │    Variables: data_path, analysis_type, output_format │   │
│ │    Last used: 3 days ago • Success rate: 92%         │   │
│ │    [✏️ Edit] [📋 Copy] [🗑️ Delete] [📤 Share]       │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ COMMUNITY TEMPLATES                                        │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 📊 ETL Pipeline Creator          [⭐ 4.8] [📥 Install] │   │
│ │    Creates data pipelines with validation and testing │   │
│ │    Downloads: 1.2k • Created by: @data-wizard        │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🎨 UI Component Generator        [⭐ 4.6] [📥 Install] │   │
│ │    Generates React components with TypeScript         │   │
│ │    Downloads: 890 • Created by: @react-master        │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ [📊 Analytics] [🔧 Settings] [📥 Import] [📤 Export All]  │
└─────────────────────────────────────────────────────────────┘
```

### Workflow Execution Dialog
```
┌─────────────────────────────────────────────────────────────┐
│ ▶️ EXECUTE WORKFLOW: Project Analysis               [✕ Close] │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ PARAMETERS                                                 │
│ Requirements * [Build a task management app with calendar ] │
│                [integration and team collaboration features] │
│                                                            │
│ Project Path * [./task-manager-app                        ] │
│                                                            │
│ Tech Stack     [React, TypeScript, Node.js, MongoDB       ] │
│                                                            │
│ ☑️ Preview mode (dry run)                                  │
│ ☑️ Save execution results                                  │
│ ☐ Auto-implement suggested changes                        │
│                                                            │
│ EXECUTION PLAN                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 1. ⏳ Analyze requirements                            │   │ ← In progress  
│ │ 2. ⏸️ Identify project structure                      │   │ ← Waiting
│ │ 3. ⏸️ Generate development plan                       │   │ ← Waiting
│ │ 4. ⏸️ Create detailed task breakdown                  │   │ ← Waiting
│ │                                                      │   │
│ │ Progress: ████░░░░░░ 25% (Step 1 of 4)              │   │
│ │ Estimated remaining: 2.5 minutes                    │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ LIVE OUTPUT                                                │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🔍 Analyzing requirements...                          │   │
│ │ ✅ Identified core features: task management, calendar│   │
│ │ ✅ Detected collaboration requirements               │   │
│ │ 🔍 Analyzing technical complexity...                 │   │
│ │ ⏳ Estimating development timeline...                 │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│                           [⏸️ Pause] [⏹️ Stop] [📊 Details] │
└─────────────────────────────────────────────────────────────┘
```

### Subject Mode Switcher
```
┌─────────────────────────────────────────────────────────────┐
│ 🧠 SUBJECT MODE SWITCHER                       [Current: 🎯] │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌─ 🎯 MATHEMATICS ──────────────────────────────────────┐   │ ← Active
│ │ Advanced problem-solving and computation              │   │
│ │ Tools: solve_equation, plot_function, calculus       │   │
│ │ Context: Optimized for mathematical reasoning         │   │
│ │                                    [✅ Active]        │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌─ 🔬 SCIENCE ──────────────────────────────────────────┐   │
│ │ Physics, chemistry, and biology assistance            │   │
│ │ Tools: chemistry_balance, physics_sim, molecular      │   │
│ │ Context: Optimized for scientific analysis            │   │
│ │                                    [🔄 Switch]        │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌─ 💻 PROGRAMMING ──────────────────────────────────────┐   │
│ │ Code analysis, testing, and development               │   │
│ │ Tools: analyze_code, generate_tests, debug           │   │
│ │ Context: Optimized for software development           │   │
│ │                                    [🔄 Switch]        │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌─ 🗣️ LANGUAGES ───────────────────────────────────────┐   │
│ │ Translation, grammar, and language learning           │   │
│ │ Tools: translate_text, grammar_check, pronunciation   │   │
│ │ Context: Optimized for language tasks                 │   │
│ │                                    [🔄 Switch]        │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌─ 📚 RESEARCH ─────────────────────────────────────────┐   │
│ │ Information gathering and analysis                     │   │
│ │ Tools: web_search, summarize, fact_check             │   │
│ │ Context: Optimized for research and information       │   │
│ │                                    [🔄 Switch]        │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                            │
│ [⚙️ Customize Modes] [💾 Save Preferences] [🔄 Auto Mode]  │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Layout Breakpoints
```typescript
interface LayoutBreakpoints {
  small: '< 1024px';     // Single column, collapsible sidebar
  medium: '1024-1440px'; // Two column, overlay preview
  large: '1440-1920px';  // Three column, side-by-side
  xlarge: '> 1920px';    // Three column, wider panels
}
```

## 📁 File Explorer Component

### Tree Structure with Enhanced Features
```
┌─────────────────────────┐
│ FILE EXPLORER           │ ← Header with context menu
├─────────────────────────┤
│ 🔍 [Search files...]   │ ← Fuzzy search input
├─────────────────────────┤
│ 📂 Current Project     │ ← Project selector dropdown
│   └─ 📁 src            │
│       ├─ 📁 components │ ← Collapsible folders
│       │   ├─ 📄 App.tsx│ ← File with hover actions
│       │   │   📝 📋 ❌  │ ← Quick actions: edit, copy, delete
│       │   └─ 📄 Header │
│       ├─ 📁 hooks      │
│       └─ 📄 index.ts   │
│   └─ 📁 public         │
│       └─ 📄 index.html │
├─────────────────────────┤
│ + New File  + New Dir  │ ← Quick creation buttons
└─────────────────────────┘
```

### File Explorer State Management
```typescript
interface FileExplorerState {
  currentProject: Project | null;
  expandedFolders: Set<string>;
  selectedFile: string | null;
  searchQuery: string;
  filteredFiles: FileNode[];
  watchedFiles: Set<string>;
  recentFiles: string[];
}

interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  size?: number;
  modified: Date;
  children?: FileNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
  hasChanges?: boolean;    // Unsaved changes indicator
  gitStatus?: 'modified' | 'added' | 'deleted' | 'untracked';
}
```

### File Context Menu
```
┌─────────────────────┐
│ 📂 Open in Editor   │
│ 👁️ Quick View       │
│ ├─────────────────  │
│ 📝 Rename           │
│ 📋 Copy Path        │
│ 🔗 Copy Relative    │
│ ├─────────────────  │
│ 📁 Reveal in Finder │
│ 💻 Open in Terminal │
│ ├─────────────────  │
│ 🗑️ Delete           │
└─────────────────────┘
```

## 💬 Chat Interface Component (Enhanced for Prompt 9)

### Main Chat Layout with Workflow Features
```
┌───────────────────────────────────────────────────────────────┐
│ CHAT HEADER                                                   │
│ 🤖 TanukiMCP Atlas    [llama3.2:3b ▼]    🔄 🧹 ⚙️ 💾       │
│                                              [Save Workflow] ← NEW
├───────────────────────────────────────────────────────────────┤
│                     MESSAGES AREA                             │
│                   (Scrollable)                                │
│                                                               │
│ ┌─ USER MESSAGE ─────────────────────────────────────────┐   │
│ │ Create a React dashboard with charts and user mgmt    │   │
│ │                                  [💾 Save as Workflow] │ ← NEW
│ │                                          [12:34 PM] ◀ │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                               │
│ ┌─ ASSISTANT MESSAGE ────────────────────────────────────┐   │
│ │ 🤖 I'll help you create a React dashboard. Let me     │   │
│ │    break this down into manageable tasks:             │   │
│ │                                                       │   │
│ │ 📋 TODOLIST: React Dashboard                          │   │
│ │ ✅ 1. Project setup and dependencies                  │   │
│ │ ⏳ 2. Create main dashboard layout                     │   │
│ │ ⏸️ 3. Implement chart components                       │   │
│ │ ⏸️ 4. Add user management features                     │   │
│ │ ⏸️ 5. Connect to data sources                          │   │
│ │                                                       │   │
│ │ 🛠️ TOOLS USED: create_todolist, initialize_project   │   │
│ │                                          [12:35 PM] ◀ │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│ INPUT AREA                                                    │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ @[Tool suggestions]                                     │   │ ← @ symbol dropdown
│ │ Type your message here...                               │   │
│ │                                          [📎] [🎯] [▶]│   │
│ └─────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### Message Component Types
```typescript
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

interface MessageMetadata {
  toolsUsed?: string[];
  executionTime?: number;
  tokenCount?: number;
  model?: string;
  todolist?: TodoList;
  fileChanges?: FileChange[];
  errors?: Error[];
}

// Specialized message components
interface TodoListMessage extends ChatMessage {
  type: 'assistant';
  todolist: TodoList;
  progressPercentage: number;
}

interface CodeGenerationMessage extends ChatMessage {
  type: 'assistant';
  codeBlocks: CodeBlock[];
  language: string;
  isStreaming: boolean;
}

interface ToolExecutionMessage extends ChatMessage {
  type: 'tool';
  toolName: string;
  parameters: Record<string, any>;
  result: ToolResult;
  status: 'running' | 'completed' | 'error';
}
```

### @ Symbol Tool Selector with Workflow Integration
```
┌─────────────────────────────────────────────────────────────┐
│ @ TOOL SELECTOR                                      [ESC] │ ← Floating overlay
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Search tools and workflows...]                         │ ← Unified search
├─────────────────────────────────────────────────────────────┤
│ 📁 FILE OPERATIONS                                         │ ← Categorized sections
│   📄 read_file        Read file contents with pagination   │
│   ✏️ write_file       Write or append to files            │
│   🔍 search_files     Find files by name patterns         │
│                                                            │
│ 💻 CODE OPERATIONS                                         │
│   🔎 search_code      Search code using ripgrep           │ ← Highlighted selection
│   ✂️ edit_block       Make surgical code edits            │ ← Arrow key navigation
│   🔧 analyze_code     Analyze code structure              │
│                                                            │
│ 📋 TASK MANAGEMENT                                         │
│   📝 create_todolist  Break down complex requests         │
│   ▶️ execute_task     Implement specific tasks            │
│   ✅ mark_complete    Mark tasks as finished              │
│                                                            │
│ 🔧 CUSTOM WORKFLOWS (NEW from Prompt 9)                   │
│   ⚡ Project Analysis   Quick project setup & planning    │
│   🧪 Code Review       Automated code review process     │
│   📊 Data Pipeline     ETL data processing workflow      │
│                                                            │
│ 🌐 WEB & RESEARCH                                          │
│   🔍 web_search       Search the internet                 │
│   📰 scrape_content   Extract webpage content             │
│                                                            │
│ ⭐ RECENTLY USED                                           │
│   create_todolist, read_file, Project Analysis            │
└─────────────────────────────────────────────────────────────┘
```

### Tool Parameter Input
```typescript
interface ToolParameterInput {
  toolName: string;
  parameters: ParameterDefinition[];
  currentValues: Record<string, any>;
  onParameterChange: (name: string, value: any) => void;
  onExecute: () => void;
  onCancel: () => void;
}

// Example: Parameter input for read_file tool
┌─────────────────────────────────────────────────────────────┐
│ 📄 READ_FILE PARAMETERS                                     │
├─────────────────────────────────────────────────────────────┤
│ Path *       [src/components/App.tsx              ] [📁]    │ ← File picker
│ Offset       [0                                  ]          │ ← Number input
│ Length       [1000                               ]          │ ← Optional field
│ Encoding     [utf8                    ▼]                   │ ← Dropdown
│                                                            │
│ ℹ️ This will read the specified file with optional         │ ← Help text
│    pagination support for large files.                     │
│                                                            │
│                                      [Cancel] [Execute]    │ ← Action buttons
└─────────────────────────────────────────────────────────────┘
```

## 📊 TodoList Visualization Component

### Interactive TodoList Display
```
┌─────────────────────────────────────────────────────────────┐
│ 📋 TODOLIST: React Dashboard Project                       │ ← Collapsible header
│    Progress: ████████░░ 80% (4/5 tasks completed)         │ ← Progress bar
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ ## Phase 1: Project Setup                                 │ ← Phase grouping
│ ✅ 1. Initialize React project with TypeScript            │ ← Completed task
│      ✓ Created package.json, tsconfig.json                │ ← Sub-tasks
│      ✓ Installed dependencies (React, TypeScript, etc.)   │
│      📁 Files: package.json, tsconfig.json, src/index.tsx │ ← Related files
│                                                            │
│ ✅ 2. Set up project structure and routing                │
│      ✓ Created src/components, src/pages directories      │
│      ✓ Configured React Router                            │
│      📁 Files: src/App.tsx, src/router.tsx               │
│                                                            │
│ ## Phase 2: Dashboard Development                         │
│ ⏳ 3. Create main dashboard layout component               │ ← Current task
│      ⏳ Design responsive grid layout                      │ ← In progress
│      ⏸️ Add navigation sidebar                            │ ← Blocked/waiting
│      ⏸️ Implement header with user menu                   │
│      🎯 Estimated: 45 minutes remaining                   │ ← Time estimate
│                                                            │
│ ⏸️ 4. Implement chart components using Chart.js           │ ← Future task
│      Dependencies: Task 3 must be completed first        │ ← Dependencies
│                                                            │
│ ⏸️ 5. Add user management interface                        │
│                                                            │
│                                      [▶️ Continue] [✏️ Edit] │ ← Action buttons
└─────────────────────────────────────────────────────────────┘
```

### TodoList State Management
```typescript
interface TodoListState {
  id: string;
  title: string;
  description: string;
  phases: TodoPhase[];
  overallProgress: number;
  estimatedTimeRemaining: number;
  currentTask: string | null;
  metadata: {
    created: Date;
    updated: Date;
    projectPath: string;
    relatedFiles: string[];
  };
}

interface TodoPhase {
  id: string;
  title: string;
  description: string;
  tasks: TodoTask[];
  isCollapsed: boolean;
  progress: number;
}

interface TodoTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number;
  actualTime?: number;
  dependencies: string[];
  subtasks: TodoSubtask[];
  relatedFiles: string[];
  notes: string[];
  assignedTools: string[];
}
```

## 🔄 Visual Diff Component

### Side-by-Side Code Diff
```
┌─────────────────────────────────────────────────────────────┐
│ 📄 src/components/App.tsx                    [Save] [Revert]│ ← File header
├─────────────────────────────────────────────────────────────┤
│  BEFORE                    │  AFTER                         │ ← Split view
├────────────────────────────┼────────────────────────────────┤
│ 1  import React from 'react'│ 1  import React from 'react'   │
│ 2  import './App.css';     │ 2  import './App.css';        │
│ 3                          │ 3  import Dashboard from './components/Dashboard';│ ← Added line
│ 4  function App() {        │ 4                              │
│ 5    return (              │ 5  function App() {            │
│ 6      <div className="App">│ 6    return (                  │
│ 7        <h1>Hello World</h1>│ 7      <div className="App">   │
│ 8      </div>              │ 8        <Dashboard />         │ ← Modified line  
│ 9    );                    │ 9      </div>                  │
│10  }                       │10    );                        │
│11                          │11  }                           │
│12  export default App;     │12                              │
│                            │13  export default App;         │
├────────────────────────────┴────────────────────────────────┤
│ 📊 Changes: +2 lines, -1 line, ~1 modified                 │ ← Change summary
│ 🛠️ Applied by: edit_block tool                              │ ← Tool attribution
└─────────────────────────────────────────────────────────────┘
```

### Inline Diff with Character-Level Changes
```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Inline View                              [Split] [Unified]│
├─────────────────────────────────────────────────────────────┤
│ 1  import React from 'react';                               │
│ 2  import './App.css';                                      │
│ 3+ import Dashboard from './components/Dashboard';          │ ← Added (green bg)
│ 4                                                           │
│ 5  function App() {                                         │
│ 6    return (                                               │
│ 7      <div className="App">                                │
│ 8-       <h1>Hello World</h1>                               │ ← Removed (red bg)
│ 8+       <Dashboard />                                      │ ← Added (green bg)
│ 9      </div>                                               │
│10    );                                                     │
│11  }                                                        │
│12                                                           │
│13  export default App;                                      │
├─────────────────────────────────────────────────────────────┤
│ Character-level diff:                                       │
│ Line 8: <{-h1>Hello World</h1-}{+Dashboard /+}>            │ ← Precise changes
└─────────────────────────────────────────────────────────────┘
```

## ⚙️ Settings & Configuration Panel

### Model Management Interface
```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 MODEL MANAGEMENT                                         │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ INSTALLED MODELS                                           │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🦙 llama3.2:3b                            [✅ Active] │   │ ← Currently active
│ │    Size: 1.8GB • Speed: 45 tok/s • RAM: 4GB         │   │ ← Performance info
│ │    Specialization: General purpose, coding          │   │
│ │    [🗑️ Remove] [⚙️ Configure] [📊 Statistics]      │   │ ← Actions
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🎯 codellama:13b                          [Select]   │   │ ← Available option
│ │    Size: 7.3GB • Speed: 28 tok/s • RAM: 16GB        │   │
│ │    Specialization: Code generation, debugging       │   │
│ │    [🗑️ Remove] [⚙️ Configure] [📊 Statistics]      │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ AVAILABLE FOR DOWNLOAD                                     │ ← Browse available models
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🧠 llama3.3:70b                         [📥 Install] │   │
│ │    Size: 39GB • Estimated Speed: 12 tok/s           │   │
│ │    Specialization: Advanced reasoning, research     │   │
│ │    ⚠️ Requires 64GB+ RAM for optimal performance     │   │ ← Requirements warning
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 📊 mistral-nemo:12b                     [📥 Install] │   │
│ │    Size: 6.8GB • Estimated Speed: 32 tok/s          │   │
│ │    Specialization: Multilingual, function calling   │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ [🔄 Refresh Available] [📂 Import Model] [🔧 Advanced]    │ ← Additional actions
└─────────────────────────────────────────────────────────────┘
```

### Local Model Recommendations
```
┌─────────────────────────────────────────────────────────────┐
│ 💡 MODEL RECOMMENDATIONS (Based on Your Hardware)           │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ 🖥️ Your System: 16GB RAM • 8-core CPU • RTX 4060 GPU     │
│                                                            │
│ RECOMMENDED FOR YOU                                        │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🌟 llama3.2:7b (Recommended)         [📥 Install]    │   │
│ │    Size: 4.1GB • Speed: ~35 tok/s • Perfect fit!     │   │
│ │    Specialization: General purpose, coding, reasoning │   │
│ │    ✅ Excellent performance on your hardware          │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ALTERNATIVE OPTIONS                                        │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🏃 llama3.2:3b (Lightweight)         [📥 Install]    │   │
│ │    Size: 1.8GB • Speed: ~55 tok/s • Fastest option   │   │
│ │    Best for: Quick responses, basic coding tasks      │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ⚠️ codellama:13b (May be slow)        [📥 Install]    │   │
│ │    Size: 7.3GB • Speed: ~18 tok/s • Heavy model      │   │
│ │    Warning: May use significant RAM (12GB+)          │   │
│ │    Best for: Complex code generation when time allows │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ 📊 Performance Prediction                                  │
│ • Based on your hardware benchmarks and user reports      │
│ • Estimates include overhead for IDE operations           │
│ • GPU acceleration: Available for supported models        │
│                                                            │
│ [🔄 Refresh Recommendations] [🧪 Benchmark System]        │
└─────────────────────────────────────────────────────────────┘
```

### Tool Configuration Interface
```
┌─────────────────────────────────────────────────────────────┐
│ 🛠️ TOOL CONFIGURATION                                       │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ CORE TOOLS (Built-in)                                     │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ✅ File Operations                        [Configure] │   │
│ │    read_file, write_file, search_files               │   │
│ │    Max file size: 10MB • Cache: Enabled              │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ✅ Task Management                        [Configure] │   │
│ │    create_todolist, execute_task, track_progress     │   │
│ │    Auto-save todolists: Yes • Backup: Daily          │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ MCP SERVERS (External)                                    │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🌐 Desktop Commander                      [✅ Active] │   │ ← External MCP server
│ │    Status: Connected • Tools: 15 available           │   │
│ │    Endpoint: stdio • Health: Good                    │   │
│ │    [⚙️ Configure] [📊 Monitor] [🔄 Restart]          │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 📊 Analytics Server                       [❌ Error] │   │ ← Failed connection
│ │    Status: Connection failed • Last seen: 2h ago     │   │
│ │    Error: ECONNREFUSED localhost:8080                │   │
│ │    [🔧 Fix] [🗑️ Remove] [📋 View Logs]              │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ [➕ Add MCP Server] [📂 Import Config] [💾 Export Config] │
│                                                            │
│ TOOL EXECUTION SETTINGS                                    │
│ Concurrent tool limit: [3    ] tools                     │
│ Execution timeout: [30  ] seconds                        │
│ ☑️ Enable tool result caching                             │
│ ☑️ Show tool execution progress                           │
│ ☐ Require confirmation for destructive operations        │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Status Bar Component

### Comprehensive Status Information
```
┌─────────────────────────────────────────────────────────────┐
│ STATUS BAR                                                  │
├─────────────────────────────────────────────────────────────┤
│ 🟢 Connected | 🎯 Current Mode | 💾 Ready | 📊 Stats | [✅ IMPLEMENTED]          │
└─────────────────────────────────────────────────────────────┘
```

### Status Indicator Details
```typescript
interface StatusBarState {
  // Connection status
  ollamaStatus: 'connected' | 'disconnected' | 'error';
  ollamaEndpoint: string;
  
  // Active model
  currentModel: string;
  modelPerformance: {
    avgResponseTime: number;
    tokensPerSecond: number;
    successRate: number;
  };
  
  // Tool system
  availableTools: number;
  activeTools: number;
  toolErrors: number;
  
  // System resources
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  
  // Application state
  autoSaveEnabled: boolean;
  lastSaveTime: Date;
  unsavedChanges: number;
  
  // Current operation
  currentOperation?: {
    type: 'tool_execution' | 'model_response' | 'file_operation';
    description: string;
    progress: number;
  };
}
```

## 📱 Responsive Design Patterns

### Mobile/Tablet Layout (< 1024px)
```
┌─────────────────────────────────┐
│ ☰ MENU                    ⚙️ ✕ │ ← Hamburger menu
├─────────────────────────────────┤
│                                 │
│        CHAT INTERFACE           │ ← Full width
│          (Primary)              │
│                                 │
├─────────────────────────────────┤
│ [📁] [💬] [🛠️] [⚙️] [📊]      │ ← Bottom navigation
└─────────────────────────────────┘

// Collapsible sidebar overlay
┌─────────────────────────────────┐
│ 📁 FILES          [✕ Close]    │ ← Overlay sidebar
├─────────────────────────────────┤
│ 🔍 [Search...]                 │
│                                 │
│ 📂 Current Project              │
│   └─ 📁 src                     │
│       ├─ 📄 App.tsx             │
│       └─ 📄 index.ts            │
│                                 │
│ [+ New File] [+ New Dir]        │
│                                 │
│ ████████████████████████████████│ ← Backdrop
│ ████████████████████████████████│
│ ████████████████████████████████│
└─────────────────────────────────┘
```

### Desktop Layout Variations
```typescript
interface LayoutConfiguration {
  // Three-panel layout (default for large screens)
  threePanelLayout: {
    fileExplorer: { width: 280, minWidth: 200, maxWidth: 400 };
    chatInterface: { flex: 1, minWidth: 600 };
    previewPanel: { width: 350, minWidth: 300, maxWidth: 500 };
  };
  
  // Two-panel layout (medium screens)
  twoPanelLayout: {
    fileExplorer: { width: 260, collapsible: true };
    chatInterface: { flex: 1 };
    previewPanel: { overlay: true, width: 400 };
  };
  
  // Single-panel layout (small screens)
  singlePanelLayout: {
    activePanel: 'chat' | 'files' | 'preview';
    bottomNavigation: true;
    sidebarOverlay: true;
  };
}
```

## 🎨 Design System Specifications

### Color Palette
```css
:root {
  /* Light Theme */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-text-primary: #1e293b;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;
  
  /* Dark Theme */
  --color-bg-primary-dark: #0f172a;
  --color-bg-secondary-dark: #1e293b;
  --color-bg-tertiary-dark: #334155;
  --color-text-primary-dark: #f8fafc;
  --color-text-secondary-dark: #cbd5e1;
  --color-text-muted-dark: #94a3b8;
  
  /* Accent Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;
  
  /* Tool Status Colors */
  --color-tool-active: #10b981;
  --color-tool-pending: #f59e0b;
  --color-tool-error: #ef4444;
  --color-tool-disabled: #6b7280;
}
```

### Typography Scale
```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Component States & Animations
```css
/* Button States */
.btn {
  transition: all 150ms ease-in-out;
  transform: translateZ(0); /* Hardware acceleration */
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
  transition-duration: 75ms;
}

/* Loading States */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes typing {
  0%, 60%, 100% { content: ''; }
  20% { content: '.'; }
  40% { content: '..'; }
  80% { content: '...'; }
}

/* Tool Execution Animation */
@keyframes tool-glow {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

/* Code Generation Typewriter Effect */
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

.code-generation {
  overflow: hidden;
  border-right: 2px solid var(--color-primary);
  animation: typewriter 2s steps(40) 1s both,
             blink 0.5s step-end infinite alternate;
}
```

## 🎛️ Enhanced Settings Integration

### Settings Tab Structure (Updated with Prompt 10)
```
┌─────────────────────────────────────────────────────────────┐
│ ⚙️ SETTINGS & CONFIGURATION                                 │
├─────────────────────────────────────────────────────────────┤
│ TABS:                                                       │
│ [🤖 Models] [🔧 Tools] [🎨 Appearance] [🧠 LLM Prompts*]   │
│                                           ↑ NEW FROM PROMPT 10
│                                                            │
│ 🧠 LLM PROMPTS TAB (NEW):                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🎯 Quick Actions:                                       │ │
│ │ [🔧 Open Prompt Manager] [📊 Validation Report]        │ │
│ │ [🧪 Test All Prompts] [📦 Export All Modified]         │ │
│ │                                                         │ │
│ │ 📋 Summary:                                             │ │
│ │ • Total Prompts: 43                                     │ │
│ │ • Modified: 7                                           │ │
│ │ • Default: 36                                           │ │
│ │ • Last Modified: 2 hours ago                            │ │
│ │                                                         │ │
│ │ 🚨 Validation Issues: 0                                │ │
│ │ ✅ All prompts are valid and functional                │ │
│ │                                                         │ │
│ │ 🎯 Quick Actions:                                       │ │
│ │ [🔧 Open Prompt Manager] [📊 Validation Report]        │ │
│ │ [🧪 Test All Prompts] [📦 Export All Modified]         │ │
│ │                                                         │ │
│ │ 📋 Summary:                                             │ │
│ │ • Total Prompts: 43                                     │ │
│ │ • Modified: 7                                           │ │
│ │ • Default: 36                                           │ │
│ │ • Last Modified: 2 hours ago                            │ │
│ │                                                         │ │
│ │ 🚨 Validation Issues: 0                                │ │
│ │ ✅ All prompts are valid and functional                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Updated Component Implementation Status

### Current Implementation Matrix
```typescript
interface ComponentStatus {
  // ✅ Fully Implemented
  implemented: {
    'IDELayout': 'Complete with panel management',
    'MenuBar': 'Basic File/Edit/View menus',
    'StatusBar': 'Connection status and mode display',
    'ChatInterface': 'Basic message input with @ detection',
    'FileExplorer': 'Simple file tree display',
    'SubjectModeSwitcher': 'Mode selection UI',
    'ManagementCenterModal': 'Phase 8 integration modal'
  };
  
  // 🔄 Partially Implemented (Needs Enhancement)
  partiallyImplemented: {
    'ChatHistoryManager': 'Structure exists, needs full CRUD',
    'WorkflowManager': 'Placeholder component',
    'ToolSelector': 'Basic @ symbol detection',
    'PanelManager': 'Basic layout, needs responsive design'
  };
  
  // ❌ Not Yet Implemented (From Prompts 9 & 10)
  notImplemented: {
    'IntelligentWorkflowGenerator': 'Prompt 9 - Full LLM-based workflow creation',
    'WorkflowPreviewEditor': 'Prompt 9 - ASCII art editing interface',
    'WorkflowRefinementChat': 'Prompt 9 - LLM Agent 2 interaction',
    'LLMPromptManagementUI': 'Prompt 10 - Complete prompt editing system',
    'PromptDiscoveryService': 'Prompt 10 - Dynamic prompt loading',
    'DynamicPromptLoader': 'Prompt 10 - Runtime prompt switching'
  };
}
```

## 🎯 Priority Implementation Roadmap

### Phase 9 Implementation (Prompt 9):
1. **LLM Agent Integration**: Implement 3 specialized agents
2. **Workflow Preview UI**: ASCII art visualization with editing
3. **Template System**: Locked workflow template file
4. **@ Symbol Integration**: Add custom workflows to tool selector

### Phase 10 Implementation (Prompt 10):  
1. **Prompt Registry**: Centralized prompt storage system
2. **UI Implementation**: Three-pane prompt management interface
3. **Dynamic Loading**: Runtime prompt switching for all agents
4. **Menu Integration**: Add LLM Prompts tab to Tools menu

### Integration Points:
- Both features integrate into existing IDE layout
- Both add new menu items and UI tabs
- Both require backend service implementations
- Both enhance the @ symbol tool selector

This comprehensive wireframe update reflects the current implementation state and provides clear guidance for implementing the new features from Prompts 9 & 10.

## 🔧 NEW: Intelligent Workflow Generation UI (Prompt 9)

### Save Custom Workflow Dialog (NEW FEATURE)
```
┌─────────────────────────────────────────────────────────────┐
│ 💾 INTELLIGENT WORKFLOW GENERATOR                 [✕ Close] │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ STEP 1: LLM ANALYSIS & VISUALIZATION                      │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🧠 Analyzing chat conversation...                    │   │
│ │ ✅ Identified 5 main steps                           │   │
│ │ ✅ Detected tools: file operations, task management  │   │
│ │ ✅ Generated workflow structure                      │   │
│ │ ⏳ Creating ASCII visualization...                   │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ WORKFLOW PREVIEW & EDITING (4/5 Layout)                   │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ ASCII WORKFLOW VISUALIZATION (Editable)               │ │
│ │ ┌────────────────────────────────────────────────┐   │ │
│ │ │ ┌─────────────────────────────────────────┐     │   │ │
│ │ │ │ 📄 USER REQUEST ENTRY POINT             │     │   │ │
│ │ │ │              ↓                          │     │   │ │
│ │ │ │ ┌─────────────────────────────────────┐ │     │   │ │
│ │ │ │ │ 🔍 ANALYZE REQUIREMENTS            │ │     │   │ │
│ │ │ │ │ • Parse user input                 │ │     │   │ │
│ │ │ │ │ • Identify key features            │ │     │   │ │
│ │ │ │ └─────────────────────────────────────┘ │     │   │ │
│ │ │ │              ↓                          │     │   │ │
│ │ │ │ ┌─────────────────────────────────────┐ │     │   │ │
│ │ │ │ │ 📁 SETUP PROJECT STRUCTURE         │ │     │   │ │
│ │ │ │ │ • Create directories               │ │     │   │ │
│ │ │ │ │ • Initialize configuration         │ │     │   │ │
│ │ │ │ └─────────────────────────────────────┘ │     │   │ │
│ │ │ └─────────────────────────────────────────┘     │   │ │
│ │ └────────────────────────────────────────────────┘   │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ REFINEMENT CHAT (1/5 Layout)                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 💬 Chat with LLM Agent 2 for refinements:             │ │
│ │ [Type refinement requests here...]                     │ │
│ │                                           [Send]       │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ CONTROLS                                                   │
│ [🔄 Regenerate] [📝 Direct Edit Mode] [💾 Save Workflow]  │
└─────────────────────────────────────────────────────────────┘
```

### Workflow Template Processing (Hidden LLM Agent 3)
```typescript
// NEW: Locked Workflow Template File (src/core/workflow-template.schema.json)
interface WorkflowTemplate {
  workflowId: string;
  name: string;
  description: string;
  triggerPhrase?: string;
  tags: string[];
  version: string;
  createdAt: Date;
  updatedAt: Date;
  steps: WorkflowStep[];
  parameters: WorkflowParameter[];
}

interface WorkflowStep {
  stepId: string;
  name: string;
  description: string;
  toolCalls: ToolCall[];
  inputs: string[];
  outputs: string[];
  onSuccess: string | 'end';
  onError: string | 'abort';
  visualization?: string;
}
```

## 🧠 NEW: LLM System Prompt Management UI (Prompt 10)

### LLM Prompt Management Tab (NEW FEATURE)
```
┌─────────────────────────────────────────────────────────────┐
│ 🧠 LLM SYSTEM PROMPT MANAGEMENT                            │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌─────────────────┬───────────────────────┬─────────────────┐ │
│ │ PROMPT LIST     │ PROMPT EDITOR         │ METADATA & HELP│ │
│ │ (Searchable)    │ (Monaco Editor)       │ (Context Info)  │ │
│ │                 │                       │                 │ │
│ │ 🔍 [Search...]  │ ┌─────────────────────┐ │ 📋 PROMPT INFO │ │
│ │                 │ │ You are a skilled   │ │ ID: routing.    │ │
│ │ 📂 LLM ROUTING  │ │ complexity assessor │ │ complexity_     │ │
│ │ ├─ 🎯 Complexity│ │ responsible for...  │ │ assessor.v1     │ │
│ │ │   Assessor*   │ │                     │ │                 │ │
│ │ ├─ 🔀 Request   │ │ Your task is to:    │ │ 📖 PURPOSE:     │ │
│ │ │   Classifier  │ │ 1. Analyze the user │ │ Analyzes user   │ │
│ │ └─ 🎲 Route     │ │    request          │ │ requests to     │ │
│ │     Selector    │ │ 2. Assess complexity│ │ determine       │ │
│ │                 │ │ 3. Return score 1-10│ │ processing      │ │
│ │ 📂 WORKFLOW GEN │ │                     │ │ complexity      │ │
│ │ ├─ ⚡Agent 1    │ │ Always respond with │ │                 │ │
│ │ │   Synthesizer*│ │ valid JSON format:  │ │ {{user_query}}  │ │
│ │ ├─ 🎨 Agent 2   │ │ {                   │ │ {{context}}     │ │
│ │ │   Refinement  │ │   "complexity": N,  │ │                 │ │
│ │ └─ 📋 Agent 3   │ │   "reasoning": "X"  │ │                 │ │
│ │     Templater   │ │ }                   │ │ 📚 GUIDANCE:    │ │
│ │                 │ │                     │ │ • Keep prompt   │ │
│ │ 📂 CHAT SYSTEM  │ │ [Rest of prompt...] │ │   focused       │ │
│ │ ├─ 💬 Message   │ │                     │ │ • Use examples  │ │
│ │ │   Formatter   │ └─────────────────────┘ │ • Test changes  │ │
│ │ └─ 🔄 Response  │                       │                 │ │
│ │     Generator   │ CONTROLS:             │ 📜 DEFAULT:     │ │
│ │                 │ [💾 Save] [🔄 Reset]  │ [View Original] │ │
│ └─────────────────┤ [📤 Export] [📥 Import] ├─────────────────┤ │
│ * = Modified      │                       │                 │ │
│                   │                       │                 │ │
│ GLOBAL CONTROLS:  │                       │                 │ │
│ [🔄 Reset All] [📦 Export All] [📁 Import All]              │ │
│ [📊 Validation Report] [🧪 Test Prompts]                    │ │
└─────────────────────────────────────────────────────────────┘
```

### Prompt Categories and Coverage (Comprehensive)
```
📂 PROMPT CATEGORIES (All LLM Agents):
├─ 🎯 LLM ROUTING LAYER
│  ├─ Request Type Classifier
│  ├─ Complexity Assessor  
│  └─ Route Selection Logic
├─ ⚙️ TASK PROCESSORS
│  ├─ Atomic Processor (Quick Analysis, Direct Execution, Rapid Response)
│  ├─ Moderate Processor (Planning Engine, Sequential Executor)
│  └─ Complex Processor (Advanced Planning, Context Gathering)
├─ 🔧 WORKFLOW GENERATION (NEW from Prompt 9)
│  ├─ Agent 1: Workflow Synthesizer & Visualizer
│  ├─ Agent 2: Workflow Refinement
│  └─ Agent 3: Workflow Finalizer & Templater (Hidden)
├─ 🏆 AI AGENT COUNCIL
│  ├─ Enhancement Agents (4 specializations)
│  ├─ Voting/Judge Agents (10 judges)
│  └─ Expert Panel Reviewers
├─ ⚡ EXECUTION ENGINE
│  ├─ Task Sequencer (Hidden LLM Task Coordinator)
│  └─ Iterative Execution Engine (Hidden LLM Executor)
├─ 💬 COMMUNICATION
│  ├─ Communication Excellence Layer (Hidden LLM Communicator)
│  ├─ Actionable Suggestions System
│  └─ Early Stopping Mechanism
├─ 🔄 HYBRID MODE MANAGEMENT
│  ├─ Hybrid Mode Controller (Master Mode Orchestrator)
│  └─ Adaptive Complexity Assessment
├─ 🛡️ FAILURE RECOVERY
│  ├─ Failure Detection LLM Agents
│  └─ Recovery Strategy Selection
└─ 🛠️ CHAT & UI HELPERS
   ├─ Message Formatters
   ├─ Context Managers
   └─ User Interface Assistants
```

## 🔄 Enhanced @ Symbol Tool Selector (Updated)

### @ Tool Selector with Workflow Integration
```
┌─────────────────────────────────────────────────────────────┐
│ @ TOOL SELECTOR                                      [ESC] │ ← Floating overlay
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Search tools and workflows...]                         │ ← Unified search
├─────────────────────────────────────────────────────────────┤
│ 📁 FILE OPERATIONS                                         │ ← Categorized sections
│   📄 read_file        Read file contents with pagination   │
│   ✏️ write_file       Write or append to files            │
│   🔍 search_files     Find files by name patterns         │
│                                                            │
│ 💻 CODE OPERATIONS                                         │
│   🔎 search_code      Search code using ripgrep           │ ← Highlighted selection
│   ✂️ edit_block       Make surgical code edits            │ ← Arrow key navigation
│   🔧 analyze_code     Analyze code structure              │
│                                                            │
│ 📋 TASK MANAGEMENT                                         │
│   📝 create_todolist  Break down complex requests         │
│   ▶️ execute_task     Implement specific tasks            │
│   ✅ mark_complete    Mark tasks as finished              │
│                                                            │
│ 🔧 CUSTOM WORKFLOWS (NEW from Prompt 9)                   │
│   ⚡ Project Analysis   Quick project setup & planning    │
│   🧪 Code Review       Automated code review process     │
│   📊 Data Pipeline     ETL data processing workflow      │
│                                                            │
│ 🌐 WEB & RESEARCH                                          │
│   🔍 web_search       Search the internet                 │
│   📰 scrape_content   Extract webpage content             │
│                                                            │
│ ⭐ RECENTLY USED                                           │
│   create_todolist, read_file, Project Analysis            │
└─────────────────────────────────────────────────────────────┘
```