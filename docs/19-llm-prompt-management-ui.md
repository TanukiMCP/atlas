# TanukiMCP Atlas - LLM System Prompt Management UI

## 1. Overview & Objective

This document outlines the architecture for a dedicated "LLM System Prompt Management" UI tab within TanukiMCP Atlas. This feature is critical for upholding the system's core principles of transparency, user control, and privacy. It will provide users with a centralized interface to view, understand, and directly edit the system prompts that govern the behavior of every LLM agent integrated into the TanukiMCP Atlas ecosystem.

The primary objectives are:
-   **Full Transparency**: Allow users to inspect the exact system prompts and operator profiles used by all internal LLM agents, including those involved in routing, planning, execution, workflow generation, and any other specialized tasks.
-   **Granular User Control**: Empower users to customize and fine-tune the behavior of LLM agents by modifying their system prompts to better suit their specific needs, preferences, or ethical considerations.
-   **Educational Insight**: Serve as an interactive tutorial, helping users understand how LLM agents are guided and how different prompting strategies affect their output and behavior.
-   **System Integrity & Defaults**: While providing full editability, the system must also offer a way to revert to default, tested prompts to ensure system stability if user modifications lead to undesirable outcomes.
-   **Dynamic Loading**: Ensure that all parts of TanukiMCP Atlas dynamically load and utilize the currently active (default or user-modified) system prompts.

## 2. System Architecture

The LLM System Prompt Management UI will be a distinct section within the TanukiMCP Atlas settings or a dedicated top-level tab.

```mermaid
graph TD
    A[User Navigates to "LLM Prompt Management" UI Tab] --> B[Prompt Discovery Service];
    B -- Fetches All Registered Prompts --> C{Prompt Registry / Database};
    C -- Default Prompts & User-Modified Prompts --> B;
    B -- Organizes & Categorizes Prompts --> D[Prompt Management Interface];

    subgraph PromptManagementInterface [Prompt Management Interface]
        direction LR
        D_List[Prompt List/Tree View]
        D_Editor[Prompt Editor Pane]
        D_Metadata[Prompt Metadata & Description]
        D_Controls[Save, Reset, Export, Import Controls]
    end

    D_Editor -- User Edits Prompt --> E{Save Action};
    E -- Saves Modified Prompt --> C;
    F[All TanukiMCP Atlas LLM Agents] -- Load Active Prompts --> C;
```

### 2.1. Prompt Discovery & Registry

-   **Centralized Registry**: A core component (e.g., a configuration database table or a structured set of version-controlled files) will store all system prompts for every LLM agent within TanukiMCP Atlas.
    -   Each prompt entry will have a unique identifier, a human-readable name/description, the agent/module it belongs to, its purpose, the default prompt text, and the user-modified prompt text (if any).
    -   Example Identifiers: `routing.complexity_assessor.v1`, `workflow_generation.agent1_synthesizer.v1`, `execution_engine.task_sequencer.v1`.
-   **Prompt Discovery Service**: When the UI tab is opened, this service will scan the registry (or a manifest) to identify all available system prompts and their current states (default or user-modified).
-   **Categorization/Organization**: Prompts should be organized logically in the UI, perhaps by module (e.g., "LLM Routing Layer", "Workflow Generation Agents", "Core Execution Engine", "Chat UI Helpers"), by agent, or by functionality to make them easy for users to find and understand.

### 2.2. LLM System Prompt Management UI

This UI will provide a comprehensive interface for managing system prompts.

