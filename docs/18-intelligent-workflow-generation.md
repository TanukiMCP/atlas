# TanukiMCP Atlas - Intelligent Custom Workflow Generation & Management

## 1. Overview & Objective

This document details the architecture for an enhanced "Save Custom Workflow" feature within the TanukiMCP Atlas chat UI. The primary objective is to leverage Large Language Models (LLMs) to assist users in creating, visualizing, refining, and saving chat conversations as reusable, structured workflows. This system introduces multiple LLM agents with specialized roles to ensure a high-quality, interactive, and reliable workflow creation process.

The core goals are:
-   **Intelligent Workflow Extraction**: Automatically analyze chat conversations to generate meaningful, structured workflows.
-   **Interactive Visualization & Refinement**: Provide users with an intuitive interface to preview, edit, and iteratively refine LLM-generated workflows using both direct manipulation and natural language.
-   **Standardized Workflow Saving**: Ensure workflows are saved in a consistent, robust format using an LLM-validated template.
-   **Seamless Integration**: Make saved custom workflows easily accessible and callable via the existing "@" tool functionality.

## 2. System Architecture

The Intelligent Custom Workflow Generation system is comprised of several key components:

```mermaid
graph TD
    A[User Clicks "Save Custom Workflow"] --> B{Chat Transcript};
    B --> C[LLM Agent 1: Workflow Synthesizer & Visualizer];
    C -- System Prompt & Operator Profile --> C;
    C -- ASCII Markdown Workflow --> D[Workflow Preview & Editing UI];
    D -- User Edits (Direct Text) --> D;
    D -- User Edits (Chat to LLM Agent 2) --> E[LLM Agent 2: Workflow Refinement];
    E -- System Prompt & Operator Profile --> E;
    E -- Updated ASCII Markdown --> D;
    D -- "Regenerate" Click --> C;
    D -- "Save Workflow" Click --> F[LLM Agent 3: Workflow Finalizer & Templater];
    F -- Locked Workflow Template --> F;
    F -- System Prompt & Operator Profile --> F;
    F -- Structured Workflow Data --> G[Workflow Storage System];
    G --> H[@ Tool Integration Layer];

    subgraph WorkflowPreviewUI [Workflow Preview & Editing UI]
        direction TB
        D_Preview[Scrollable Markdown Preview (Editable)]
        D_Chat[Refinement Chat Interface (LLM Agent 2)]
        D_RegenBtn["Regenerate" Button]
        D_SaveBtn["Save Workflow" Button]
    end
```

### 2.1. LLM Agents

Three distinct LLM agents, each with specific system prompts and operator profiles, manage the workflow creation process:

#### 2.1.1. LLM Agent 1: Workflow Synthesizer & Visualizer
-   **Trigger**: User initiates "Save Custom Workflow" from a chat.
-   **Input**: Full chat transcript.
-   **Responsibilities**:
    1.  Analyze the chat transcript to understand the sequence of actions, tools used, information exchanged, and the user's likely intent for creating a reusable workflow.
    2.  Synthesize a structured workflow from the chat.
    3.  Generate an ASCII art visualization of the workflow in Markdown format. The style should emulate the "Complete Architecture Flow Visualization" found in `docs/13-enhanced-llm-architecture.md`. This visualization should clearly depict steps, branches, and connections.
    4.  Produce an initial structured representation of the workflow that underpins the visualization.
-   **Output**: ASCII Markdown workflow visualization and its underlying structured representation.
-   **System Prompt/Operator Profile Focus**: Deep understanding of conversational context, task decomposition, tool identification, intent inference, and creative visualization in a constrained (ASCII markdown) format. Must be proficient in translating unstructured chat into logical, repeatable steps.

