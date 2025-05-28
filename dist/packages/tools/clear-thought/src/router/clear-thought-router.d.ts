export interface TaskAnalysis {
    complexity: number;
    type: TaskType;
    domain: string;
    requiredThinking: ThinkingCapability[];
    estimatedTime: number;
    riskLevel: 'low' | 'medium' | 'high';
}
export declare enum TaskType {
    PROBLEM_SOLVING = "problem_solving",
    DECISION_MAKING = "decision_making",
    CODE_ANALYSIS = "code_analysis",
    SYSTEM_DESIGN = "system_design",
    DEBUGGING = "debugging",
    RESEARCH = "research",
    PLANNING = "planning",
    CREATIVE = "creative"
}
export declare enum ThinkingCapability {
    SEQUENTIAL_THINKING = "sequential_thinking",
    MENTAL_MODELS = "mental_models",
    DESIGN_PATTERNS = "design_patterns",
    PROGRAMMING_PARADIGMS = "programming_paradigms",
    DEBUGGING_APPROACHES = "debugging_approaches",
    COLLABORATIVE_REASONING = "collaborative_reasoning",
    DECISION_FRAMEWORK = "decision_framework",
    METACOGNITIVE_MONITORING = "metacognitive_monitoring",
    SCIENTIFIC_METHOD = "scientific_method",
    STRUCTURED_ARGUMENTATION = "structured_argumentation",
    VISUAL_REASONING = "visual_reasoning"
}
export interface ThinkingToolConfig {
    capability: ThinkingCapability;
    priority: number;
    minComplexity: number;
    maxExecutionTime: number;
    prerequisites: ThinkingCapability[];
}
export declare class ClearThoughtRouter {
    private toolConfigs;
    constructor();
    private initializeToolConfigs;
    /**
     * Analyze a task to determine its complexity and required thinking capabilities
     */
    analyzeTask(taskDescription: string, context?: any): TaskAnalysis;
    /**
     * Select appropriate thinking tools for Tier 3 (Moderate) tasks
     */
    selectToolsForTier3(taskAnalysis: TaskAnalysis): ThinkingCapability[];
    /**
     * Get advanced thinking toolset for Tier 4 (Complex) tasks
     */
    getAdvancedToolset(taskAnalysis: TaskAnalysis): ThinkingCapability[];
    /**
     * Generate thinking tool execution plan with dependency resolution
     */
    createExecutionPlan(capabilities: ThinkingCapability[]): ThinkingToolConfig[];
    private assessComplexity;
    private identifyTaskType;
    private identifyDomain;
    private selectThinkingCapabilities;
    private filterToolsByComplexity;
    private estimateExecutionTime;
    private assessRiskLevel;
}
//# sourceMappingURL=clear-thought-router.d.ts.map