import { SubjectMode } from '../types';

export class SubjectModeManager {
  private currentMode: SubjectMode;
  private availableModes: Map<string, SubjectMode>;

  constructor() {
    this.initializeModes();
    this.currentMode = this.availableModes.get('general')!;
  }

  private initializeModes(): void {
    this.availableModes = new Map([
      ['mathematics', {
        id: 'mathematics',
        name: 'Mathematics Mode',
        description: 'Advanced mathematical problem-solving and computation',
        enabledTools: [
          'solve_equation', 'plot_function', 'calculate_integral', 
          'solve_system', 'analyze_function', 'read_file', 'write_file'
        ],
        prompts: {
          systemPrompt: 'You are a mathematics expert assistant with access to computational tools. Solve problems step-by-step and use visualizations when helpful.',
          exampleQueries: [
            'Solve the quadratic equation x² + 5x + 6 = 0',
            'Plot the function f(x) = sin(x) + cos(2x)',
            'Find the integral of x² + 3x + 2'
          ],
          helpText: 'Ask mathematical questions, request equation solving, or generate plots and visualizations.'
        },
        context: {
          specializations: ['algebra', 'calculus', 'statistics', 'geometry'],
          tools: ['wolfram', 'sympy', 'matplotlib', 'numpy']
        }
      }]
    ]);
    
    this.availableModes.set('science', {
      id: 'science',
      name: 'Science Mode',
      description: 'Physics, chemistry, and biology problem-solving',
      enabledTools: [
        'chemistry_balance', 'physics_simulation', 'unit_conversion',
        'periodic_table', 'molecular_structure', 'read_file', 'write_file'
      ],
      prompts: {
        systemPrompt: 'You are a science expert with specialized tools for physics, chemistry, and biology. Provide detailed explanations and use simulations when appropriate.',
        exampleQueries: [
          'Balance the chemical equation: H₂ + O₂ → H₂O',
          'Simulate projectile motion with initial velocity 30 m/s at 45°',
          'Show the molecular structure of caffeine'
        ],
        helpText: 'Ask science questions, request chemical equation balancing, or run physics simulations.'
      },
      context: {
        specializations: ['physics', 'chemistry', 'biology', 'earth-science'],
        tools: ['chem-balance', 'physics-engine', 'molecular-viewer']
      }
    });

    this.availableModes.set('programming', {
      id: 'programming',
      name: 'Programming Mode',
      description: 'Code analysis, testing, and development assistance',
      enabledTools: [
        'analyze_code', 'generate_tests', 'refactor_code', 'debug_code',
        'code_review', 'read_file', 'write_file', 'edit_block', 'search_files'
      ],
      prompts: {
        systemPrompt: 'You are a programming expert with code analysis and generation tools. Help with coding tasks, debugging, and best practices.',
        exampleQueries: [
          'Analyze the complexity of this function',
          'Generate unit tests for my calculator class',
          'Review this code for security issues'
        ],
        helpText: 'Request code analysis, test generation, debugging help, or code reviews.'
      },
      context: {
        specializations: ['analysis', 'testing', 'debugging', 'refactoring', 'security'],
        tools: ['static-analysis', 'test-generators', 'linters', 'formatters']
      }
    });

    this.availableModes.set('general', {
      id: 'general',
      name: 'General Mode',
      description: 'General-purpose assistant with all tools available',
      enabledTools: ['read_file', 'write_file', 'edit_block', 'search_files', 'create_todolist'],
      prompts: {
        systemPrompt: 'You are a helpful AI assistant with access to various tools.',
        exampleQueries: ['Help me with my project', 'Create a todo list', 'Search for files'],
        helpText: 'Ask any question or request help with various tasks.'
      },
      context: {
        specializations: ['general'],
        tools: ['all']
      }
    });
  }  async switchMode(modeId: string): Promise<void> {
    if (this.availableModes.has(modeId)) {
      this.currentMode = this.availableModes.get(modeId)!;
      await this.saveUserModePreference(modeId);
      await this.updateToolAvailability();
    } else {
      throw new Error(`Unknown subject mode: ${modeId}`);
    }
  }

  getCurrentMode(): SubjectMode {
    return this.currentMode;
  }

  getAvailableModes(): SubjectMode[] {
    return Array.from(this.availableModes.values());
  }

  private async saveUserModePreference(modeId: string): Promise<void> {
    // Would save to database in real implementation
    console.log(`Switched to mode: ${modeId}`);
  }

  private async updateToolAvailability(): Promise<void> {
    // Would update tool visibility in real implementation
    console.log(`Updated tools for mode: ${this.currentMode.id}`);
  }
}