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

export const SequentialThinkingSchema = z.object({
  thought: z.string().describe('The current thought in the sequence'),
  thoughtNumber: z.number().min(1).describe('Current thought number'),
  totalThoughts: z.number().min(1).describe('Total estimated thoughts needed'),
  nextThoughtNeeded: z.boolean().describe('Whether another thought is needed'),
  isRevision: z.boolean().optional().describe('Whether this revises a previous thought'),
  revisesThought: z.number().min(1).optional().describe('Which thought number this revises'),
  branchFromThought: z.number().min(1).optional().describe('Thought number to branch from'),
  branchId: z.string().optional().describe('Unique identifier for this branch'),
  needsMoreThoughts: z.boolean().optional().describe('Whether more thoughts are needed beyond current estimate')
});

export class SequentialThinkingTool {
  private sessions: Map<string, ThinkingSession> = new Map();

  /**
   * Execute sequential thinking for a given problem
   */
  public async execute(params: z.infer<typeof SequentialThinkingSchema>): Promise<SequentialThought> {
    const thought: SequentialThought = {
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
    } else if (thought.branchFromThought) {
      this.handleBranching(session, thought);
    } else {
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
  public startSession(problem: string, estimatedComplexity: number = 3): string {
    const sessionId = this.generateSessionId();
    const session: ThinkingSession = {
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
  public getSession(sessionId: string): ThinkingSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get suggested next thought based on current progress
   */
  public suggestNextThought(sessionId: string): {
    suggestedDirection: string;
    estimatedRemainingThoughts: number;
    shouldRevise: boolean;
    shouldBranch: boolean;
  } {
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
  public generateThinkingPrompt(problem: string, context?: any): string {
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

  private handleRevision(session: ThinkingSession, thought: SequentialThought): void {
    if (!thought.revisesThought) return;

    // Find the thought being revised
    const targetIndex = session.thoughts.findIndex(t => t.thoughtNumber === thought.revisesThought);
    if (targetIndex !== -1) {
      // Mark original as revised and add the revision
      session.thoughts[targetIndex] = { ...session.thoughts[targetIndex], isRevision: true };
      session.thoughts.push(thought);
    }
  }

  private handleBranching(session: ThinkingSession, thought: SequentialThought): void {
    if (!thought.branchFromThought) return;

    // Generate branch ID if not provided
    if (!thought.branchId) {
      thought.branchId = `branch_${Date.now()}`;
    }

    session.thoughts.push(thought);
  }

  private synthesizeFinalAnswer(session: ThinkingSession): string {
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

  private analyzeProgress(session: ThinkingSession): {
    coherence: number;
    depth: number;
    coverage: number;
    contradictions: string[];
    gaps: string[];
  } {
    const thoughts = session.thoughts;
    
    return {
      coherence: this.assessCoherence(thoughts),
      depth: this.assessDepth(thoughts),
      coverage: this.assessCoverage(thoughts),
      contradictions: this.findContradictions(thoughts),
      gaps: this.identifyGaps(thoughts)
    };
  }

  private generateSuggestion(analysis: any, lastThought: SequentialThought): string {
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

  private shouldRevise(analysis: any): boolean {
    return analysis.contradictions.length > 0 || analysis.coherence < 0.6;
  }

  private shouldBranch(analysis: any): boolean {
    return analysis.coverage < 0.7 && analysis.depth > 0.6;
  }

  private assessCoherence(thoughts: SequentialThought[]): number {
    // Simple heuristic - could be enhanced with NLP
    return Math.min(1, thoughts.length / 10); // Placeholder implementation
  }

  private assessDepth(thoughts: SequentialThought[]): number {
    // Assess based on thought complexity and detail
    const avgLength = thoughts.reduce((sum, t) => sum + t.thought.length, 0) / thoughts.length;
    return Math.min(1, avgLength / 200); // Placeholder implementation
  }

  private assessCoverage(thoughts: SequentialThought[]): number {
    // Assess breadth of topics covered
    return Math.min(1, thoughts.length / 5); // Placeholder implementation
  }

  private findContradictions(thoughts: SequentialThought[]): string[] {
    // Placeholder - would use semantic analysis in production
    return [];
  }

  private identifyGaps(thoughts: SequentialThought[]): string[] {
    // Placeholder - would analyze for missing logical steps
    return [];
  }

  private generateSessionId(): string {
    return `seq_thinking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 