# TanukiMCP Built-in Server

This package implements the built-in MCP server for TanukiMCP Atlas with subject-specific tools and enhanced capabilities.

## Features

### Core Tools (Always Available)
- **read_file**: Read file contents with pagination support
- **write_file**: Write or append to files with safety checks  
- **edit_block**: Make surgical edits to files
- **create_todolist**: Create structured todo lists from complex requests
- **search_files**: Search for files and content

### Subject-Specific Tools

#### Mathematics Mode
- **solve_equation**: Solve mathematical equations with step-by-step solutions
- **plot_function**: Generate mathematical plots and visualizations
- **calculate_integral**: Calculate integrals and derivatives
- **analyze_function**: Function analysis and properties

#### Science Mode
- **chemistry_balance**: Balance chemical equations and calculate stoichiometry
- **physics_simulation**: Run physics simulations (projectile, pendulum, wave, circuit)
- **unit_conversion**: Convert between different units
- **periodic_table**: Access periodic table data

#### Programming Mode
- **analyze_code**: Analyze code structure, complexity, and quality
- **generate_tests**: Generate unit tests for code functions
- **refactor_code**: Suggest code refactoring improvements
- **debug_code**: Help debug code issues
- **code_review**: Perform automated code reviews

#### Language Learning Mode
- **translate_text**: Translate text with context and cultural notes
- **grammar_check**: Check grammar, style, and provide suggestions
- **pronunciation_guide**: Get pronunciation help with IPA notation
- **vocabulary_builder**: Build vocabulary with examples and etymology

#### Research Mode
- **web_search**: Search the internet for research and information
- **citation_generator**: Generate citations in various formats
- **summarize_article**: Summarize articles and research papers

### CRUD Operations
- **create_project**: Create new projects with template structures
- **manage_database**: Perform database operations (CRUD)
- **filesystem_crud**: Advanced filesystem management

### Workflow Integration
- **execute_workflow**: Execute saved workflows with parameters
- **save_chat_as_workflow**: Convert chat sessions into reusable workflows

## Architecture

### Security
- Path validation with traversal protection
- Sandbox execution for safe command running
- Configurable allowed/denied paths
- File size limits and operation validation

### Subject Mode Management
- Dynamic tool availability based on current mode
- Context-aware system prompts and examples
- Seamless mode switching during conversations

### Performance
- 100% uptime instant response tools
- Direct IDE file system access
- Optimized for local execution

## Usage

```typescript
import { TanukiMCPServer } from '@tanukimcp/mcp-server';

const server = new TanukiMCPServer();

// Start the server
await server.start();

// Switch to a specific subject mode
await server.switchSubjectMode('mathematics');

// Server automatically registers all tools
// Tools are available via MCP protocol
```

## Development

```bash
# Build the package
npm run build

# Run in development mode
npm run dev

# Type checking
npm run type-check

# Run validation tests
node validation-test.js
```

## Tool Schema

All tools follow the MCP protocol with detailed input schemas. Example:

```json
{
  "name": "solve_equation",
  "description": "Solve mathematical equations and show step-by-step solutions",
  "inputSchema": {
    "type": "object",
    "properties": {
      "equation": {
        "type": "string",
        "description": "Mathematical equation to solve"
      },
      "showSteps": {
        "type": "boolean",
        "default": true
      }
    },
    "required": ["equation"]
  }
}
```

## Integration

This built-in MCP server integrates seamlessly with:
- TanukiMCP Atlas IDE interface
- External MCP client hub (Phase 4)
- Enhanced LLM router (Phase 5)
- Tool router and @ symbol integration (Phase 6)

## Next Phase

Phase 4 will add external MCP client capabilities to connect to additional MCP servers and aggregate tools from multiple sources.