-   **Layout**: Typically a two-or-three-pane layout:
    -   **Pane 1: Prompt Navigation/List (Scrollable)**:
        -   Displays a searchable and filterable list or tree view of all registered system prompts, organized by category/module.
        -   Clearly indicates if a prompt is currently using its default version or has been modified by the user.
        -   Selecting a prompt in this list loads its details into the other panes.
    -   **Pane 2: Prompt Editor (Main Area)**:
        -   A large text area (e.g., using a code editor component like Monaco Editor for syntax highlighting if prompts are complex or use a specific DSL/templating language) where the actual system prompt text is displayed and can be edited.
        -   Supports multi-line text and potentially variables/placeholders if the system uses them (though the prompt itself is the source of truth).
    -   **Pane 3: Metadata, Description, and Guidance (Contextual Information)**:
        -   **Prompt Name/ID**: Clearly displayed.
        -   **Purpose/Description**: Detailed explanation of what this prompt does, which LLM agent uses it, and what aspects of behavior it controls.
        -   **Expected Variables/Context**: If the prompt expects dynamic data to be injected at runtime (e.g., `{{user_query}}`, `{{chat_history}}`), these should be documented here.
        -   **Guidance/Best Practices**: Tips for editing this specific prompt, potential impacts of changes, and links to relevant documentation or examples (if any).
        -   **Default Prompt Viewer**: A non-editable view of the original, default system prompt for easy comparison.
-   **Controls**: Associated with the selected prompt:
    -   **"Save Changes" Button**: Saves the user's modifications to the selected prompt in the Prompt Registry.
    -   **"Reset to Default" Button**: Reverts the selected prompt to its original, default version.
    -   **"Export Prompt" Button**: Allows the user to export the current (default or modified) prompt to a local file (e.g., .txt or .md).
    -   **"Import Prompt" Button**: Allows the user to import a prompt from a local file to replace the current user-modified version.
    -   **(Potentially) Version History**: A simple mechanism to see past user versions of a prompt and revert to them.
-   **Global Controls**:
    -   **"Reset All to Default" Button**: Allows the user to revert all modified prompts back to their default states (with a confirmation dialog).
    -   **"Export All Modified Prompts" / "Import All Modified Prompts"**: For backup and sharing of customizations.

### 2.3. Prompt Storage

-   **Default Prompts**: These should be packaged with the application, potentially as part of the codebase or in version-controlled configuration files. They are the baseline.
-   **User-Modified Prompts**: When a user edits a prompt, the modified version needs to be stored persistently (e.g., in a local user-specific database like SQLite, or in user-specific configuration files within their application data directory).
    -   The storage should only store the *delta* or the full modified prompt, linked to the unique prompt identifier.
    -   The system must clearly distinguish between a prompt using its default and one using a user-modified version.

### 2.4. Dynamic Prompt Loading Mechanism

-   All LLM agent instantiations or LLM API calls throughout TanukiMCP Atlas that rely on a system prompt MUST be refactored to dynamically load the *active* version of that prompt at runtime.
-   This means that before an agent is used, the system checks if a user-modified version of its designated prompt exists. If so, that version is used; otherwise, the default prompt is used.
-   This requires a robust way to identify which prompt an agent needs (using the unique prompt identifiers).
-   Changes made in the UI should ideally be reflected immediately or upon a clear action (e.g., app restart if live-reloading is too complex, though live-reloading is preferred for a better UX).

## 3. Data Flow & User Interaction

1.  User navigates to the "LLM System Prompt Management" tab.
2.  The **Prompt Discovery Service** loads all registered prompts (defaults and any user-modified versions) from the **Prompt Registry/Database**.
3.  The UI displays the categorized list of prompts.
4.  User selects a prompt from the list.
5.  The selected prompt's text (user-modified if it exists, otherwise default) is displayed in the **Prompt Editor Pane**. Its metadata, description, and the default version are shown in the **Metadata Pane**.
6.  User edits the prompt text in the editor.
7.  User clicks **"Save Changes"**.
    a.  The modified prompt text is validated (e.g., for basic syntax if a templating language is used, or for excessive length, though user freedom is key).
    b.  The modified prompt is saved to the user-specific storage, associated with the unique prompt identifier.
8.  User clicks **"Reset to Default"**.
    a.  The user-modified version for that prompt is cleared from user-specific storage.
    b.  The editor pane updates to show the default prompt text.
9.  When any LLM agent in the system is invoked:
    a.  It requests its system prompt using its unique prompt identifier.
    b.  The system retrieves the user-modified version if available; otherwise, it retrieves the default version.
    c.  The agent uses the retrieved prompt for its operation.