#### 2.1.2. LLM Agent 2: Workflow Refinement
-   **Trigger**: User interacts with the chat interface within the Workflow Preview & Editing UI.
-   **Input**: Current workflow state (ASCII Markdown + underlying structure) and user's natural language refinement requests.
-   **Responsibilities**:
    1.  Interpret user's edit requests (e.g., "Change step 3 to use the File Editor tool," "Add a new step after step 2 to ask for user confirmation," "Remove the branch leading to step 5").
    2.  Modify the workflow structure and its ASCII Markdown visualization based on the user's requests.
    3.  Maintain the integrity and coherence of the workflow during modifications.
-   **Output**: Updated ASCII Markdown workflow visualization and its underlying structured representation.
-   **System Prompt/Operator Profile Focus**: Precision in understanding edit instructions, ability to modify structured data and its visual representation concurrently, maintaining context during iterative refinement, and ensuring workflow validity.

#### 2.1.3. LLM Agent 3: Workflow Finalizer & Templater (Hidden)
-   **Trigger**: User clicks the final "Save Workflow" button in the Workflow Preview & Editing UI.
-   **Input**: The final state of the workflow (ASCII Markdown and its underlying structured representation) from the preview UI.
-   **Responsibilities**:
    1.  Parse the finalized workflow representation.
    2.  Interpret and validate the workflow against a predefined, **locked (read-only) workflow template file**. This template defines the canonical schema for all saved workflows.
    3.  Populate the fields of this template with the information extracted from the user-refined workflow. This includes identifying parameters, tool calls, sequences, and conditional logic.
    4.  Ensure the output strictly adheres to the template's schema.
-   **Output**: Structured workflow data (e.g., JSON or YAML) that perfectly conforms to the locked workflow template.
-   **System Prompt/Operator Profile Focus**: Strict adherence to schemas, data extraction, meticulous attention to detail, validation against a fixed template, and transformation of a potentially more free-form (edited markdown) representation into a canonical structured format.

### 2.2. Workflow Preview & Editing UI

This UI is a modal or dedicated view presented to the user after the initial workflow is generated by LLM Agent 1.
-   **Layout**:
    -   The top ~4/5ths of the UI is a **Scrollable Markdown Preview Pane**.
        -   Displays the ASCII art workflow generated by LLM Agent 1 (and updated by LLM Agent 2).
        -   **Directly Editable**: Users can click into this pane and modify the Markdown text manually. These changes must be reflected in the underlying workflow structure that LLM Agent 2 and eventually LLM Agent 3 will process.
    -   The bottom ~1/5th of the UI is a **Refinement Chat Interface**.
        -   Allows users to type natural language instructions to LLM Agent 2 for making changes to the workflow.
-   **Controls**:
    -   **"Regenerate" Button**: Discards the current workflow and re-triggers LLM Agent 1 with the original chat transcript to produce a fresh workflow.
    -   **"Save Workflow" Button**: Triggers LLM Agent 3 to process the current state of the workflow (from the preview pane) and save it.
    -   **(Implicit) "Cancel/Close" Button**: Allows the user to exit the workflow creation process.

### 2.3. Locked Workflow Template File

-   **Purpose**: Defines the standardized, canonical schema for all saved custom workflows in TanukiMCP Atlas. This ensures consistency, reliability, and machine-readability.
-   **Format**: Likely JSON Schema or a similar schema definition language, stored in a file that is treated as read-only by the application (e.g., `src/core/workflow-template.schema.json`).
-   **Content**: The schema will define fields such as:
    -   `workflowId`: Unique identifier.
    -   `name`: User-defined name for the workflow.
    -   `description`: User-defined description.
    -   `triggerPhrase`: Optional phrase for quick invocation (e.g., for "@" functionality).
    -   `tags`: Array of strings for categorization.
    -   `version`: Version number.
    -   `createdAt`, `updatedAt`: Timestamps.
    -   `steps`: An ordered array of workflow steps. Each step would include:
        -   `stepId`: Unique identifier for the step.
        -   `name`: Name of the step.
        -   `description`: Description of the step's purpose.
        -   `toolCalls`: Array of tool call definitions (tool name, parameters).
        -   `inputs`: Expected inputs for the step.
        -   `outputs`: Outputs produced by the step.
        -   `onSuccess`: Next step ID or end.
        -   `onError`: Error handling strategy or next step ID.
        -   `visualisation`: (Optional) Hints for ASCII art representation.
    -   `parameters`: Array of global parameters the workflow accepts.
