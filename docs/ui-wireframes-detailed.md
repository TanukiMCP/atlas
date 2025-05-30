# TanukiMCP: Atlas - Modern UI Architecture (shadcn/ui + Tailwind)

## 🎨 Application Layout Architecture (shadcn/ui Implementation)

### Design System Foundation
**Framework Stack:**
- **shadcn/ui**: Beautiful, accessible components built on Radix UI
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Radix UI**: Accessible component primitives
- **Typography**: Open Sans (matching tanukimcp.com)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Layout**: ResizablePanelGroup for IDE panels

### Main Window Structure (Professional IDE Layout)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ NAVIGATION MENU BAR (shadcn/ui NavigationMenu) - 48px height                      │
│ 🦝 TanukiMCP Atlas    File  Edit  View  Tools  Window  Help         🌙 ⚙️ ⊞ ✕ │
├────────────────────────────────────────────────────────────────────────────────────┤
│                     RESIZABLE PANEL GROUP (shadcn/ui)                             │
├──────────────────────┬─────────────────────────────┬──────────────────────────────┤
│     SIDEBAR PANEL    │       MAIN CONTENT PANEL    │    SECONDARY PANEL           │
│    (280px, resizable)│      (Flexible, min 400px)  │   (350px, optional)          │
│                      │                             │                              │
│  ┌─ FILE EXPLORER ─┐ │  ┌─ TABS COMPONENT ──────┐  │ ┌─ CONTEXT PANEL ────────┐  │
│  │ (shadcn/ui Tree) │ │  │ (shadcn/ui Tabs)     │  │ │ • Workflow Manager     │  │
│  │ 📁 Projects      │ │  │ [💬 Chat] [📝 Code]  │  │ │ • Settings Panel       │  │
│  │ 📁 Workflows     │ │  │                      │  │ │ • Preview Panel        │  │
│  │ 📁 Tools         │ │  │ ┌─ CHAT INTERFACE ─┐ │  │ │ • Analytics Dashboard  │  │
│  │                  │ │  │ │ (shadcn/ui)      │ │  │ │ (Contextual)           │  │
│  ├─ SUBJECT MODES ─┤ │  │ │ Message bubbles  │ │  │ └────────────────────────┘  │
│  │ (shadcn/ui       │ │  │ │ with typing      │ │  │                              │
│  │ ToggleGroup)     │ │  │ │ indicators       │ │  │                              │
│  │ 🧠 Math          │ │  │ │                  │ │  │                              │
│  │ 💻 Code          │ │  │ │ @ Tool Selector  │ │  │                              │
│  │ 🔬 Science       │ │  │ │ (shadcn/ui       │ │  │                              │
│  │ 🗣️ Language     │ │  │ │ Command)         │ │  │                              │
│  └──────────────────┘ │  │ └──────────────────┘ │  │                              │
│                      │  └──────────────────────┘  │                              │
│                      │                             │                              │
├──────────────────────┴─────────────────────────────┴──────────────────────────────┤
│ STATUS BAR (shadcn/ui) - 24px height                                              │
│ 🟢 Connected • 🤖 llama3.2:3b • 🎯 Math Mode • 💾 Saved • 📊 Ready              │
└────────────────────────────────────────────────────────────────────────────────────┘
```

## 🎨 Design System Specifications

### Typography Scale (Open Sans)
```typescript
const typography = {
  fontFamily: {
    sans: ['Open Sans', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  }
}
```

### Color System (TanukiMCP Brand + shadcn/ui)
```typescript
const colors = {
  // TanukiMCP Brand Colors
  tanuki: {
    50: '#fef7f0',   // Cream
    100: '#fef0e0',  // Light cream
    200: '#fcd9b8',  // Light tan
    300: '#f9be8a',  // Tan
    400: '#f59e0b',  // Amber (secondary)
    500: '#d97706',  // Burnt orange (primary)
    600: '#c2410c',  // Deep burnt orange
    700: '#9a3412',  // Dark burnt orange
    800: '#7c2d12',  // Very dark orange
    900: '#651a07',  // Almost black orange
  },
  
  // Extended Semantic Colors (shadcn/ui compatible)
  background: '#1a1611',      // Dark mode primary
  foreground: '#fef7f0',      // Text on dark
  card: '#2a1f1a',           // Card background
  'card-foreground': '#e7d3c3', // Card text
  popover: '#2a1f1a',        // Popover background
  'popover-foreground': '#fef7f0', // Popover text
  primary: '#d97706',        // TanukiMCP primary
  'primary-foreground': '#fef7f0', // Text on primary
  secondary: '#3d2b20',      // Secondary backgrounds
  'secondary-foreground': '#e7d3c3', // Secondary text
  muted: '#3d2b20',          // Muted backgrounds
  'muted-foreground': '#a78b7a', // Muted text
  accent: '#f59e0b',         // Accent color
  'accent-foreground': '#1a1611', // Text on accent
  destructive: '#dc2626',    // Error/danger
  'destructive-foreground': '#fef7f0', // Text on destructive
  border: '#4a3428',         // Border color
  input: '#3d2b20',          // Input backgrounds
  ring: '#d97706',           // Focus rings
}
```

### Component Architecture Map

#### Core Layout Components (shadcn/ui)
```typescript
interface LayoutComponents {
  NavigationMenu: {
    purpose: 'Top-level app navigation and branding';
    shadcn: 'navigation-menu';
    features: ['Dropdown menus', 'Keyboard navigation', 'Brand integration'];
  };
  
  ResizablePanelGroup: {
    purpose: 'IDE-style resizable panels';
    shadcn: 'resizable';
    features: ['Drag handles', 'Persistent sizing', 'Responsive collapse'];
  };
  
  Tabs: {
    purpose: 'Content area tab management';
    shadcn: 'tabs';
    features: ['Closeable tabs', 'Reorderable', 'Contextual actions'];
  };
  
  Sheet: {
    purpose: 'Mobile overlay panels';
    shadcn: 'sheet';
    features: ['Slide-out drawer', 'Responsive behavior', 'Backdrop'];
  };
}
```

#### Feature-Specific Components
```typescript
interface FeatureComponents {
  ChatInterface: {
    base: 'Card + ScrollArea';
    components: ['Avatar', 'Badge', 'Button', 'Input', 'Command', 'ModelSelector'];
    features: [
      'Message bubbles with proper spacing',
      'Typing indicators with animations', 
      'Tool selector with Command component',
      'File attachment previews',
      'Code syntax highlighting',
      'Model execution mode toggle (Local/Remote)',
      'Real-time capability indicators'
    ];
  };
  
  FileExplorer: {
    base: 'Tree + Collapsible';
    components: ['Button', 'Input', 'ContextMenu', 'Badge'];
    features: [
      'Hierarchical file tree',
      'Search and filtering',
      'Right-click context menus',
      'Drag and drop support',
      'Status indicators'
    ];
  };
  
  WorkflowManager: {
    base: 'Card + Tabs + Form';
    components: ['Dialog', 'Select', 'Textarea', 'Progress', 'Alert'];
    features: [
      'Workflow creation wizard',
      'Visual workflow builder',
      'Execution monitoring',
      'Template library',
      'Export/import functionality'
    ];
  };
  
  SettingsPanel: {
    base: 'Form + Tabs + Switch';
    components: ['Label', 'Input', 'Slider', 'RadioGroup', 'Checkbox'];
    features: [
      'Model management interface',
      'Theme customization',
      'Keyboard shortcuts',
      'Plugin configuration',
      'Data export/import'
    ];
  };
}
```

## 🔧 Menu & Navigation Structure (shadcn/ui NavigationMenu)

### Primary Navigation Menu
```typescript
const navigationStructure = {
  brand: {
    logo: 'TanukiMCP Logo',
    title: 'Atlas',
    subtitle: 'AI Agentic IDE'
  },
  
  menus: [
    {
      trigger: 'File',
      items: [
        { label: 'New Chat', shortcut: 'Ctrl+N', action: 'newChat' },
        { label: 'New Workflow', shortcut: 'Ctrl+Shift+N', action: 'newWorkflow' },
        { separator: true },
        { label: 'Open Project', shortcut: 'Ctrl+O', action: 'openProject' },
        { label: 'Recent Projects', submenu: 'recentProjects' },
        { separator: true },
        { label: 'Save', shortcut: 'Ctrl+S', action: 'save' },
        { label: 'Save All', shortcut: 'Ctrl+Shift+S', action: 'saveAll' },
        { separator: true },
        { label: 'Export', submenu: 'exportOptions' },
        { label: 'Import', submenu: 'importOptions' },
        { separator: true },
        { label: 'Preferences', shortcut: 'Ctrl+,', action: 'openSettings' },
        { label: 'Exit', shortcut: 'Ctrl+Q', action: 'exit' }
      ]
    },
    
    {
      trigger: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', action: 'undo' },
        { label: 'Redo', shortcut: 'Ctrl+Y', action: 'redo' },
        { separator: true },
        { label: 'Cut', shortcut: 'Ctrl+X', action: 'cut' },
        { label: 'Copy', shortcut: 'Ctrl+C', action: 'copy' },
        { label: 'Paste', shortcut: 'Ctrl+V', action: 'paste' },
        { separator: true },
        { label: 'Find', shortcut: 'Ctrl+F', action: 'find' },
        { label: 'Replace', shortcut: 'Ctrl+H', action: 'replace' },
        { label: 'Find in Files', shortcut: 'Ctrl+Shift+F', action: 'findInFiles' }
      ]
    },
    
    {
      trigger: 'View',
      items: [
        { label: 'Command Palette', shortcut: 'Ctrl+Shift+P', action: 'commandPalette' },
        { separator: true },
        { label: 'Toggle Sidebar', shortcut: 'Ctrl+B', action: 'toggleSidebar' },
        { label: 'Toggle Secondary Panel', shortcut: 'Ctrl+Shift+B', action: 'toggleSecondary' },
        { separator: true },
        { label: 'Subject Modes', submenu: 'subjectModes' },
        { label: 'Theme', submenu: 'themeOptions' },
        { separator: true },
        { label: 'Zoom In', shortcut: 'Ctrl++', action: 'zoomIn' },
        { label: 'Zoom Out', shortcut: 'Ctrl+-', action: 'zoomOut' },
        { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: 'resetZoom' }
      ]
    },
    
    {
      trigger: 'Tools',
      items: [
        { label: 'Model Management', action: 'openModelManager' },
        { label: 'MCP Servers', action: 'openMCPManager' },
        { label: 'Workflow Manager', action: 'openWorkflowManager' },
        { separator: true },
        { label: 'LLM Prompt Management', action: 'openPromptManager' },
        { label: 'Performance Monitor', action: 'openPerformanceMonitor' },
        { label: 'Analytics Dashboard', action: 'openAnalytics' },
        { separator: true },
        { label: 'Extension Manager', action: 'openExtensions' },
        { label: 'Tool Catalog', action: 'openToolCatalog' }
      ]
    },
    
    {
      trigger: 'Window',
      items: [
        { label: 'New Window', shortcut: 'Ctrl+Shift+N', action: 'newWindow' },
        { label: 'Close Window', shortcut: 'Ctrl+Shift+W', action: 'closeWindow' },
        { separator: true },
        { label: 'Minimize', shortcut: 'Ctrl+M', action: 'minimize' },
        { label: 'Maximize', action: 'maximize' },
        { separator: true },
        { label: 'Reset Layout', action: 'resetLayout' },
        { label: 'Save Layout', action: 'saveLayout' }
      ]
    },
    
    {
      trigger: 'Help',
      items: [
        { label: 'Welcome Guide', action: 'showWelcome' },
        { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+?', action: 'showShortcuts' },
        { label: 'Documentation', action: 'openDocs' },
        { separator: true },
        { label: 'Report Issue', action: 'reportIssue' },
        { label: 'Check for Updates', action: 'checkUpdates' },
        { separator: true },
        { label: 'About TanukiMCP Atlas', action: 'showAbout' }
      ]
    }
  ],
  
  rightActions: [
    { component: 'ThemeToggle', icon: 'Moon' },
    { component: 'SettingsButton', icon: 'Settings' },
    { component: 'WindowControls', items: ['minimize', 'maximize', 'close'] }
  ]
}
```

## 💬 Chat Interface (shadcn/ui Implementation)

### Modern Chat Layout
```typescript
interface ChatInterfaceDesign {
  container: 'Card with proper padding and borders';
  layout: 'flex flex-col h-full';
  
  header: {
    component: 'div with flex justify-between items-center';
    elements: [
      'Avatar + Model name (shadcn/ui Avatar + Badge)',
      'Execution Mode Selector (Local/Remote PRO)',
      'Status indicator (Online/Offline)',
      'Action buttons (Settings, Clear, Export)'
    ];
  };
  
  messageArea: {
    component: 'ScrollArea with auto-scroll';
    messageTypes: [
      {
        type: 'user',
        design: 'bg-tanuki-500 text-white rounded-lg ml-auto max-w-[80%]',
        elements: ['Message text', 'Timestamp', 'Actions menu']
      },
      {
        type: 'assistant',
        design: 'bg-card border rounded-lg mr-auto max-w-[85%]',
        elements: ['Avatar', 'Message content', 'Tool indicators', 'Actions']
      },
      {
        type: 'system',
        design: 'bg-muted text-muted-foreground text-center text-sm',
        elements: ['System message with subtle styling']
      }
    ];
  };
  
  inputArea: {
    component: 'div with border-t pt-4 space-y-4';
    elements: [
      {
        component: 'Command (for @ tool selector)',
        features: ['Fuzzy search', 'Keyboard navigation', 'Tool previews']
      },
      {
        component: 'Textarea with auto-resize',
        placeholder: 'Type your message... (use @ for tools)',
        features: ['Syntax highlighting', 'Auto-complete', 'Mention detection']
      },
      {
        component: 'div with flex justify-between items-center',
        leftActions: ['Attachment button', 'Voice input toggle'],
        rightActions: ['Send button (disabled when empty)']
      }
    ];
  };
}
```

### Model Execution Selector (Intelligence Amplification Toggle)
```typescript
interface ModelExecutionSelector {
  location: 'Chat interface header - prominently displayed';
  component: 'ToggleGroup showcasing free model options';
  
  modes: [
    {
      value: 'openrouter-free',
      label: 'OpenRouter Free',
      badge: 'Free',
      description: 'Free OpenRouter models with full capabilities',
      requirements: 'Internet connection required',
      capabilities: [
        'Access to multiple free models',
        'Llama 3.1 8B, Gemma 2 9B, Phi-3 Mini, Mistral 7B',
        'Task-specific model recommendations',
        'Automatic model selection for optimal results',
        'Rate-limited but generous free usage',
        'No cost, no subscriptions'
      ]
    }
  ];
  
  modelSelection: {
    component: 'Dropdown with free model options',
    options: [
      'meta-llama/llama-3.1-8b-instruct:free',
      'google/gemma-2-9b-it:free', 
      'microsoft/phi-3-mini-128k-instruct:free',
      'mistralai/mistral-7b-instruct:free'
    ],
    autoSelect: 'Best model for current task type',
    fallback: 'Automatic fallback if rate limited'
  };
}
```

### Tool Selector (Enhanced Command Component)
```typescript
interface ToolSelectorDesign {
  trigger: 'Type @ in chat input';
  component: 'Command with custom styling';
  
  structure: {
    header: 'CommandInput with "Search tools and workflows..."',
    
    groups: [
      {
        heading: 'File Operations',
        items: [
          { icon: 'FileText', name: 'read_file', description: 'Read file contents' },
          { icon: 'Edit', name: 'write_file', description: 'Write or edit files' },
          { icon: 'Search', name: 'search_files', description: 'Find files by pattern' }
        ]
      },
      
      {
        heading: 'Code Operations', 
        items: [
          { icon: 'Code', name: 'search_code', description: 'Search in code files' },
          { icon: 'Scissors', name: 'edit_block', description: 'Edit code blocks' },
          { icon: 'Zap', name: 'analyze_code', description: 'Analyze code structure' }
        ]
      },
      
      {
        heading: 'Task Management',
        items: [
          { icon: 'CheckSquare', name: 'create_todolist', description: 'Break down tasks' },
          { icon: 'Play', name: 'execute_task', description: 'Run specific tasks' },
          { icon: 'Check', name: 'mark_complete', description: 'Mark as done' }
        ]
      },
      
      {
        heading: 'Custom Workflows',
        items: [
          { icon: 'Workflow', name: 'project_analysis', description: 'Analyze project structure' },
          { icon: 'GitBranch', name: 'code_review', description: 'Review code changes' },
          { icon: 'BarChart', name: 'data_pipeline', description: 'Process data workflows' }
        ]
      },
      
      {
        heading: 'Recently Used',
        items: 'Dynamic list of recently used tools'
      }
    ];
  };
}
```

## 📁 File Explorer (shadcn/ui Tree Component)

### Modern File Tree Design
```typescript
interface FileExplorerDesign {
  container: 'ResizablePanel with min-width and handles';
  
  header: {
    component: 'div with p-4 border-b';
    elements: [
      'h3 text-sm font-semibold mb-2: "Explorer"',
      'Input with Search icon: "Search files..."',
      'div with flex gap-2 mt-2: [New File] [New Folder] buttons'
    ];
  };
  
  treeArea: {
    component: 'ScrollArea with p-2';
    
    treeNode: {
      design: 'Collapsible with hover states and proper indentation';
      states: [
        'default: text-foreground hover:bg-accent/50',
        'selected: bg-accent text-accent-foreground',
        'expanded: ChevronDown icon, collapsed: ChevronRight icon'
      ];
      
      nodeContent: [
        'Icon (folder/file type specific from Lucide)',
        'Name with proper truncation',
        'Status badge (modified, added, deleted)',
        'Context menu trigger (MoreHorizontal icon)'
      ];
    };
    
    contextMenu: {
      component: 'ContextMenu with shadcn/ui styling';
      items: [
        'Open in Editor',
        'Reveal in Finder',
        'Copy Path',
        'Rename',
        'Duplicate',
        'Delete',
        'Properties'
      ];
    };
  };
  
  footer: {
    component: 'div with p-2 border-t text-xs text-muted-foreground';
    content: 'Project stats: file count, total size, last modified'
  };
}
```

## 🔧 Workflow Manager (Professional Interface)

### Workflow Management Interface
```typescript
interface WorkflowManagerDesign {
  layout: 'Tabs with multiple sections';
  
  tabs: [
    {
      value: 'workflows',
      label: 'My Workflows',
      content: {
        header: 'div with flex justify-between items-center p-4',
        headerElements: [
          'h2 text-lg font-semibold: "Workflow Library"',
          'Button: "Create New Workflow"'
        ],
        
        toolbar: {
          component: 'div with flex gap-2 p-4 border-b',
          elements: [
            'Input with Search icon: "Search workflows..."',
            'Select: Category filter',
            'Select: Sort by (Name, Date, Usage)',
            'ToggleGroup: View mode (Grid, List)'
          ]
        },
        
        workflowGrid: {
          component: 'div with grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4',
          
          workflowCard: {
            component: 'Card with hover:shadow-md transition-shadow',
            elements: [
              'CardHeader with workflow icon and name',
              'CardContent with description and tags',
              'CardFooter with action buttons and stats'
            ];
          }
        }
      }
    },
    
    {
      value: 'create',
      label: 'Create Workflow',
      content: {
        component: 'Form with multi-step wizard',
        steps: [
          'Basic Information (name, description, category)',
          'Workflow Builder (visual node editor)',
          'Testing & Validation',
          'Save & Deploy'
        ]
      }
    },
    
    {
      value: 'templates',
      label: 'Templates',
      content: {
        component: 'Grid of community templates with install buttons',
        features: ['Preview', 'Download count', 'Rating', 'Install button']
      }
    }
  ];
}
```

## ⚙️ Settings Panel (Comprehensive Configuration)

### Settings Interface Design
```typescript
interface SettingsPanelDesign {
  layout: 'Dialog with Tabs sidebar + content area';
  
  sidebar: {
    component: 'div with w-48 border-r',
    
    tabs: [
      { icon: 'Bot', label: 'Models', value: 'models' },
      { icon: 'Palette', label: 'Appearance', value: 'appearance' },
      { icon: 'Keyboard', label: 'Shortcuts', value: 'shortcuts' },
      { icon: 'Plug', label: 'Extensions', value: 'extensions' },
      { icon: 'Shield', label: 'Privacy', value: 'privacy' },
      { icon: 'Settings', label: 'Advanced', value: 'advanced' }
    ]
  };
  
  contentArea: {
    models: {
      component: 'div with space-y-6 p-6',
      sections: [
        {
          title: 'Active Model',
          component: 'Card with current model info and performance stats'
        },
        {
          title: 'Available Models',
          component: 'Grid of model cards with install/switch actions'
        },
        {
          title: 'Model Recommendations',
          component: 'List based on system hardware'
        }
      ]
    };
    
    appearance: {
      sections: [
        {
          title: 'Theme',
          component: 'RadioGroup for Light/Dark/Auto'
        },
        {
          title: 'Font Settings',
          components: [
            'Select for font family',
            'Slider for font size',
            'Switch for ligatures'
          ]
        },
        {
          title: 'Color Customization',
          component: 'Color picker for accent colors'
        }
      ]
    };
  };
}
```

## 📱 Responsive Design Patterns

### Breakpoint System
```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};

