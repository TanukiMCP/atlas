# TanukiMCP Atlas Toolbar Architecture

This document outlines the architecture, behavior, visual feedback, and user experience for the main toolbar and its associated application views within TanukiMCP Atlas.

## 1. Toolbar Philosophy

The TanukiMCP Atlas UI features a two-tier toolbar system:

1.  **Primary Menu Bar (Top)**: Contains global application menus (File, Edit, View, Tools, Help), the brand logo, theme switcher, and the Subject Mode dropdown. This bar is persistent and provides access to core functionalities and settings.
2.  **Secondary Toolbar (Contextual)**: Appears below the Primary Menu Bar and provides context-specific controls based on the active view or tool. For example, when the Chat view is active, this toolbar contains controls for `Agent Mode`, `Chat Mode`, `Stop`, and `@Tools`.

## 2. Layout Management

The application will adopt a flexible and responsive layout system, inspired by modern IDEs like Cursor.

*   **Main Content Area**: This is the primary workspace where different views (Editor, Chat, Workflow Manager, Settings, etc.) will be displayed.
*   **Sidebar(s)**:
    *   **Left Sidebar (File Explorer/Project View)**: Persistently available for project navigation. Can be toggled.
    *   **Right Sidebar (Contextual Panels)**: Used for displaying auxiliary information like tool outputs, debugger info, or specific settings related to the active view. Can be toggled and resized.
*   **Split Views**:
    *   The main content area should support splitting horizontally and vertically to display multiple views simultaneously (e.g., Editor side-by-side with Chat, or Editor above Terminal).
    *   Proportions of split panes should be user-adjustable via draggable dividers.
    *   When a file is selected from the File Explorer, it should open in a new tab or an existing split pane within the main content area. The Chat view should remain accessible, potentially in another split pane below or beside the editor.
*   **Tabbed Interface**: For views like the Editor, multiple files should open in tabs for easy switching.
*   **Full Screen Occupancy**: The entire application interface, including toolbars, sidebars, and the main content area, should utilize the full available screen space, eliminating any unintentional empty margins or unused areas.

## 3. Primary Menu Bar: Items and Behavior

The Primary Menu Bar located at the very top of the application window.

### 3.1. Branding & Theme

*   **TanukiMCP Logo**: Displays the official logo. Clicking it could potentially open an "About" modal or a link to `tanukimcp.com`.
    *   *Animation*: Subtle scale/shadow on hover.
*   **Application Title**: "TanukiMCP Atlas".
*   **Theme Switcher**: Icon button (☀️/🌙) to toggle between light and dark themes.
    *   *Transition*: Smooth fade between theme styles.
    *   *Visual Feedback*: Icon changes instantly. Tooltip indicates the action.
*   **Subject Mode Dropdown**: Allows users to switch the AI\'s subject matter expertise.
    *   *Behavior*: Dropdown menu with search/filter. Arrow key navigation.
    *   *Visual Feedback*: Selected mode is highlighted. Dropdown has smooth open/close animation.

### 3.2. File Menu

*   **New Chat**: Clears the current chat session and starts a new one.
    *   *View*: Resets the Chat view.
    *   *Shortcut*: `Ctrl+N`
*   **Open Project...**: Opens a system dialog to select a project folder.
    *   *View*: Updates the File Explorer to the new project root.
    *   *Shortcut*: `Ctrl+O`
*   **Save Chat...**: Exports the current chat session to a file (e.g., Markdown, JSON).
    *   *View*: Opens a system save dialog.
    *   *Shortcut*: `Ctrl+S`
*   **Export Chat...**: (Similar to Save Chat, could be combined or offer different formats).
*   **Import Chat...**: Imports a previously saved chat session.
*   --- (Separator) ---
*   **Settings**: Opens the Application Settings view.
    *   *View*: Navigates to a dedicated Settings page/modal within the main content area.
    *   *Shortcut*: `Ctrl+,`
