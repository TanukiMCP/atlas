import { z } from 'zod';
export interface SequentialThought {
    thoughtNumber: number;
    totalThoughts: number;
    thought: string;
    nextThoughtNeeded: boolean;
    isRevision?: boolean;
    revisesThought?: number;
    branchFromThought?: number;
    branchId?: string;
    needsMoreThoughts?: boolean;
}
export interface ThinkingSession {
    sessionId: string;
    thoughts: SequentialThought[];
    finalAnswer?: string;
    status: 'active' | 'completed' | 'paused';
    createdAt: Date;
    updatedAt: Date;
}
export declare const SequentialThinkingSchema: z.ZodObject<{
    thought: z.ZodString;
    thoughtNumber: z.ZodNumber;
    totalThoughts: z.ZodNumber;
    nextThoughtNeeded: z.ZodBoolean;
    isRevision: z.ZodOptional<z.ZodBoolean>;
    revisesThought: z.ZodOptional<z.ZodNumber>;
    branchFromThought: z.ZodOptional<z.ZodNumber>;
    branchId: z.ZodOptional<z.ZodString>;
    needsMoreThoughts: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    nextThoughtNeeded: boolean;
    isRevision?: boolean | undefined;
    revisesThought?: number | undefined;
    branchFromThought?: number | undefined;
    branchId?: string | undefined;
    needsMoreThoughts?: boolean | undefined;
}, {
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    nextThoughtNeeded: boolean;
    isRevision?: boolean | undefined;
    revisesThought?: number | undefined;
    branchFromThought?: number | undefined;
    branchId?: string | undefined;
    needsMoreThoughts?: boolean | undefined;
}>;
export declare class SequentialThinkingTool {
    private sessions;
    /**
     * Execute sequential thinking for a given problem
     */
    execute(params: z.infer<typeof SequentialThinkingSchema>): Promise<SequentialThought>;
    /**
     * Start a new thinking session for a problem
     */
    startSession(problem: string, estimatedComplexity?: number): string;
    /**
     * Get all thoughts from a session
     */
    getSession(sessionId: string): ThinkingSession | undefined;
    /**
     * Get suggested next thought based on current progress
     */
    suggestNextThought(sessionId: string): {
        suggestedDirection: string;
        estimatedRemainingThoughts: number;
        shouldRevise: boolean;
        shouldBranch: boolean;
    };
    /**
     * Generate a comprehensive thinking prompt for LLMs
     */
    generateThinkingPrompt(problem: string, context?: any): string;
    private handleRevision;
    private handleBranching;
    private synthesizeFinalAnswer;
    private analyzeProgress;
    private generateSuggestion;
    private shouldRevise;
    private shouldBranch;
    private assessCoherence;
    private assessDepth;
    private assessCoverage;
    private findContradictions;
    private identifyGaps;
    private generateSessionId;
}
//# sourceMappingURL=sequential-thinking.d.ts.map