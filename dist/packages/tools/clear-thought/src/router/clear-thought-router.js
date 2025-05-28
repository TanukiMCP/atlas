"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearThoughtRouter = exports.ThinkingCapability = exports.TaskType = void 0;
var TaskType;
(function (TaskType) {
    TaskType["PROBLEM_SOLVING"] = "problem_solving";
    TaskType["DECISION_MAKING"] = "decision_making";
    TaskType["CODE_ANALYSIS"] = "code_analysis";
    TaskType["SYSTEM_DESIGN"] = "system_design";
    TaskType["DEBUGGING"] = "debugging";
    TaskType["RESEARCH"] = "research";
    TaskType["PLANNING"] = "planning";
    TaskType["CREATIVE"] = "creative";
})(TaskType || (exports.TaskType = TaskType = {}));
var ThinkingCapability;
(function (ThinkingCapability) {
    ThinkingCapability["SEQUENTIAL_THINKING"] = "sequential_thinking";
    ThinkingCapability["MENTAL_MODELS"] = "mental_models";
    ThinkingCapability["DESIGN_PATTERNS"] = "design_patterns";
    ThinkingCapability["PROGRAMMING_PARADIGMS"] = "programming_paradigms";
    ThinkingCapability["DEBUGGING_APPROACHES"] = "debugging_approaches";
    ThinkingCapability["COLLABORATIVE_REASONING"] = "collaborative_reasoning";
    ThinkingCapability["DECISION_FRAMEWORK"] = "decision_framework";
    ThinkingCapability["METACOGNITIVE_MONITORING"] = "metacognitive_monitoring";
    ThinkingCapability["SCIENTIFIC_METHOD"] = "scientific_method";
    ThinkingCapability["STRUCTURED_ARGUMENTATION"] = "structured_argumentation";
    ThinkingCapability["VISUAL_REASONING"] = "visual_reasoning";
})(ThinkingCapability || (exports.ThinkingCapability = ThinkingCapability = {}));
class ClearThoughtRouter {
    toolConfigs = new Map();
    constructor() {
        this.initializeToolConfigs();
    }
    initializeToolConfigs() {
        // Tier 3 tools (Moderate complexity)
        this.toolConfigs.set(ThinkingCapability.SEQUENTIAL_THINKING, {
            capability: ThinkingCapability.SEQUENTIAL_THINKING,
            priority: 9,
            minComplexity: 3,
            maxExecutionTime: 30,
            prerequisites: []
        });
        this.toolConfigs.set(ThinkingCapability.MENTAL_MODELS, {
            capability: ThinkingCapability.MENTAL_MODELS,
            priority: 8,
            minComplexity: 3,
            maxExecutionTime: 45,
            prerequisites: []
        });
        this.toolConfigs.set(ThinkingCapability.DESIGN_PATTERNS, {
            capability: ThinkingCapability.DESIGN_PATTERNS,
            priority: 7,
            minComplexity: 4,
            maxExecutionTime: 60,
            prerequisites: []
        });
        this.toolConfigs.set(ThinkingCapability.DEBUGGING_APPROACHES, {
            capability: ThinkingCapability.DEBUGGING_APPROACHES,
            priority: 8,
            minComplexity: 3,
            maxExecutionTime: 45,
            prerequisites: []
        });
        // Tier 4 tools (Complex reasoning)
        this.toolConfigs.set(ThinkingCapability.COLLABORATIVE_REASONING, {
            capability: ThinkingCapability.COLLABORATIVE_REASONING,
            priority: 9,
            minComplexity: 5,
            maxExecutionTime: 120,
            prerequisites: [ThinkingCapability.SEQUENTIAL_THINKING]
        });
        this.toolConfigs.set(ThinkingCapability.DECISION_FRAMEWORK, {
            capability: ThinkingCapability.DECISION_FRAMEWORK,
            priority: 8,
            minComplexity: 5,
            maxExecutionTime: 90,
            prerequisites: [ThinkingCapability.MENTAL_MODELS]
        });
        this.toolConfigs.set(ThinkingCapability.METACOGNITIVE_MONITORING, {
            capability: ThinkingCapability.METACOGNITIVE_MONITORING,
            priority: 7,
            minComplexity: 4,
            maxExecutionTime: 60,
            prerequisites: []
        });
        this.toolConfigs.set(ThinkingCapability.SCIENTIFIC_METHOD, {
            capability: ThinkingCapability.SCIENTIFIC_METHOD,
            priority: 8,
            minComplexity: 5,
            maxExecutionTime: 150,
            prerequisites: [ThinkingCapability.SEQUENTIAL_THINKING]
        });
        this.toolConfigs.set(ThinkingCapability.STRUCTURED_ARGUMENTATION, {
            capability: ThinkingCapability.STRUCTURED_ARGUMENTATION,
            priority: 7,
            minComplexity: 5,
            maxExecutionTime: 90,
            prerequisites: []
        });
        this.toolConfigs.set(ThinkingCapability.VISUAL_REASONING, {
            capability: ThinkingCapability.VISUAL_REASONING,
            priority: 6,
            minComplexity: 4,
            maxExecutionTime: 75,
            prerequisites: []
        });
    }
    /**
     * Analyze a task to determine its complexity and required thinking capabilities
     */
    analyzeTask(taskDescription, context) {
        const analysis = {
            complexity: this.assessComplexity(taskDescription, context),
            type: this.identifyTaskType(taskDescription),
            domain: this.identifyDomain(taskDescription),
            requiredThinking: [],
            estimatedTime: 0,
            riskLevel: 'low'
        };
        analysis.requiredThinking = this.selectThinkingCapabilities(analysis);
        analysis.estimatedTime = this.estimateExecutionTime(analysis.requiredThinking);
        analysis.riskLevel = this.assessRiskLevel(analysis);
        return analysis;
    }
    /**
     * Select appropriate thinking tools for Tier 3 (Moderate) tasks
     */
    selectToolsForTier3(taskAnalysis) {
        const availableTools = [
            ThinkingCapability.SEQUENTIAL_THINKING,
            ThinkingCapability.MENTAL_MODELS,
            ThinkingCapability.DESIGN_PATTERNS,
            ThinkingCapability.PROGRAMMING_PARADIGMS,
            ThinkingCapability.DEBUGGING_APPROACHES
        ];
        return this.filterToolsByComplexity(availableTools, taskAnalysis.complexity, 3, 4);
    }
    /**
     * Get advanced thinking toolset for Tier 4 (Complex) tasks
     */
    getAdvancedToolset(taskAnalysis) {
        const advancedTools = [
            ThinkingCapability.COLLABORATIVE_REASONING,
            ThinkingCapability.DECISION_FRAMEWORK,
            ThinkingCapability.METACOGNITIVE_MONITORING,
            ThinkingCapability.SCIENTIFIC_METHOD,
            ThinkingCapability.STRUCTURED_ARGUMENTATION,
            ThinkingCapability.VISUAL_REASONING
        ];
        return this.filterToolsByComplexity(advancedTools, taskAnalysis.complexity, 5, 10);
    }
    /**
     * Generate thinking tool execution plan with dependency resolution
     */
    createExecutionPlan(capabilities) {
        const plan = [];
        const resolved = new Set();
        // Recursive dependency resolution
        const resolveDependencies = (capability) => {
            const config = this.toolConfigs.get(capability);
            if (!config || resolved.has(capability))
                return;
            // Resolve prerequisites first
            for (const prereq of config.prerequisites) {
                if (!resolved.has(prereq)) {
                    resolveDependencies(prereq);
                }
            }
            plan.push(config);
            resolved.add(capability);
        };
        // Sort by priority and resolve dependencies
        const sortedCapabilities = capabilities.sort((a, b) => {
            const aConfig = this.toolConfigs.get(a);
            const bConfig = this.toolConfigs.get(b);
            return (bConfig?.priority || 0) - (aConfig?.priority || 0);
        });
        for (const capability of sortedCapabilities) {
            resolveDependencies(capability);
        }
        return plan;
    }
    assessComplexity(taskDescription, context) {
        let complexity = 1;
        // Keyword-based complexity indicators
        const complexityMarkers = {
            high: ['analyze', 'design', 'architect', 'optimize', 'complex', 'sophisticated', 'advanced'],
            medium: ['implement', 'create', 'build', 'integrate', 'configure', 'multi-step'],
            low: ['read', 'show', 'list', 'simple', 'basic', 'quick']
        };
        const lowerDescription = taskDescription.toLowerCase();
        // Check for high complexity markers
        if (complexityMarkers.high.some(marker => lowerDescription.includes(marker))) {
            complexity += 4;
        }
        // Check for medium complexity markers  
        if (complexityMarkers.medium.some(marker => lowerDescription.includes(marker))) {
            complexity += 2;
        }
        // Length and detail analysis
        if (taskDescription.length > 200)
            complexity += 1;
        if (taskDescription.split('.').length > 3)
            complexity += 1;
        // Context complexity
        if (context?.fileCount > 5)
            complexity += 1;
        if (context?.projectSize === 'large')
            complexity += 2;
        return Math.min(complexity, 10);
    }
    identifyTaskType(taskDescription) {
        const typeKeywords = {
            [TaskType.PROBLEM_SOLVING]: ['solve', 'fix', 'resolve', 'troubleshoot'],
            [TaskType.DECISION_MAKING]: ['choose', 'decide', 'select', 'compare', 'evaluate'],
            [TaskType.CODE_ANALYSIS]: ['analyze', 'review', 'examine', 'assess'],
            [TaskType.SYSTEM_DESIGN]: ['design', 'architect', 'structure', 'plan'],
            [TaskType.DEBUGGING]: ['debug', 'error', 'bug', 'issue', 'problem'],
            [TaskType.RESEARCH]: ['research', 'investigate', 'explore', 'study'],
            [TaskType.PLANNING]: ['plan', 'organize', 'schedule', 'roadmap'],
            [TaskType.CREATIVE]: ['create', 'generate', 'innovate', 'brainstorm']
        };
        const lowerDescription = taskDescription.toLowerCase();
        for (const [type, keywords] of Object.entries(typeKeywords)) {
            if (keywords.some(keyword => lowerDescription.includes(keyword))) {
                return type;
            }
        }
        return TaskType.PROBLEM_SOLVING; // Default
    }
    identifyDomain(taskDescription) {
        const domainKeywords = {
            'software_engineering': ['code', 'software', 'programming', 'development'],
            'data_science': ['data', 'analysis', 'machine learning', 'statistics'],
            'system_administration': ['server', 'deployment', 'infrastructure', 'network'],
            'product_management': ['product', 'feature', 'user', 'business'],
            'design': ['UI', 'UX', 'interface', 'visual', 'design']
        };
        const lowerDescription = taskDescription.toLowerCase();
        for (const [domain, keywords] of Object.entries(domainKeywords)) {
            if (keywords.some(keyword => lowerDescription.includes(keyword))) {
                return domain;
            }
        }
        return 'general';
    }
    selectThinkingCapabilities(analysis) {
        const capabilities = [];
        // Always include sequential thinking for complex tasks
        if (analysis.complexity >= 3) {
            capabilities.push(ThinkingCapability.SEQUENTIAL_THINKING);
        }
        // Task type specific capabilities
        switch (analysis.type) {
            case TaskType.PROBLEM_SOLVING:
                capabilities.push(ThinkingCapability.MENTAL_MODELS);
                if (analysis.complexity >= 5) {
                    capabilities.push(ThinkingCapability.SCIENTIFIC_METHOD);
                }
                break;
            case TaskType.DECISION_MAKING:
                capabilities.push(ThinkingCapability.DECISION_FRAMEWORK);
                if (analysis.complexity >= 5) {
                    capabilities.push(ThinkingCapability.COLLABORATIVE_REASONING);
                }
                break;
            case TaskType.CODE_ANALYSIS:
            case TaskType.DEBUGGING:
                capabilities.push(ThinkingCapability.DEBUGGING_APPROACHES);
                capabilities.push(ThinkingCapability.PROGRAMMING_PARADIGMS);
                break;
            case TaskType.SYSTEM_DESIGN:
                capabilities.push(ThinkingCapability.DESIGN_PATTERNS);
                if (analysis.complexity >= 5) {
                    capabilities.push(ThinkingCapability.VISUAL_REASONING);
                }
                break;
        }
        // Add metacognitive monitoring for high-complexity tasks
        if (analysis.complexity >= 6) {
            capabilities.push(ThinkingCapability.METACOGNITIVE_MONITORING);
        }
        return [...new Set(capabilities)]; // Remove duplicates
    }
    filterToolsByComplexity(tools, taskComplexity, minTier, maxTier) {
        return tools.filter(tool => {
            const config = this.toolConfigs.get(tool);
            return config &&
                config.minComplexity >= minTier &&
                config.minComplexity <= maxTier &&
                taskComplexity >= config.minComplexity;
        });
    }
    estimateExecutionTime(capabilities) {
        return capabilities.reduce((total, capability) => {
            const config = this.toolConfigs.get(capability);
            return total + (config?.maxExecutionTime || 30);
        }, 0);
    }
    assessRiskLevel(analysis) {
        if (analysis.complexity >= 8 || analysis.estimatedTime > 300)
            return 'high';
        if (analysis.complexity >= 5 || analysis.estimatedTime > 120)
            return 'medium';
        return 'low';
    }
}
exports.ClearThoughtRouter = ClearThoughtRouter;
//# sourceMappingURL=clear-thought-router.js.map