*   --- (Separator) ---
*   **Exit**: Closes the application.

### 3.3. Edit Menu

Standard text editing commands, primarily for editable input fields and potentially the code editor.
*   **Undo**: `Ctrl+Z`
*   **Redo**: `Ctrl+Y`
*   --- (Separator) ---
*   **Cut**: `Ctrl+X`
*   **Copy**: `Ctrl+C`
*   **Paste**: `Ctrl+V`
*   --- (Separator) ---
*   **Find**: `Ctrl+F` (Contextual: in chat, in editor, etc.)
*   **Replace**: `Ctrl+H` (Contextual)

### 3.4. View Menu

Controls for UI elements visibility and layout.
*   **Command Palette**: Toggles the command palette overlay.
    *   *Shortcut*: `Ctrl+Shift+P`
*   --- (Separator) ---
*   **Toggle File Explorer**: Shows/Hides the left sidebar (File Explorer).
    *   *Shortcut*: `Ctrl+Shift+E`
*   **Toggle Chat Panel**: Shows/Hides a dedicated Chat panel (if layout allows it as a separate toggleable panel).
    *   *Shortcut*: `Ctrl+Shift+H`
*   **Toggle Terminal Panel**: Shows/Hides an integrated terminal panel, typically at the bottom of the main content area.
    *   *Shortcut*: `Ctrl+\``
*   --- (Separator) ---
*   **Toggle Fullscreen**: Toggles application fullscreen mode.
    *   *Shortcut*: `F11`
*   **Zoom In**: `Ctrl++`
*   **Zoom Out**: `Ctrl+-`
*   **Reset Zoom**: `Ctrl+0`

### 3.5. Tools Menu

Access to integrated tools, workflows, and management features.
*   **LLM Prompt Management**: Opens the Prompt Management interface.
    *   *View*: Navigates to a dedicated Prompt Management page.
*   **Tool Browser**: Opens a view to browse and manage available tools/plugins.
    *   *View*: Navigates to a dedicated Tool Browser page.
    *   *Shortcut*: `Ctrl+Shift+T`
*   **MCP Servers**: Opens a view to manage MCP server connections.
    *   *View*: Navigates to a dedicated MCP Servers management page.
*   --- (Separator) ---
*   **Execute Last Action**: (If applicable, re-runs the last executed tool or command).
    *   *Shortcut*: `F5`
*   **Workflow Manager**: Opens the Workflow Manager interface.
    *   *View*: Navigates to the Workflow Manager page.
    *   *Shortcut*: `Ctrl+F5`
*   **Debug Mode**: (Toggles a global debug mode for development/troubleshooting).
    *   *Shortcut*: `F9`
*   --- (Separator) ---
*   **Performance Monitor**: Opens a panel/view showing application performance metrics.

### 3.6. Help Menu

*   **Welcome Guide**: Opens an initial welcome/quick start guide.
*   **Documentation**: Opens local or online documentation.
    *   *Shortcut*: `F1`
*   **Keyboard Shortcuts**: Displays a list of all available keyboard shortcuts.
*   **Report Issue...**: Link to a bug reporting system/GitHub issues.
*   **Check for Updates...**: Triggers an update check.
*   --- (Separator) ---
*   **About TanukiMCP Atlas**: Displays an "About" dialog with version info, credits, etc.

## 4. Secondary (Contextual) Toolbar Behavior

This toolbar adapts to the currently active primary view (e.g., Chat, Workflow Manager).

### 4.1. Chat View Toolbar

*   **Mode Toggle (Agent/Chat)**: Switches between AI agent mode and direct chat mode.
    *   *Visual Feedback*: Active mode is highlighted.
*   **Stop Button**: Halts any ongoing AI processing or tool execution.
    *   *Visual Feedback*: Button may pulse or change color during processing. Becomes active when processing starts.
