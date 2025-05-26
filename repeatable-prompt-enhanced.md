# Enhanced TanukiMCP Atlas Development Prompt

## Initial Configuration & Tool Assessment

TASK_NUMBER = 

TASK_NAME = 

**Can you please then utilize desktop-commander get_config and identify the tools you will use to implement the rest of task [TASK_NUMBER] to completion? Utilize clearthought and puppeteer as you see fit to think through/plan/map, implement, and verify.**

## Project Context

I'm working on enhancing TanukiMCP Atlas - a professional AI Agentic MCP Integrated IDE with local LLM integration. Please reference `uitodo.md`.

**⚠️ CRITICAL: NO NEW DEPENDENCIES POLICY**
- Use ONLY existing packages: Radix UI, cmdk, lucide-react, react-resizable-panels, Zustand, TailwindCSS
- Leverage existing @tanukimcp/management-center package for settings/management
- Check existing component inventory before building anything custom
- When in doubt, use Radix UI components with custom theming

**Project Context:**
- Vision: "The world's most intelligent local-first IDE" with 100% privacy  
- Brand: tanukimcp.com aesthetic (burnt orange #d97706, cream/tan accents)
- Stack: React + TypeScript + Vite + TailwindCSS + Radix UI + Electron
- Database: better-sqlite3 + drizzle-orm (configured)
- Desktop: Electron + electron-builder (fully setup)

**Current Session Focus:**
Work on **Task [TASK_NUMBER]: [TASK_NAME FROM UITODO.MD]**

**Implementation Requirements:**
1. **Maximize Existing Components**: Use Radix UI, cmdk, lucide-react first
2. **Brand Alignment**: tanukimcp.com colors, AI IDE messaging (not WordPress)
3. **Local-First**: Emphasize privacy, offline functionality, local LLMs
4. **Professional Polish**: Match top-tier IDE quality with existing tools
5. **Real Data**: No mock/placeholder content, full production implementation

**Available Component Library:**
- Layouts: ResizablePanelGroup, ResizablePanel, ResizableHandle
- Navigation: Tabs, Accordion, Dialog, DropdownMenu  
- Commands: cmdk (CommandDialog, CommandInput, CommandList)
- Content: ScrollArea, Avatar, Checkbox, Tooltip
- Icons: Full lucide-react library
- State: Zustand stores (theme, files, chat, layout, tools)

**Quality Standards:**
✅ Use existing Radix UI components with custom theming
✅ Apply tanukimcp.com professional aesthetic  
✅ Implement real functionality (no mocks)
✅ Handle loading states and errors professionally
✅ Ensure accessibility and keyboard navigation
✅ Test with puppeteer screenshots

**Methodology:**
1. **Configuration Assessment**: Use desktop-commander get_config to understand current environment
2. **Tool Planning**: Identify specific tools needed for task completion
3. **Strategic Thinking**: Use clearthought for planning, problem-solving, and decision-making
4. **Implementation**: Execute the planned solution using identified tools
5. **Verification**: Use puppeteer for visual testing and validation
6. **Iteration**: Refine based on testing results

**End Goal:** Transform into a professional AI IDE using only existing infrastructure, achieving the quality and polish described in the End Vision section of uitodo.md.

Focus entirely on **Task [TASK_NUMBER]: [TASK_NAME]** using available components and libraries.