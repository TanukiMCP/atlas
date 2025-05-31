import { LLMRequest, ComplexityAssessment, RequestComplexity } from './types';
import { LLMService } from '../services/llm-service';

export class ComplexityAssessor {
  private llmService: LLMService | null = null;
  
  constructor(llmService?: LLMService) {
    this.llmService = llmService || null;
  }

  setLLMService(llmService: LLMService): void {
    this.llmService = llmService;
  }

  async assess(request: LLMRequest): Promise<ComplexityAssessment> {
    // If LLM service is not available, fall back to rule-based assessment
    if (!this.llmService) {
      return this.fallbackAssessment(request);
    }

    try {
      // Use LLM to assess complexity
      return await this.llmDrivenAssessment(request);
    } catch (error) {
      console.error('LLM-driven complexity assessment failed:', error);
      // Fall back to rule-based assessment on error
      return this.fallbackAssessment(request);
    }
  }

  private async llmDrivenAssessment(request: LLMRequest): Promise<ComplexityAssessment> {
    const prompt = this.buildComplexityAssessmentPrompt(request);
    
    const response = await this.llmService!.generate(prompt, {
      temperature: 0.1, // Low temperature for more deterministic results
      max_tokens: 500
    });

    return this.parseComplexityResponse(response);
  }

  private buildComplexityAssessmentPrompt(request: LLMRequest): string {
    return `
You are an AI task complexity analyzer. Your job is to analyze user queries and determine their complexity level.
Please assess the complexity of the following query:

"${request.query}"

Analyze the query and determine its complexity level based on these categories:
1. DIRECT_RESPONSE: Simple acknowledgments, yes/no questions, or very basic informational queries.
2. ATOMIC: Simple, straightforward tasks that can be completed in a single step or response.
3. MODERATE: Tasks requiring multiple steps, basic reasoning, or integration of a few concepts.
4. COMPLEX: Tasks requiring sophisticated reasoning, planning, or coordination between multiple components.
5. EXPERT: Tasks demanding specialized knowledge, extensive planning, or complex problem-solving approaches.

Please respond in JSON format with the following structure:
{
  "complexity": "COMPLEXITY_LEVEL",
  "estimatedTimeMs": ESTIMATED_TIME_IN_MS,
  "reasoning": "Brief explanation of your assessment"
}

Where:
- COMPLEXITY_LEVEL is one of: DIRECT_RESPONSE, ATOMIC, MODERATE, COMPLEX, EXPERT
- ESTIMATED_TIME_IN_MS is your estimate of processing time in milliseconds
- reasoning explains your assessment rationale

Respond with ONLY the JSON object, no other text.
`;
  }

  private parseComplexityResponse(response: string): ComplexityAssessment {
    try {
      // Extract JSON from the response (in case the LLM includes other text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      
      const result = JSON.parse(jsonString);
      
      // Validate the complexity level
      if (!Object.values(RequestComplexity).includes(result.complexity as RequestComplexity)) {
        throw new Error(`Invalid complexity level: ${result.complexity}`);
      }
      
      // Validate and normalize estimated time
      const estimatedTimeMs = typeof result.estimatedTimeMs === 'number' 
        ? result.estimatedTimeMs 
        : parseInt(result.estimatedTimeMs);
      
      if (isNaN(estimatedTimeMs)) {
        throw new Error('Invalid estimatedTimeMs value');
      }
      
      return {
        complexity: result.complexity as RequestComplexity,
        estimatedTimeMs,
        reasoning: result.reasoning || 'No reasoning provided'
      };
    } catch (error) {
      console.error('Failed to parse complexity assessment response:', error);
      console.log('Raw response:', response);
      
      // Return a default assessment if parsing fails
      return {
        complexity: RequestComplexity.MODERATE,
        estimatedTimeMs: 30000,
        reasoning: 'Default assessment due to response parsing failure.'
      };
    }
  }

  // Fallback rule-based assessment when LLM is not available
  private fallbackAssessment(request: LLMRequest): ComplexityAssessment {
    const query = request.query.toLowerCase();

    if (query.includes('thank you') || query.includes('yes') || query.includes('no')) {
      return {
        complexity: RequestComplexity.DIRECT_RESPONSE,
        estimatedTimeMs: 2000,
        reasoning: 'Simple acknowledgement or affirmative/negative.'
      };
    }

    if (query.split(' ').length < 10 && !query.includes('clear-thought')) {
      return {
        complexity: RequestComplexity.ATOMIC,
        estimatedTimeMs: 10000,
        reasoning: 'Short query, likely a single step.'
      };
    }

    if (query.includes('clear-thought') || query.includes('analyze') || query.includes('plan')) {
      return {
        complexity: RequestComplexity.COMPLEX,
        estimatedTimeMs: 180000, // 3 minutes
        reasoning: 'Query indicates need for advanced reasoning or clear-thought tools.'
      };
    }
    
    // Default to MODERATE for now
    return {
      complexity: RequestComplexity.MODERATE,
      estimatedTimeMs: 30000,
      reasoning: 'Defaulting to moderate complexity.'
    };
  }
} 