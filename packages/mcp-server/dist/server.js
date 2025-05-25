"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server.ts
var server_exports = {};
__export(server_exports, {
  TanukiMCPServer: () => TanukiMCPServer,
  server: () => server
});
module.exports = __toCommonJS(server_exports);
var import_server = require("@modelcontextprotocol/sdk/server/index.js");

// src/tools/core/file-operations.ts
var import_promises = __toESM(require("fs/promises"));
var import_path2 = __toESM(require("path"));

// src/security/path-validator.ts
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var PathValidator = class {
  securityContext;
  constructor(securityContext) {
    this.securityContext = securityContext;
  }
  validatePath(filePath) {
    try {
      const normalizedPath = import_path.default.resolve(filePath);
      if (this.hasPathTraversal(filePath)) {
        return { valid: false, error: "Path traversal detected" };
      }
      if (this.isDeniedPath(normalizedPath)) {
        return { valid: false, error: "Access denied" };
      }
      if (this.securityContext.allowedPaths.length > 0) {
        if (!this.isAllowedPath(normalizedPath)) {
          return { valid: false, error: "Path not allowed" };
        }
      }
      if (import_fs.default.existsSync(normalizedPath)) {
        const stats = import_fs.default.statSync(normalizedPath);
        if (stats.size > this.securityContext.maxFileSize) {
          return { valid: false, error: "File too large" };
        }
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error: `Validation error: ${error.message}` };
    }
  }
  hasPathTraversal(filePath) {
    const dangerous = ["../", "..\\", "/../", "\\..\\"];
    return dangerous.some((pattern) => filePath.includes(pattern));
  }
  isDeniedPath(normalizedPath) {
    return this.securityContext.deniedPaths.some(
      (deniedPath) => normalizedPath.startsWith(import_path.default.resolve(deniedPath))
    );
  }
  isAllowedPath(normalizedPath) {
    return this.securityContext.allowedPaths.some(
      (allowedPath) => normalizedPath.startsWith(import_path.default.resolve(allowedPath))
    );
  }
  validateOperation(operation) {
    return this.securityContext.allowedOperations.includes(operation);
  }
  createSecureContext(projectPath) {
    return {
      allowedPaths: [projectPath],
      deniedPaths: [
        "/system",
        "/windows",
        "/etc",
        "/root",
        "/usr/bin"
      ],
      maxFileSize: 10 * 1024 * 1024,
      // 10MB
      allowedOperations: ["read", "write", "create", "list"],
      sandboxMode: true
    };
  }
};

// src/tools/core/file-operations.ts
var CoreFileOperations = class {
  pathValidator;
  constructor() {
    this.pathValidator = new PathValidator({
      allowedPaths: [],
      deniedPaths: ["/system", "/windows", "/etc"],
      maxFileSize: 10 * 1024 * 1024,
      allowedOperations: ["read", "write", "create", "list"],
      sandboxMode: true
    });
  }
  async readFile(params) {
    try {
      const validation = this.pathValidator.validatePath(params.path);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      const content = await import_promises.default.readFile(params.path, {
        encoding: params.encoding || "utf8"
      });
      if (params.offset !== void 0 || params.length !== void 0) {
        const lines = content.split("\n");
        const start = params.offset || 0;
        const end = params.length ? start + params.length : lines.length;
        const selectedLines = lines.slice(start, end);
        return {
          success: true,
          result: {
            content: selectedLines.join("\n"),
            totalLines: lines.length,
            readLines: selectedLines.length
          }
        };
      }
      return {
        success: true,
        result: { content, size: content.length, lines: content.split("\n").length }
      };
    } catch (error) {
      return { success: false, error: `Failed to read file: ${error.message}` };
    }
  }
  async writeFile(params) {
    try {
      const validation = this.pathValidator.validatePath(params.path);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      if (params.createDirs) {
        const dir = import_path2.default.dirname(params.path);
        await import_promises.default.mkdir(dir, { recursive: true });
      }
      if (params.mode === "append") {
        await import_promises.default.appendFile(params.path, params.content);
      } else {
        await import_promises.default.writeFile(params.path, params.content);
      }
      return {
        success: true,
        result: {
          path: params.path,
          size: params.content.length,
          mode: params.mode || "write"
        }
      };
    } catch (error) {
      return { success: false, error: `Failed to write file: ${error.message}` };
    }
  }
  async editBlock(params) {
    try {
      const validation = this.pathValidator.validatePath(params.path);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      const content = await import_promises.default.readFile(params.path, "utf8");
      const matches = (content.match(new RegExp(params.oldContent, "g")) || []).length;
      if (params.expectedMatches && matches !== params.expectedMatches) {
        return {
          success: false,
          error: `Expected ${params.expectedMatches} matches, found ${matches}`
        };
      }
      const newContent = content.replace(params.oldContent, params.newContent);
      await import_promises.default.writeFile(params.path, newContent);
      return {
        success: true,
        result: {
          path: params.path,
          matchesFound: matches,
          replaced: matches > 0
        }
      };
    } catch (error) {
      return { success: false, error: `Failed to edit file: ${error.message}` };
    }
  }
  async searchFiles(params) {
    try {
      const validation = this.pathValidator.validatePath(params.directory);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      const results = [];
      await this.searchRecursive(params.directory, params.pattern, results, params.fileTypes);
      return {
        success: true,
        result: {
          matches: results,
          totalMatches: results.length
        }
      };
    } catch (error) {
      return { success: false, error: `Search failed: ${error.message}` };
    }
  }
};

