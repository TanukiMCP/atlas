import { LLMRequest, ComplexityAssessment, RequestComplexity } from './types';

export class ComplexityAssessor {
  assess(request: LLMRequest): ComplexityAssessment {
    // Placeholder logic: simple keyword-based assessment
    // This will be expanded with more sophisticated NLP and rule-based checks
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