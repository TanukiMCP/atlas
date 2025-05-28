import { z } from 'zod';
export declare enum MentalModel {
    FIRST_PRINCIPLES = "first_principles",
    OPPORTUNITY_COST = "opportunity_cost",
    ERROR_PROPAGATION = "error_propagation",
    RUBBER_DUCK = "rubber_duck",
    PARETO_PRINCIPLE = "pareto_principle",
    OCCAMS_RAZOR = "occams_razor"
}
export interface MentalModelAnalysis {
    modelName: MentalModel;
    problem: string;
    steps: string[];
    reasoning: string;
    conclusion: string;
    confidence: number;
    applicability: number;
}
export declare const MentalModelSchema: z.ZodObject<{
    modelName: z.ZodNativeEnum<typeof MentalModel>;
    problem: z.ZodString;
    reasoning: z.ZodOptional<z.ZodString>;
    steps: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    conclusion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    problem: string;
    modelName: MentalModel;
    reasoning?: string | undefined;
    steps?: string[] | undefined;
    conclusion?: string | undefined;
}, {
    problem: string;
    modelName: MentalModel;
    reasoning?: string | undefined;
    steps?: string[] | undefined;
    conclusion?: string | undefined;
}>;
export declare class MentalModelsTool {
    private modelDefinitions;
    constructor();
    private initializeModels;
    /**
     * Apply a mental model to analyze a problem
     */
    execute(params: z.infer<typeof MentalModelSchema>): Promise<MentalModelAnalysis>;
    /**
     * Get the best mental model for a given problem type
     */
    suggestModel(problemDescription: string): {
        recommendedModel: MentalModel;
        reasoning: string;
        alternatives: MentalModel[];
    };
    /**
     * Get all available mental models with descriptions
     */
    getAvailableModels(): Array<{
        model: MentalModel;
        name: string;
        description: string;
        applicableScenarios: string[];
    }>;
    private applyModel;
    private applyFirstPrinciples;
    private applyOpportunityCost;
    private applyErrorPropagation;
    private applyRubberDuck;
    private applyParetoPrinciple;
    private applyOccamsRazor;
}
//# sourceMappingURL=mental-models.d.ts.map