const responsiveBehavior = {
  'sm': {
    layout: 'Single panel with bottom navigation',
    sidebar: 'Drawer overlay',
    secondaryPanel: 'Hidden (use tabs)',
    navigation: 'Hamburger menu'
  },
  
  'md': {
    layout: 'Two panel with collapsible sidebar',
    sidebar: 'Collapsible with toggle',
    secondaryPanel: 'Modal overlay',
    navigation: 'Full menu bar'
  },
  
  'lg+': {
    layout: 'Three panel resizable',
    sidebar: 'Always visible, resizable',
    secondaryPanel: 'Resizable panel',
    navigation: 'Full menu with dropdowns'
  }
};
```

### Mobile-First Component Adaptations
```typescript
interface ResponsiveComponents {
  NavigationMenu: {
    mobile: 'Sheet drawer with stacked menu items',
    desktop: 'Horizontal menu with dropdowns'
  };
  
  ChatInterface: {
    mobile: 'Full screen with bottom input',
    desktop: 'Panel with side-by-side messages'
  };
  
  FileExplorer: {
    mobile: 'Modal overlay with touch gestures',
    desktop: 'Sidebar panel with context menus'
  };
  
  WorkflowManager: {
    mobile: 'Full screen with tab navigation',
    desktop: 'Panel with multiple views'
  };
}
```

## 🎯 Implementation Priority Matrix

### Phase 1: Foundation (shadcn/ui Setup)
```typescript
const phase1Tasks = [
  'Install shadcn/ui CLI and initialize components.json',
  'Set up design tokens with TanukiMCP brand colors',
  'Install Open Sans font and configure typography',
  'Create base component library (Button, Input, Card, etc.)',
  'Set up theme provider with dark/light modes'
];
```

### Phase 2: Layout Transformation
```typescript
const phase2Tasks = [
  'Replace custom layout with ResizablePanelGroup',
  'Implement NavigationMenu with proper dropdowns',
  'Create responsive sidebar with Sheet for mobile',
  'Add StatusBar with proper connection indicators',
  'Set up routing and tab management'
];
```

### Phase 3: Feature Components
```typescript
const phase3Tasks = [
  'Migrate ChatInterface to use shadcn/ui components',
  'Implement FileExplorer with Tree component',
  'Create WorkflowManager with Tabs and Forms',
  'Build SettingsPanel with comprehensive options',
  'Add tool selector with Command component'
];
```

### Phase 4: Polish & Integration
```typescript
const phase4Tasks = [
  'Add loading states and error boundaries',
  'Implement keyboard shortcuts and accessibility',
  'Add animations and micro-interactions',
  'Set up Electron packaging and native integration',
  'Test responsive behavior across devices'
];
```

## 🚀 Electron Integration Specifications

### Desktop Application Features
```typescript
interface ElectronIntegration {
  window: {
    titleBarStyle: 'hiddenInset', // macOS
    frame: false, // Windows/Linux custom title bar
    minWidth: 800,
    minHeight: 600,
    defaultSize: [1400, 900],
    vibrancy: 'dark', // macOS transparency
    webSecurity: false // For local file access
  };
  
  nativeMenus: {
    macOS: 'Native menu bar integration',
    windows: 'Custom in-window menu',
    linux: 'Custom in-window menu'
  };
  
  features: [
    'Auto-updater with progress notifications',
    'Native file dialogs for import/export',
    'System notifications for completions',
    'Global shortcuts for quick access',
    'Deep linking support (tanukimcp://)',
    'Native context menus',
    'Window state persistence'
  ];
}
```

This comprehensive wireframe update provides a complete blueprint for transforming the TanukiMCP Atlas IDE into a modern, professional application using shadcn/ui components while maintaining the brand identity and improving user experience across all platforms.