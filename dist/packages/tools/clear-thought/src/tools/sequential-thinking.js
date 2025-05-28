"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequentialThinkingTool = exports.SequentialThinkingSchema = void 0;
const zod_1 = require("zod");
exports.SequentialThinkingSchema = zod_1.z.object({
    thought: zod_1.z.string().describe('The current thought in the sequence'),
    thoughtNumber: zod_1.z.number().min(1).describe('Current thought number'),
    totalThoughts: zod_1.z.number().min(1).describe('Total estimated thoughts needed'),
    nextThoughtNeeded: zod_1.z.boolean().describe('Whether another thought is needed'),
    isRevision: zod_1.z.boolean().optional().describe('Whether this revises a previous thought'),
    revisesThought: zod_1.z.number().min(1).optional().describe('Which thought number this revises'),
    branchFromThought: zod_1.z.number().min(1).optional().describe('Thought number to branch from'),
    branchId: zod_1.z.string().optional().describe('Unique identifier for this branch'),
    needsMoreThoughts: zod_1.z.boolean().optional().describe('Whether more thoughts are needed beyond current estimate')
});
class SequentialThinkingTool {
    sessions = new Map();
    /**
     * Execute sequential thinking for a given problem
     */
    async execute(params) {
        const thought = {
            thoughtNumber: params.thoughtNumber,
            totalThoughts: params.totalThoughts,
            thought: params.thought,
            nextThoughtNeeded: params.nextThoughtNeeded,
            isRevision: params.isRevision,
            revisesThought: params.revisesThought,
            branchFromThought: params.branchFromThought,
            branchId: params.branchId,
            needsMoreThoughts: params.needsMoreThoughts
        };
        // Generate session ID if starting new session
        const sessionId = this.generateSessionId();
        let session = this.sessions.get(sessionId);
        if (!session) {
            session = {
                sessionId,
                thoughts: [],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            this.sessions.set(sessionId, session);
        }
        // Handle revisions and branches
        if (thought.isRevision && thought.revisesThought) {
            this.handleRevision(session, thought);
        }
        else if (thought.branchFromThought) {
            this.handleBranching(session, thought);
        }
        else {
            session.thoughts.push(thought);
        }
        session.updatedAt = new Date();
        // Check if thinking session is complete
        if (!thought.nextThoughtNeeded) {
            session.status = 'completed';
            session.finalAnswer = this.synthesizeFinalAnswer(session);
        }
        return thought;
    }
    /**
     * Start a new thinking session for a problem
     */
    startSession(problem, estimatedComplexity = 3) {
        const sessionId = this.generateSessionId();
        const session = {
            sessionId,
            thoughts: [],
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.sessions.set(sessionId, session);
        return sessionId;
    }
    /**
     * Get all thoughts from a session
     */
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    /**
     * Get suggested next thought based on current progress
     */
    suggestNextThought(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`Session ${sessionId} not found`);
        }
        const currentThoughts = session.thoughts.length;
        const lastThought = session.thoughts[session.thoughts.length - 1];
        // Analyze thinking progress
        const progressAnalysis = this.analyzeProgress(session);
        return {
            suggestedDirection: this.generateSuggestion(progressAnalysis, lastThought),
            estimatedRemainingThoughts: Math.max(1, lastThought.totalThoughts - currentThoughts),
            shouldRevise: this.shouldRevise(progressAnalysis),
            shouldBranch: this.shouldBranch(progressAnalysis)
        };
    }
    /**
     * Generate a comprehensive thinking prompt for LLMs
     */
    generateThinkingPrompt(problem, context) {
        return `
You are engaging in systematic sequential thinking to solve this problem. Follow these guidelines:

PROBLEM: ${problem}

THINKING FRAMEWORK:
1. Start with an initial assessment of the problem scope
2. Break down the problem into logical components  
3. Consider multiple approaches and their trade-offs
4. Build upon previous thoughts, revising when necessary
5. Question assumptions and explore edge cases
6. Synthesize insights into a coherent solution

INSTRUCTIONS:
- Express each thought clearly and completely
- Estimate the total thoughts needed (adjust as you progress)
- Feel free to revise previous thoughts if you gain new insights
- Branch into alternative approaches when beneficial
- Don't hesitate to add more thoughts if the problem proves more complex
- Mark when no further thoughts are needed

${context ? `CONTEXT: ${JSON.stringify(context, null, 2)}` : ''}

Begin your sequential thinking process now.
`;
    }
    handleRevision(session, thought) {
        if (!thought.revisesThought)
            return;
        // Find the thought being revised
        const targetIndex = session.thoughts.findIndex(t => t.thoughtNumber === thought.revisesThought);
        if (targetIndex !== -1) {
            // Mark original as revised and add the revision
            session.thoughts[targetIndex] = { ...session.thoughts[targetIndex], isRevision: true };
            session.thoughts.push(thought);
        }
    }
    handleBranching(session, thought) {
        if (!thought.branchFromThought)
            return;
        // Generate branch ID if not provided
        if (!thought.branchId) {
            thought.branchId = `branch_${Date.now()}`;
        }
        session.thoughts.push(thought);
    }
    synthesizeFinalAnswer(session) {
        const allThoughts = session.thoughts
            .filter(t => !t.isRevision) // Exclude revised thoughts
            .sort((a, b) => a.thoughtNumber - b.thoughtNumber)
            .map(t => `${t.thoughtNumber}. ${t.thought}`)
            .join('\n\n');
        return `
SEQUENTIAL THINKING ANALYSIS:

${allThoughts}

SYNTHESIS:
Based on this systematic thinking process, the solution approach involves the key insights and logical progression outlined above.
`;
    }
    analyzeProgress(session) {
        const thoughts = session.thoughts;
        return {
            coherence: this.assessCoherence(thoughts),
            depth: this.assessDepth(thoughts),
            coverage: this.assessCoverage(thoughts),
            contradictions: this.findContradictions(thoughts),
            gaps: this.identifyGaps(thoughts)
        };
    }
    generateSuggestion(analysis, lastThought) {
        if (analysis.gaps.length > 0) {
            return `Consider addressing these gaps: ${analysis.gaps.join(', ')}`;
        }
        if (analysis.contradictions.length > 0) {
            return `Resolve these contradictions: ${analysis.contradictions.join(', ')}`;
        }
        if (analysis.depth < 0.7) {
            return 'Dive deeper into the analysis - consider more specific details and implications';
        }
        if (analysis.coverage < 0.8) {
            return 'Expand the scope - consider additional aspects or alternative approaches';
        }
        return 'Synthesize the insights and move toward a conclusion';
    }
    shouldRevise(analysis) {
        return analysis.contradictions.length > 0 || analysis.coherence < 0.6;
    }
    shouldBranch(analysis) {
        return analysis.coverage < 0.7 && analysis.depth > 0.6;
    }
    assessCoherence(thoughts) {
        // Simple heuristic - could be enhanced with NLP
        return Math.min(1, thoughts.length / 10); // Placeholder implementation
    }
    assessDepth(thoughts) {
        // Assess based on thought complexity and detail
        const avgLength = thoughts.reduce((sum, t) => sum + t.thought.length, 0) / thoughts.length;
        return Math.min(1, avgLength / 200); // Placeholder implementation
    }
    assessCoverage(thoughts) {
        // Assess breadth of topics covered
        return Math.min(1, thoughts.length / 5); // Placeholder implementation
    }
    findContradictions(thoughts) {
        // Placeholder - would use semantic analysis in production
        return [];
    }
    identifyGaps(thoughts) {
        // Placeholder - would analyze for missing logical steps
        return [];
    }
    generateSessionId() {
        return `seq_thinking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.SequentialThinkingTool = SequentialThinkingTool;
//# sourceMappingURL=sequential-thinking.js.map