// src/tools/core/task-management.ts
var TaskManagement = class {
  async createTodoList(params) {
    try {
      const tasks = await this.parseRequirementsIntoTasks(params.requirements);
      const todoList = {
        id: this.generateId(),
        title: params.title,
        description: params.description,
        projectPath: params.projectPath,
        tasks,
        metadata: {
          totalTasks: tasks.length,
          completedTasks: 0,
          progressPercentage: 0,
          estimatedTotalTime: tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0),
          actualTimeSpent: 0,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }
      };
      return {
        success: true,
        result: {
          todoList,
          summary: {
            totalTasks: tasks.length,
            phases: this.groupTasksByPhase(tasks),
            estimatedTime: todoList.metadata.estimatedTotalTime
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create todo list: ${error.message}`
      };
    }
  }
  async parseRequirementsIntoTasks(requirements) {
    const tasks = [];
    const lines = requirements.split("\n").filter((line) => line.trim());
    let currentPhase = "General";
    let taskCounter = 1;
    for (const line of lines) {
      const trimmed = line.trim();
      if (this.isPhaseHeader(trimmed)) {
        currentPhase = this.extractPhaseTitle(trimmed);
        continue;
      }
      if (this.isTaskItem(trimmed)) {
        const task = this.parseTaskFromLine(trimmed, currentPhase, taskCounter++);
        tasks.push(task);
      }
    }
    return tasks;
  }
  isPhaseHeader(line) {
    return /^#{1,3}\s+/.test(line) || /^Phase\s+\d+/i.test(line);
  }
  extractPhaseTitle(line) {
    return line.replace(/^#{1,3}\s+/, "").replace(/^Phase\s+\d+:\s*/i, "");
  }
  isTaskItem(line) {
    return /^[-*+]\s+/.test(line) || /^\d+\.\s+/.test(line);
  }
  parseTaskFromLine(line, phase, counter) {
    const taskText = line.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, "");
    const priority = this.detectPriority(taskText);
    const estimatedTime = this.estimateTaskTime(taskText);
    return {
      id: `task-${counter}`,
      title: taskText,
      status: "pending",
      priority,
      estimatedTime,
      tags: [phase.toLowerCase()],
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
  detectPriority(text) {
    if (/critical|urgent|must|required/i.test(text))
      return "critical";
    if (/important|should|high/i.test(text))
      return "high";
    if (/could|nice|optional/i.test(text))
      return "low";
    return "medium";
  }
  estimateTaskTime(text) {
    const wordCount = text.split(" ").length;
    if (wordCount < 5)
      return 30;
    if (wordCount < 10)
      return 60;
    if (wordCount < 20)
      return 120;
    return 240;
  }
  generateId() {
    return "todo-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  }
  groupTasksByPhase(tasks) {
    const phases = {};
    tasks.forEach((task) => {
      const phase = task.tags?.[0] || "general";
      if (!phases[phase]) {
        phases[phase] = [];
      }
      phases[phase].push(task);
    });
    return phases;
  }
};

// src/tools/subjects/mathematics.ts
var MathematicsTools = class {
  async solveEquation(params) {
    try {
      const solution = this.performAlgebraicSolution(params.equation);
      return {
        success: true,
        result: {
          equation: params.equation,
          solution: solution.result,
          steps: params.showSteps ? solution.steps : void 0,
          variables: solution.variables,
          format: params.outputFormat || "text"
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to solve equation: ${error.message}`
      };
    }
  }
  async plotFunction(params) {
    try {
      const plotData = await this.generatePlot(params);
      return {
        success: true,
        result: {
          function: params.function,
          plotData,
          outputPath: params.outputPath,
          range: {
            x: params.xRange || [-10, 10],
            y: params.yRange || "auto"
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to plot function: ${error.message}`
      };
    }
  }
  performAlgebraicSolution(equation) {
    return {
      result: "x = simplified solution",
      steps: ["Step 1: Parse equation", "Step 2: Apply algebraic rules", "Step 3: Solve"],
      variables: ["x"]
    };
  }
  async generatePlot(params) {
    const xRange = params.xRange || [-10, 10];
    const resolution = params.resolution || 100;
    const x = [];
    const y = [];
    for (let i = 0; i <= resolution; i++) {
      const xVal = xRange[0] + (xRange[1] - xRange[0]) * (i / resolution);
      x.push(xVal);
      y.push(Math.sin(xVal));
    }
    return {
      x,
      y,
      type: "line",
      title: params.function
    };
  }
  async calculateIntegral(params) {
    return {
      success: true,
      result: { integral: "Integration result placeholder" }
    };
  }
  async analyzeFunction(params) {
    return {
      success: true,
      result: { analysis: "Function analysis placeholder" }
    };
  }
};

// src/tools/subjects/science.ts
var ScienceTools = class {
  async balanceEquation(params) {
    try {
      const balanced = this.performChemicalBalancing(params.equation);
      return {
        success: true,
        result: {
          originalEquation: params.equation,
          balancedEquation: balanced.equation,
          coefficients: balanced.coefficients,
          steps: params.showSteps ? balanced.steps : void 0,
          massCalculation: params.calculateMass ? balanced.masses : void 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to balance equation: ${error.message}`
      };
    }
  }
  async runSimulation(params) {
    try {
      const simulation = await this.executeSimulation(params);
      return {
        success: true,
        result: {
          simulationType: params.simulationType,
          parameters: params.parameters,
          results: simulation.data,
          visualization: simulation.visualization,
          analysis: simulation.analysis
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Simulation failed: ${error.message}`
      };
    }
  }
  performChemicalBalancing(equation) {
    return {
      equation: equation + " (balanced)",
      coefficients: [1, 1, 1],
      steps: ["Parse reactants and products", "Apply conservation laws", "Solve coefficient system"],
      masses: { reactants: "100g", products: "100g" }
    };
  }
  async executeSimulation(params) {
    return {
      data: { time: [0, 1, 2], values: [0, 5, 10] },
      visualization: "simulation_plot.png",
      analysis: "Simulation completed successfully"
    };
  }
  async unitConversion(params) {
    return {
      success: true,
      result: {
        originalValue: params.value,
        convertedValue: params.value * 1,
        // placeholder conversion
        fromUnit: params.fromUnit,
        toUnit: params.toUnit
      }
    };
  }
};

// src/tools/subjects/programming.ts
var import_promises2 = __toESM(require("fs/promises"));
var import_path3 = __toESM(require("path"));
var ProgrammingTools = class {
  async analyzeCode(params) {
    try {
      const code = await import_promises2.default.readFile(params.filePath, "utf8");
      const language = params.language || this.detectLanguage(params.filePath);
      const analysis = {
        complexity: this.calculateComplexity(code),
        structure: this.analyzeStructure(code, language),
        quality: this.assessQuality(code, language),
        security: this.checkSecurity(code, language),
        performance: this.analyzePerformance(code, language)
      };
      return {
        success: true,
        result: {
          filePath: params.filePath,
          language,
          analysis,
          suggestions: this.generateSuggestions(analysis)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Code analysis failed: ${error.message}`
      };
    }
  }
  async generateTests(params) {
    try {
      const code = await import_promises2.default.readFile(params.filePath, "utf8");
      const functions = params.functions || this.extractFunctions(code);
      const tests = await this.createTestSuite(code, functions, params.framework || "jest");
      return {
        success: true,
        result: {
          testCode: tests.code,
          testCount: tests.count,
          coverage: tests.coverage,
          framework: params.framework || "jest"
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Test generation failed: ${error.message}`
      };
    }
  }
  detectLanguage(filePath) {
    const ext = import_path3.default.extname(filePath);
    const langMap = {
      ".js": "javascript",
      ".ts": "typescript",
      ".py": "python",
      ".java": "java",
      ".cpp": "cpp",
      ".c": "c"
    };
    return langMap[ext] || "unknown";
  }
  calculateComplexity(code) {
    const lines = code.split("\n").length;
    const functions = (code.match(/function|def |class /g) || []).length;
    return {
      linesOfCode: lines,
      functions,
      cyclomaticComplexity: Math.floor(functions * 1.5)
      // simplified
    };
  }
  analyzeStructure(code, language) {
    return {
      classes: (code.match(/class /g) || []).length,
      functions: (code.match(/function|def /g) || []).length,
      imports: (code.match(/import |require\(/g) || []).length
    };
  }
  assessQuality(code, language) {
    return { score: 85, issues: [] };
  }
  checkSecurity(code, language) {
    return { vulnerabilities: [], riskLevel: "low" };
  }
  analyzePerformance(code, language) {
    return { optimizations: [], performanceScore: 90 };
  }
  generateSuggestions(analysis) {
    return ["Consider adding documentation", "Optimize performance-critical sections"];
  }
  extractFunctions(code) {
    const functionMatches = code.match(/function\s+(\w+)|def\s+(\w+)|class\s+(\w+)/g) || [];
    return functionMatches.map((match) => match.split(/\s+/)[1]).filter(Boolean);
  }
  async createTestSuite(code, functions, framework) {
    return {
      code: `// Test suite for ${functions.join(", ")}
// Generated for ${framework}`,
      count: functions.length * 2,
      // Assuming 2 tests per function
      coverage: 85
    };
  }
};

// src/tools/subjects/languages.ts
var LanguageTools = class {
  async translateText(params) {
    try {
      const translation = await this.performTranslation(params);
      return {
        success: true,
        result: {
          originalText: params.text,
          translatedText: translation.text,
          fromLanguage: params.fromLanguage || "auto",
          toLanguage: params.toLanguage,
          confidence: translation.confidence,
          context: params.includeContext ? translation.context : void 0,
          cultural: params.includeCultural ? translation.cultural : void 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Translation failed: ${error.message}`
      };
    }
  }
  async checkGrammar(params) {
    try {
      const analysis = await this.performGrammarCheck(params);
      return {
        success: true,
        result: {
          originalText: params.text,
          corrections: analysis.corrections,
          suggestions: analysis.suggestions,
          score: analysis.score,
          issues: analysis.issues
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Grammar check failed: ${error.message}`
      };
    }
  }
  async performTranslation(params) {
    return {
      text: `[Translated: ${params.text}]`,
      confidence: 0.95,
      context: "General translation context",
      cultural: "Cultural notes would appear here"
    };
  }
  async performGrammarCheck(params) {
    return {
      corrections: [
        { position: 10, original: "there", suggestion: "their", rule: "homophones" }
      ],
      suggestions: [
        { text: "Consider using active voice", type: "style" }
      ],
      score: 85,
      issues: []
    };
  }
  async pronunciationGuide(params) {
    return {
      success: true,
      result: {
        text: params.text,
        pronunciation: "[pronunciation guide]",
        ipa: params.includeIPA ? "[\u026Ap\u0259]" : void 0
      }
    };
  }
  async vocabularyBuilder(params) {
    return {
      success: true,
      result: {
        word: params.word,
        definition: "Word definition",
        examples: params.includeExamples ? ["Example sentence 1", "Example sentence 2"] : void 0,
        synonyms: ["synonym1", "synonym2"],
        etymology: "Word origin information"
      }
    };
  }
};

// src/tools/subjects/research.ts
var ResearchTools = class {
  async webSearch(params) {
    try {
      const results = await this.performWebSearch(params);
      return {
        success: true,
        result: {
          query: params.query,
          results: results.items,
          totalResults: results.total,
          searchType: params.searchType || "general",
          executionTime: results.executionTime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Web search failed: ${error.message}`
      };
    }
  }
  async performWebSearch(params) {
    return {
      items: [
        {
          title: "Search result title",
          url: "https://example.com",
          snippet: "Search result snippet",
          source: "example.com"
        }
      ],
      total: 1,
      executionTime: 150
    };
  }
  async citationGenerator(params) {
    return {
      success: true,
      result: {
        citation: `Citation in ${params.style} format for ${params.url}`,
        style: params.style
      }
    };
  }
  async summarizeArticle(params) {
    return {
      success: true,
      result: {
        summary: "Article summary would appear here",
        keyPoints: ["Point 1", "Point 2", "Point 3"],
        wordCount: params.maxLength || 200
      }
    };
  }
};

// src/modes/subject-mode-manager.ts
var SubjectModeManager = class {
  currentMode;
  availableModes;
  constructor() {
    this.initializeModes();
    this.currentMode = this.availableModes.get("general");
  }
  initializeModes() {
    this.availableModes = /* @__PURE__ */ new Map([
      ["mathematics", {
        id: "mathematics",
        name: "Mathematics Mode",
        description: "Advanced mathematical problem-solving and computation",
        enabledTools: [
          "solve_equation",
          "plot_function",
          "calculate_integral",
          "solve_system",
          "analyze_function",
          "read_file",
          "write_file"
        ],
        prompts: {
          systemPrompt: "You are a mathematics expert assistant with access to computational tools. Solve problems step-by-step and use visualizations when helpful.",
          exampleQueries: [
            "Solve the quadratic equation x\xB2 + 5x + 6 = 0",
            "Plot the function f(x) = sin(x) + cos(2x)",
            "Find the integral of x\xB2 + 3x + 2"
          ],
          helpText: "Ask mathematical questions, request equation solving, or generate plots and visualizations."
        },
        context: {
          specializations: ["algebra", "calculus", "statistics", "geometry"],
          tools: ["wolfram", "sympy", "matplotlib", "numpy"]
        }
      }]
    ]);
    this.availableModes.set("science", {
      id: "science",
      name: "Science Mode",
      description: "Physics, chemistry, and biology problem-solving",
      enabledTools: [
        "chemistry_balance",
        "physics_simulation",
        "unit_conversion",
        "periodic_table",
        "molecular_structure",
        "read_file",
        "write_file"
      ],
      prompts: {
        systemPrompt: "You are a science expert with specialized tools for physics, chemistry, and biology. Provide detailed explanations and use simulations when appropriate.",
        exampleQueries: [
          "Balance the chemical equation: H\u2082 + O\u2082 \u2192 H\u2082O",
          "Simulate projectile motion with initial velocity 30 m/s at 45\xB0",
          "Show the molecular structure of caffeine"
        ],
        helpText: "Ask science questions, request chemical equation balancing, or run physics simulations."
      },
      context: {
        specializations: ["physics", "chemistry", "biology", "earth-science"],
        tools: ["chem-balance", "physics-engine", "molecular-viewer"]
      }
    });
    this.availableModes.set("programming", {
      id: "programming",
      name: "Programming Mode",
      description: "Code analysis, testing, and development assistance",
      enabledTools: [
        "analyze_code",
        "generate_tests",
        "refactor_code",
        "debug_code",
        "code_review",
        "read_file",
        "write_file",
        "edit_block",
        "search_files"
      ],
      prompts: {
        systemPrompt: "You are a programming expert with code analysis and generation tools. Help with coding tasks, debugging, and best practices.",
        exampleQueries: [
          "Analyze the complexity of this function",
          "Generate unit tests for my calculator class",
          "Review this code for security issues"
        ],
        helpText: "Request code analysis, test generation, debugging help, or code reviews."
      },
      context: {
        specializations: ["analysis", "testing", "debugging", "refactoring", "security"],
        tools: ["static-analysis", "test-generators", "linters", "formatters"]
      }
    });
    this.availableModes.set("general", {
      id: "general",
      name: "General Mode",
      description: "General-purpose assistant with all tools available",
      enabledTools: ["read_file", "write_file", "edit_block", "search_files", "create_todolist"],
      prompts: {
        systemPrompt: "You are a helpful AI assistant with access to various tools.",
        exampleQueries: ["Help me with my project", "Create a todo list", "Search for files"],
        helpText: "Ask any question or request help with various tasks."
      },
      context: {
        specializations: ["general"],
        tools: ["all"]
      }
    });
  }
  async switchMode(modeId) {
    if (this.availableModes.has(modeId)) {
      this.currentMode = this.availableModes.get(modeId);
      await this.saveUserModePreference(modeId);
      await this.updateToolAvailability();
    } else {
      throw new Error(`Unknown subject mode: ${modeId}`);
    }
  }
  getCurrentMode() {
    return this.currentMode;
  }
  getAvailableModes() {
    return Array.from(this.availableModes.values());
  }
  async saveUserModePreference(modeId) {
    console.log(`Switched to mode: ${modeId}`);
  }
  async updateToolAvailability() {
    console.log(`Updated tools for mode: ${this.currentMode.id}`);
  }
};

// src/server.ts
var TanukiMCPServer = class extends import_server.Server {
  subjectModeManager;
  fileOps;
  taskMgmt;
  mathTools;
  scienceTools;
  programmingTools;
  languageTools;
  researchTools;
  constructor() {
    super({
      name: "tanukimcp-builtin-server",
      version: "1.0.0"
    }, {
      capabilities: {
        tools: {},
        resources: {}
      }
    });
    this.initializeTools();
    this.subjectModeManager = new SubjectModeManager();
    this.registerAllTools();
  }
  initializeTools() {
    this.fileOps = new CoreFileOperations();
    this.taskMgmt = new TaskManagement();
    this.mathTools = new MathematicsTools();
    this.scienceTools = new ScienceTools();
    this.programmingTools = new ProgrammingTools();
    this.languageTools = new LanguageTools();
    this.researchTools = new ResearchTools();
  }
  registerAllTools() {
    this.registerCoreTools();
    this.registerSubjectTools();
    this.registerCRUDTools();
    this.registerWorkflowTools();
  }
  registerCoreTools() {
    this.addTool({
      name: "read_file",
      description: "Read file contents with pagination support",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path to read" },
          offset: { type: "number", description: "Start line (0-indexed)" },
          length: { type: "number", description: "Number of lines to read" },
          encoding: { type: "string", default: "utf8" }
        },
        required: ["path"]
      },
      handler: this.fileOps.readFile.bind(this.fileOps)
    });
    this.addTool({
      name: "write_file",
      description: "Write or append to files with safety checks",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path to write" },
          content: { type: "string", description: "Content to write" },
          mode: { type: "string", enum: ["write", "append"], default: "write" },
          createDirs: { type: "boolean", default: true }
        },
        required: ["path", "content"]
      },
      handler: this.fileOps.writeFile.bind(this.fileOps)
    });
    this.addTool({
      name: "edit_block",
      description: "Make surgical edits to files",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path to edit" },
          oldContent: { type: "string", description: "Content to replace" },
          newContent: { type: "string", description: "New content" },
          expectedMatches: { type: "number", default: 1 }
        },
        required: ["path", "oldContent", "newContent"]
      },
      handler: this.fileOps.editBlock.bind(this.fileOps)
    });
    this.addTool({
      name: "create_todolist",
      description: "Create structured todo lists from complex requests",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Todo list title" },
          description: { type: "string", description: "Project description" },
          requirements: { type: "string", description: "Detailed requirements" },
          projectPath: { type: "string", description: "Project directory path" }
        },
        required: ["title", "requirements"]
      },
      handler: this.taskMgmt.createTodoList.bind(this.taskMgmt)
    });
  }
  registerSubjectTools() {
    this.addTool({
      name: "solve_equation",
      description: "Solve mathematical equations and show step-by-step solutions",
      inputSchema: {
        type: "object",
        properties: {
          equation: { type: "string", description: "Mathematical equation to solve" },
          variables: { type: "array", items: { type: "string" } },
          showSteps: { type: "boolean", default: true },
          outputFormat: { type: "string", enum: ["text", "latex", "ascii"], default: "text" }
        },
        required: ["equation"]
      },
      handler: this.mathTools.solveEquation.bind(this.mathTools)
    });
    this.addTool({
      name: "plot_function",
      description: "Generate mathematical plots and visualizations",
      inputSchema: {
        type: "object",
        properties: {
          function: { type: "string", description: 'Function to plot (e.g., "x^2 + 2*x + 1")' },
          xRange: { type: "array", items: { type: "number" }, description: "X-axis range [min, max]" },
          yRange: { type: "array", items: { type: "number" }, description: "Y-axis range [min, max]" },
          resolution: { type: "number", default: 100 },
          outputPath: { type: "string", description: "Where to save the plot" }
        },
        required: ["function"]
      },
      handler: this.mathTools.plotFunction.bind(this.mathTools)
    });
    this.addTool({
      name: "chemistry_balance",
      description: "Balance chemical equations and calculate stoichiometry",
      inputSchema: {
        type: "object",
        properties: {
          equation: { type: "string", description: "Chemical equation to balance" },
          showSteps: { type: "boolean", default: true },
          calculateMass: { type: "boolean", default: false }
        },
        required: ["equation"]
      },
      handler: this.scienceTools.balanceEquation.bind(this.scienceTools)
    });
    this.addTool({
      name: "analyze_code",
      description: "Analyze code structure, complexity, and quality",
      inputSchema: {
        type: "object",
        properties: {
          filePath: { type: "string", description: "Path to code file" },
          analysisType: {
            type: "array",
            items: { type: "string", enum: ["complexity", "structure", "quality", "security", "performance"] },
            default: ["complexity", "quality"]
          },
          language: { type: "string", description: "Programming language (auto-detected if not specified)" }
        },
        required: ["filePath"]
      },
      handler: this.programmingTools.analyzeCode.bind(this.programmingTools)
    });
  }
  registerCRUDTools() {
    this.addTool({
      name: "create_project",
      description: "Create new project with template structure",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Project name" },
          template: { type: "string", enum: ["react", "node", "python", "custom"], default: "custom" },
          path: { type: "string", description: "Project directory path" },
          features: { type: "array", items: { type: "string" }, description: "Additional features to include" }
        },
        required: ["name", "path"]
      },
      handler: this.createProject.bind(this)
    });
    this.addTool({
      name: "manage_database",
      description: "Perform database operations (CRUD)",
      inputSchema: {
        type: "object",
        properties: {
          operation: { type: "string", enum: ["create", "read", "update", "delete", "query"] },
          table: { type: "string", description: "Database table name" },
          data: { type: "object", description: "Data for operation" },
          conditions: { type: "object", description: "Query conditions" }
        },
        required: ["operation", "table"]
      },
      handler: this.manageDatabaseOperation.bind(this)
    });
  }
  registerWorkflowTools() {
    this.addTool({
      name: "execute_workflow",
      description: "Execute a saved workflow with parameters",
      inputSchema: {
        type: "object",
        properties: {
          workflowId: { type: "string", description: "Workflow ID or name" },
          parameters: { type: "object", description: "Workflow parameters" },
          preview: { type: "boolean", description: "Preview mode (dry run)", default: false }
        },
        required: ["workflowId"]
      },
      handler: this.executeWorkflow.bind(this)
    });
    this.addTool({
      name: "save_chat_as_workflow",
      description: "Convert current chat into reusable workflow",
      inputSchema: {
        type: "object",
        properties: {
          chatId: { type: "string", description: "Chat session ID" },
          workflowName: { type: "string", description: "Name for the workflow" },
          description: { type: "string", description: "Workflow description" },
          category: { type: "string", description: "Workflow category" },
          startMessage: { type: "string", description: "Starting message ID" },
          endMessage: { type: "string", description: "Ending message ID" }
        },
        required: ["chatId", "workflowName"]
      },
      handler: this.saveChatAsWorkflow.bind(this)
    });
  }
  async switchSubjectMode(mode) {
    await this.subjectModeManager.switchMode(mode);
    this.updateAvailableTools();
  }
  updateAvailableTools() {
    const currentMode = this.subjectModeManager.getCurrentMode();
    console.log(`Updated tools for mode: ${currentMode.id}`);
  }
  // Placeholder implementations for workflow and CRUD methods
  async createProject(params) {
    return { success: true, result: { message: "Project creation placeholder" } };
  }
  async manageDatabaseOperation(params) {
    return { success: true, result: { message: "Database operation placeholder" } };
  }
  async executeWorkflow(params) {
    return { success: true, result: { message: "Workflow execution placeholder" } };
  }
  async saveChatAsWorkflow(params) {
    return { success: true, result: { message: "Save workflow placeholder" } };
  }
  // Server lifecycle methods
  async start() {
    console.log("TanukiMCP Server starting...");
    await super.start();
    console.log("TanukiMCP Server started successfully");
  }
  async stop() {
    console.log("TanukiMCP Server stopping...");
    await super.stop();
    console.log("TanukiMCP Server stopped");
  }
};
var server = new TanukiMCPServer();
if (require.main === module) {
  server.start().catch(console.error);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TanukiMCPServer,
  server
});