## 4. Scope of Editable Prompts

It is crucial that this system provides access to **ALL** system prompts used by LLM agents within TanukiMCP Atlas. This includes, but is not limited to:

-   **Tier 1 Hidden LLM Router Layer Prompts** (from `docs/13-enhanced-llm-architecture.md`):
    -   Request Type Classifier prompts.
    -   Complexity Assessor prompts.
    -   Route Selection logic prompts.
-   **Tier 2, 3, 4 Processor Prompts** (Atomic, Moderate, Complex):
    -   Prompts for Quick Analyzer, Direct Executor, Rapid Responder (Atomic).
    -   Prompts for Planning Engine, Sequential Executor, Quality Checker (Moderate).
-   **Advanced Task Planning & Context Gathering Prompts**:
    -   Intelligent Agent Profile Definer prompts.
    -   Intelligent Tool Router Layer (if any LLM guidance is used in selection).
    -   Intelligent Tasklist Master Production Layer prompts (Primary Planner, Web Search Router, Tool Integrator, Quality Validator).
-   **AI Agent Council Review and Enhancement Prompts**:
    -   Enhancement Agent system prompts (for various specializations).
    -   Voting Agent / Judge Instructions (if LLM-driven or templated).
    -   Expert Panel Reviewer prompts.
-   **Intelligent Implementation Engine Prompts**:
    -   Task Sequencer (Hidden LLM Task Coordinator) prompts.
    -   Iterative Execution Engine (Hidden LLM Executor) prompts.
-   **Final Review and User Communication Prompts**:
    -   Communication Excellence Layer (Hidden LLM Communicator) prompts.
    -   Actionable Suggestions System prompts.
    -   Early Stopping Mechanism prompts.
-   **Hybrid Mode Management System Prompts**:
    -   Hybrid Mode Controller (Master Mode Orchestrator) prompts.
    -   Adaptive Complexity Assessment prompts.
-   **Failure Recovery and Resilience Framework Prompts**:
    -   Any LLM-guided failure detection, recovery strategy selection, or resilience mechanism prompts.
-   **User Intervention System Prompts**:
    -   Any LLM involved in interpreting corrections or adapting plans.
-   **Intelligent Custom Workflow Generation Prompts** (from `docs/18-intelligent-workflow-generation.md`):
    -   LLM Agent 1: Workflow Synthesizer & Visualizer prompts.
    -   LLM Agent 2: Workflow Refinement prompts.
    -   LLM Agent 3: Workflow Finalizer & Templater prompts.
-   Any other general-purpose or specialized LLM agents used within the chat interface or other IDE functionalities.

## 5. Technical Considerations

-   **UI Framework**: Leverage existing UI components and framework (e.g., React, TailwindCSS) for consistency.
-   **Prompt Versioning**: Consider how updates to default prompts (with new application versions) interact with user-modified prompts. Users should perhaps be notified if a default prompt they overrode has been updated, with an option to view diffs or adopt the new default.
-   **Security**: While users are given control, any input (like imported prompts) should be sanitized if it's ever displayed in a context where XSS could be an issue (though unlikely if prompts are just text for LLMs).
-   **Performance**: Loading and displaying many prompts should be efficient. Saving should be quick. The dynamic loading of prompts by agents should not introduce significant overhead.
-   **Impact of Bad Edits**: Users should be implicitly aware (perhaps through UI warnings or documentation within the tab) that poorly constructed prompts can significantly degrade LLM performance or lead to unexpected behavior. The "Reset to Default" is the safety net.
-   **No Direct LLM Interaction for Editing**: The UI itself does not use an LLM to help the user edit prompts. The user is directly editing the raw prompt text that will be fed to the target LLM agent elsewhere in the system.

This LLM System Prompt Management UI will be a cornerstone feature for advanced users and developers, reinforcing TanukiMCP Atlas's commitment to an open, controllable, and understandable AI-powered development environment. 