export enum RequestComplexity {
  DIRECT_RESPONSE = 'DIRECT_RESPONSE',
  ATOMIC = 'ATOMIC',
  MODERATE = 'MODERATE',
  COMPLEX = 'COMPLEX',
  EXPERT = 'EXPERT',
}

export interface LLMRequest {
  id: string;
  query: string;
  userId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface LLMResponse {
  requestId: string;
  tierUsed: RequestComplexity;
  content: string;
  qualityScore?: number;
  metrics?: Record<string, any>;
  error?: string;
}

export interface TierProcessor {
  process(request: LLMRequest): Promise<LLMResponse>;
}

export interface ComplexityAssessment {
  complexity: RequestComplexity;
  estimatedTimeMs: number;
  reasoning: string;
} 