*   **@Tools Button**: Triggers a tool selection UI within the chat input.
*   **Subject/Mode Display**: Read-only text showing current subject mode and operational mode.
*   **Contextual Buttons (Right side)**:
    *   `🧠` (Processing Tier Indicator): Opens a small popover/panel showing current LLM, token usage, etc.
    *   `🛠️` (Tool Execution Panel): Opens a panel showing details of tool calls and results for the current session.
    *   `⚙️` (Chat Settings): Quick access to settings relevant to the chat view (e.g., model selection, temperature).
    *   `📊` (Chat Analytics): (Future) Opens analytics related to the current chat session.

### 4.2. Workflow Manager View Toolbar

*   **New Workflow Element Buttons**: (e.g., Start, Action, Condition, Loop, End).
*   **Save Workflow Button**.
*   **Test Run Button**.
*   **Zoom Controls** (if workflow is a canvas).
*   **Align/Distribute Tools** (if workflow is a canvas).

## 5. Visual Styles, Animations, and Transitions

*   **General**:
    *   Adhere to the TanukiMCP branding guidelines (colors, typography).
    *   Light theme should use burnt orange accents with beige/off-white backgrounds. Dark theme should be a true, high-contrast inverse.
    *   Maintain consistency in button styles, input fields, and overall component design.
    *   Use subtle animations for interactions (hover, click, focus) to provide feedback without being distracting.
    *   Transitions between views should be smooth (e.g., fade, subtle slide).
*   **Dropdowns**: Smooth expand/collapse. Highlight on hover and selection.
*   **Tooltips**: Consistent styling for all tooltips, appearing on hover after a short delay.
*   **Loading States**: Use spinners or progress bars for actions that take time.
*   **Error States**: Clear visual indication of errors, with helpful messages.

## 6. Implementation Strategy (Modular & Sequential)

1.  **Core Layout System**: Implement the main application frame, sidebars (toggleable), and basic main content area. Ensure it fills the screen.
2.  **Theme Engine**: Refine the light and dark themes, especially the light theme to match `tanukimcp.com` (burnt orange, beige). Ensure theme switching works flawlessly.
3.  **View Routing/Management**: Set up a basic mechanism to switch between different primary views in the main content area (e.g., Welcome, Chat, Editor placeholder, Settings placeholder).
4.  **Primary Menu Bar - Static Structure**: Build the static structure of the menu bar with all defined items and dropdowns. Initially, actions can be `console.log` placeholders.
5.  **File Menu Implementation**:
    *   Implement "Settings" to navigate to a placeholder Settings view.
6.  **View Menu Implementation**:
    *   Implement "Toggle File Explorer".
    *   Implement basic zoom (if feasible without a full editor).
7.  **Tools Menu Implementation**:
    *   Implement "Workflow Manager" to navigate to the (currently buggy) Workflow Manager view.
    *   Implement "LLM Prompt Management" to navigate to a placeholder view.
8.  **Help Menu Implementation**:
    *   Implement "About TanukiMCP Atlas".
9.  **File Editor Integration**:
    *   Integrate a basic code editor component (e.g., Monaco).
    *   Implement file opening from File Explorer into the editor (tabs or splits).
    *   Connect "Edit" menu actions (Cut, Copy, Paste, Find) to the editor.
10. **Chat View Integration**:
    *   Ensure chat view can be displayed alongside or below the editor using the split-pane system.
    *   Connect "New Chat" and "Save Chat".
11. **Contextual Toolbar - Chat**: Implement the secondary toolbar for the Chat view with its specific controls.
12. **Refine Workflow Manager**: Address existing bugs and integrate it properly within the new layout system. Implement its contextual toolbar.
13. **Sequential Feature Rollout**: Implement remaining menu actions one by one, building out their respective views or functionalities.
14. **Animations & Polish**: Add defined animations, transitions, and UX refinements across the application.
15. **Testing & Iteration**: Thoroughly test all functionalities and UI interactions.

This document will serve as the guide for these development steps.