-   **Enforcement**: LLM Agent 3 is solely responsible for ensuring that any workflow saved to the system strictly conforms to this template.

### 2.4. Workflow Storage System

-   This is the existing or an enhanced system responsible for persisting the structured workflow data generated by LLM Agent 3.
-   It must allow for efficient querying and retrieval of workflows, especially for the "@" tool integration.

### 2.5. @ Tool Integration Layer

-   The existing "@" tool call functionality needs to be extended.
-   When a user types "@", the system should search not only for built-in tools but also for saved custom workflows.
-   Executing a custom workflow via "@" involves retrieving its structured data from the Workflow Storage System and initiating its execution, potentially prompting the user for any defined global parameters.

## 3. Data Flow & User Interaction

1.  User has a chat conversation and decides to save it as a workflow. They click a "Save Custom Workflow" button (e.g., in the chat menu or message context menu).
2.  The chat transcript is sent to **LLM Agent 1 (Workflow Synthesizer & Visualizer)**.
3.  LLM Agent 1 processes the chat and returns an ASCII Markdown visualization of the inferred workflow.
4.  The **Workflow Preview & Editing UI** displays this Markdown visualization.
5.  The user can:
    a.  **Directly edit the Markdown** in the preview pane. These edits need to be captured and made available to LLM Agent 2 if further chat-based refinement is requested, or to LLM Agent 3 if "Save Workflow" is clicked directly.
    b.  Use the **Refinement Chat Interface** to send natural language edit requests to **LLM Agent 2 (Workflow Refinement)**. LLM Agent 2 updates the Markdown visualization and underlying structure in the preview pane.
    c.  Click the **"Regenerate" Button**, which discards changes and sends the original chat transcript back to LLM Agent 1.
6.  Once satisfied, the user clicks the **"Save Workflow" Button**.
7.  The current state of the workflow (Markdown and/or its interpreted structure) from the preview pane is sent to the hidden **LLM Agent 3 (Workflow Finalizer & Templater)**.
8.  LLM Agent 3 parses this input, validates it, and meticulously populates the **Locked Workflow Template**.
9.  The resulting structured workflow data (conforming to the template) is sent to the **Workflow Storage System**.
10. The saved workflow becomes available for invocation via the **@ Tool Integration Layer**.

## 4. Technical Considerations

-   **LLM Prompt Engineering**: Crafting robust, precise, and secure system prompts and operator profiles for each of the three LLM agents is paramount. These prompts must guide the LLMs to perform their specialized tasks reliably and to production quality.
-   **State Management**: The Workflow Preview & Editing UI needs to manage the state of the workflow as it's being edited (both through direct manipulation of Markdown and through LLM Agent 2).
-   **Markdown Parsing & Two-Way Binding**: If users directly edit the ASCII Markdown, the system needs a way to parse these changes and reflect them in an underlying structural representation that LLMs can work with, and vice-versa. This is a non-trivial challenge. An alternative could be that direct markdown edits are primarily for visual tweaks, and structural changes are encouraged via LLM Agent 2. However, the request implies direct editing of the workflow structure via markdown.
-   **Error Handling**: Robust error handling is needed throughout the process (e.g., if an LLM fails to generate a valid workflow, if user edits break the workflow structure).
-   **Performance**: LLM interactions can be latent. The UI should provide appropriate feedback (loading states, progress indicators).
-   **Security**: Ensure that LLM interactions, especially those involving tool calls within workflows, are secure and respect user permissions.
-   **Scalability**: The workflow storage and retrieval system should be designed to handle a large number of custom workflows.

This intelligent workflow generation system aims to provide a powerful yet user-friendly way for TanukiMCP Atlas users to automate their common tasks by transforming conversations into actionable, reusable workflows. 