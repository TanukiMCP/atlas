"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentalModelsTool = exports.MentalModelSchema = exports.MentalModel = void 0;
const zod_1 = require("zod");
var MentalModel;
(function (MentalModel) {
    MentalModel["FIRST_PRINCIPLES"] = "first_principles";
    MentalModel["OPPORTUNITY_COST"] = "opportunity_cost";
    MentalModel["ERROR_PROPAGATION"] = "error_propagation";
    MentalModel["RUBBER_DUCK"] = "rubber_duck";
    MentalModel["PARETO_PRINCIPLE"] = "pareto_principle";
    MentalModel["OCCAMS_RAZOR"] = "occams_razor";
})(MentalModel || (exports.MentalModel = MentalModel = {}));
exports.MentalModelSchema = zod_1.z.object({
    modelName: zod_1.z.nativeEnum(MentalModel).describe('The mental model to apply'),
    problem: zod_1.z.string().describe('The problem or situation to analyze'),
    reasoning: zod_1.z.string().optional().describe('Additional reasoning context'),
    steps: zod_1.z.array(zod_1.z.string()).optional().describe('Specific analysis steps'),
    conclusion: zod_1.z.string().optional().describe('Final conclusion or recommendation')
});
class MentalModelsTool {
    modelDefinitions = new Map();
    constructor() {
        this.initializeModels();
    }
    initializeModels() {
        this.modelDefinitions.set(MentalModel.FIRST_PRINCIPLES, {
            name: 'First Principles Thinking',
            description: 'Break down complex problems into fundamental truths and build up from there',
            framework: [
                'Identify the fundamental assumptions',
                'Question each assumption - what do we know to be true?',
                'Break down to the most basic elements',
                'Rebuild the solution from these fundamentals',
                'Validate the new approach against reality'
            ],
            applicableScenarios: ['Complex problem solving', 'Innovation challenges', 'System design', 'Breaking through conventional thinking']
        });
        this.modelDefinitions.set(MentalModel.OPPORTUNITY_COST, {
            name: 'Opportunity Cost Analysis',
            description: 'Evaluate the true cost of decisions by considering alternatives',
            framework: [
                'Identify all viable alternatives',
                'Estimate the value/benefit of each option',
                'Consider resource requirements (time, money, effort)',
                'Calculate the opportunity cost of each choice',
                'Make decision based on highest net value'
            ],
            applicableScenarios: ['Resource allocation', 'Strategic decisions', 'Time management', 'Investment choices']
        });
        this.modelDefinitions.set(MentalModel.ERROR_PROPAGATION, {
            name: 'Error Propagation Understanding',
            description: 'Analyze how errors compound and spread through systems',
            framework: [
                'Identify potential error sources',
                'Map error propagation pathways',
                'Assess amplification factors',
                'Identify critical failure points',
                'Design error containment strategies'
            ],
            applicableScenarios: ['System reliability', 'Quality assurance', 'Risk management', 'Process improvement']
        });
        this.modelDefinitions.set(MentalModel.RUBBER_DUCK, {
            name: 'Rubber Duck Debugging',
            description: 'Explain the problem step-by-step to clarify thinking',
            framework: [
                'State the problem clearly and completely',
                'Explain your current understanding',
                'Walk through your approach step by step',
                'Identify assumptions and gaps in logic',
                'Reformulate the problem with new insights'
            ],
            applicableScenarios: ['Debugging', 'Problem clarification', 'Learning', 'Communication improvement']
        });
        this.modelDefinitions.set(MentalModel.PARETO_PRINCIPLE, {
            name: 'Pareto Principle (80/20 Rule)',
            description: 'Focus on the vital few factors that drive most results',
            framework: [
                'Identify all contributing factors',
                'Measure or estimate impact of each factor',
                'Rank factors by impact/importance',
                'Focus on the top 20% that drive 80% of results',
                'Optimize or eliminate the vital few'
            ],
            applicableScenarios: ['Optimization', 'Prioritization', 'Resource allocation', 'Performance improvement']
        });
        this.modelDefinitions.set(MentalModel.OCCAMS_RAZOR, {
            name: "Occam's Razor",
            description: 'Prefer the simplest explanation that accounts for all evidence',
            framework: [
                'List all possible explanations',
                'Evaluate complexity of each explanation',
                'Check which explanations fit all evidence',
                'Prefer the simplest viable explanation',
                'Test the simple explanation first'
            ],
            applicableScenarios: ['Problem diagnosis', 'Hypothesis formation', 'Decision making', 'Troubleshooting']
        });
    }
    /**
     * Apply a mental model to analyze a problem
     */
    async execute(params) {
        const model = this.modelDefinitions.get(params.modelName);
        if (!model) {
            throw new Error(`Mental model ${params.modelName} not found`);
        }
        const analysis = await this.applyModel(params.modelName, params.problem, model);
        return {
            modelName: params.modelName,
            problem: params.problem,
            steps: analysis.steps,
            reasoning: analysis.reasoning,
            conclusion: analysis.conclusion,
            confidence: analysis.confidence,
            applicability: analysis.applicability
        };
    }
    /**
     * Get the best mental model for a given problem type
     */
    suggestModel(problemDescription) {
        const problemLower = problemDescription.toLowerCase();
        // Simple keyword-based suggestion logic
        if (problemLower.includes('debug') || problemLower.includes('error') || problemLower.includes('bug')) {
            return {
                recommendedModel: MentalModel.RUBBER_DUCK,
                reasoning: 'Problem appears to be debugging-related, rubber duck method helps clarify thinking',
                alternatives: [MentalModel.ERROR_PROPAGATION, MentalModel.FIRST_PRINCIPLES]
            };
        }
        if (problemLower.includes('choose') || problemLower.includes('decide') || problemLower.includes('option')) {
            return {
                recommendedModel: MentalModel.OPPORTUNITY_COST,
                reasoning: 'Decision-making scenario detected, opportunity cost analysis helps evaluate trade-offs',
                alternatives: [MentalModel.OCCAMS_RAZOR, MentalModel.PARETO_PRINCIPLE]
            };
        }
        if (problemLower.includes('optimize') || problemLower.includes('improve') || problemLower.includes('efficiency')) {
            return {
                recommendedModel: MentalModel.PARETO_PRINCIPLE,
                reasoning: 'Optimization problem detected, Pareto principle helps focus on high-impact factors',
                alternatives: [MentalModel.OPPORTUNITY_COST, MentalModel.FIRST_PRINCIPLES]
            };
        }
        if (problemLower.includes('complex') || problemLower.includes('innovative') || problemLower.includes('breakthrough')) {
            return {
                recommendedModel: MentalModel.FIRST_PRINCIPLES,
                reasoning: 'Complex or innovative problem, first principles thinking breaks through assumptions',
                alternatives: [MentalModel.OCCAMS_RAZOR, MentalModel.RUBBER_DUCK]
            };
        }
        // Default recommendation
        return {
            recommendedModel: MentalModel.FIRST_PRINCIPLES,
            reasoning: 'General problem-solving approach, first principles provides systematic analysis',
            alternatives: [MentalModel.RUBBER_DUCK, MentalModel.OPPORTUNITY_COST]
        };
    }
    /**
     * Get all available mental models with descriptions
     */
    getAvailableModels() {
        return Array.from(this.modelDefinitions.entries()).map(([model, definition]) => ({
            model,
            name: definition.name,
            description: definition.description,
            applicableScenarios: definition.applicableScenarios
        }));
    }
    async applyModel(modelName, problem, model) {
        // Apply the specific mental model framework
        switch (modelName) {
            case MentalModel.FIRST_PRINCIPLES:
                return this.applyFirstPrinciples(problem, model);
            case MentalModel.OPPORTUNITY_COST:
                return this.applyOpportunityCost(problem, model);
            case MentalModel.ERROR_PROPAGATION:
                return this.applyErrorPropagation(problem, model);
            case MentalModel.RUBBER_DUCK:
                return this.applyRubberDuck(problem, model);
            case MentalModel.PARETO_PRINCIPLE:
                return this.applyParetoPrinciple(problem, model);
            case MentalModel.OCCAMS_RAZOR:
                return this.applyOccamsRazor(problem, model);
            default:
                throw new Error(`Mental model ${modelName} not implemented`);
        }
    }
    applyFirstPrinciples(problem, model) {
        return {
            steps: [
                `Analyzing problem: ${problem}`,
                'Breaking down to fundamental assumptions',
                'Questioning each assumption for validity',
                'Identifying core truths and constraints',
                'Rebuilding solution from fundamentals'
            ],
            reasoning: 'First principles thinking helps bypass conventional assumptions and find innovative solutions by building up from fundamental truths.',
            conclusion: 'Apply systematic deconstruction and reconstruction to find novel approaches.',
            confidence: 0.8,
            applicability: 0.9
        };
    }
    applyOpportunityCost(problem, model) {
        return {
            steps: [
                `Evaluating decision: ${problem}`,
                'Identifying all viable alternatives',
                'Estimating value and costs of each option',
                'Calculating opportunity costs',
                'Selecting highest net value option'
            ],
            reasoning: 'Opportunity cost analysis ensures decisions account for the value of foregone alternatives.',
            conclusion: 'Choose the option with the highest net benefit after considering all alternatives.',
            confidence: 0.85,
            applicability: 0.8
        };
    }
    applyErrorPropagation(problem, model) {
        return {
            steps: [
                `Analyzing system: ${problem}`,
                'Mapping potential error sources',
                'Tracing error propagation paths',
                'Identifying amplification points',
                'Designing containment strategies'
            ],
            reasoning: 'Understanding error propagation helps build more resilient systems and processes.',
            conclusion: 'Implement error containment at critical points to prevent cascade failures.',
            confidence: 0.75,
            applicability: 0.7
        };
    }
    applyRubberDuck(problem, model) {
        return {
            steps: [
                `Explaining problem: ${problem}`,
                'Stating current understanding clearly',
                'Walking through approach step-by-step',
                'Identifying gaps and assumptions',
                'Reformulating with new insights'
            ],
            reasoning: 'Explaining problems out loud often reveals hidden assumptions and logical gaps.',
            conclusion: 'Clarified understanding through systematic explanation reveals solution paths.',
            confidence: 0.9,
            applicability: 0.95
        };
    }
    applyParetoPrinciple(problem, model) {
        return {
            steps: [
                `Optimizing: ${problem}`,
                'Listing all contributing factors',
                'Measuring impact of each factor',
                'Ranking by importance/impact',
                'Focusing on vital few (20%) that drive most results (80%)'
            ],
            reasoning: 'The Pareto principle helps focus effort on the factors that drive the most significant results.',
            conclusion: 'Concentrate resources on the vital few factors for maximum impact.',
            confidence: 0.8,
            applicability: 0.85
        };
    }
    applyOccamsRazor(problem, model) {
        return {
            steps: [
                `Simplifying analysis: ${problem}`,
                'Listing all possible explanations',
                'Evaluating complexity of each',
                'Checking fit with available evidence',
                'Selecting simplest viable explanation'
            ],
            reasoning: "Occam's Razor suggests the simplest explanation is usually correct, reducing complexity and assumptions.",
            conclusion: 'Test the simplest explanation first before considering more complex alternatives.',
            confidence: 0.75,
            applicability: 0.8
        };
    }
}
exports.MentalModelsTool = MentalModelsTool;
//# sourceMappingURL=mental-models.js.map