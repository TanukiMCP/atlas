import { LLMRequest, LLMResponse, RequestComplexity, TierProcessor } from './types';
import { LLMService } from '../services/llm-service';
import { MCPToolCall } from '../services/mcp-client-adapter';

export class Tier4Processor implements TierProcessor {
  private llmService: LLMService;

  constructor(llmService: LLMService) {
    this.llmService = llmService;
  }

  async process(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    try {
      // Tier 4: Complex/Expert level processing with full clear-thought integration
      const analysisResults = await this.performComprehensiveAnalysis(request.query);
      
      // Generate final expert response
      const finalPrompt = this.buildExpertPrompt(request.query, analysisResults);
      const expertResponse = await this.llmService.generate(finalPrompt, {
        temperature: 0.7,
        top_p: 0.95,
        top_k: 50
      });

      const content = this.formatExpertResponse(analysisResults, expertResponse);
      const processingTime = Date.now() - startTime;

      return {
        requestId: request.id,
        tierUsed: request.query.toLowerCase().includes('expert') ? RequestComplexity.EXPERT : RequestComplexity.COMPLEX,
        content,
        qualityScore: 0.95,
        metrics: {
          processingTimeMs: processingTime,
          modelUsed: this.llmService.getCurrentModel(),
          toolsUsed: analysisResults.toolsUsed,
          analysisDepth: 'comprehensive',
          tokensEstimate: Math.ceil(content.length / 4)
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        requestId: request.id,
        tierUsed: RequestComplexity.COMPLEX,
        content: 'I encountered an error during comprehensive analysis. Let me provide a detailed response based on available information.',
        error: error instanceof Error ? error.message : 'Unknown error',
        metrics: {
          processingTimeMs: processingTime,
          failed: true
        }
      };
    }
  }

  private async performComprehensiveAnalysis(query: string) {
    const results = {
      sequentialThinking: null as any,
      mentalModel: null as any,
      designPattern: null as any,
      scientificMethod: null as any,
      collaborativeReasoning: null as any,
      toolsUsed: [] as string[]
    };

    // Sequential thinking for structured analysis
    try {
      const thinkingResult = await this.useSequentialThinking(query);
      if (thinkingResult.success) {
        results.sequentialThinking = thinkingResult;
        results.toolsUsed.push('sequential-thinking');
      }
    } catch (error) {
      console.warn('Sequential thinking failed:', error);
    }

    // Mental model analysis
    try {
      const mentalModelResult = await this.useMentalModel(query);
      if (mentalModelResult.success) {
        results.mentalModel = mentalModelResult;
        results.toolsUsed.push('mental-model');
      }
    } catch (error) {
      console.warn('Mental model analysis failed:', error);
    }

    // Design pattern analysis (if applicable)
    if (this.isDesignRelated(query)) {
      try {
        const designResult = await this.useDesignPattern(query);
        if (designResult.success) {
          results.designPattern = designResult;
          results.toolsUsed.push('design-pattern');
        }
      } catch (error) {
        console.warn('Design pattern analysis failed:', error);
      }
    }

    // Scientific method (for hypothesis-driven queries)
    if (this.isScientificInquiry(query)) {
      try {
        const scientificResult = await this.useScientificMethod(query);
        if (scientificResult.success) {
          results.scientificMethod = scientificResult;
          results.toolsUsed.push('scientific-method');
        }
      } catch (error) {
        console.warn('Scientific method analysis failed:', error);
      }
    }

    // Collaborative reasoning for complex problems
    if (this.requiresMultiplePerspectives(query)) {
      try {
        const collaborativeResult = await this.useCollaborativeReasoning(query);
        if (collaborativeResult.success) {
          results.collaborativeReasoning = collaborativeResult;
          results.toolsUsed.push('collaborative-reasoning');
        }
      } catch (error) {
        console.warn('Collaborative reasoning failed:', error);
      }
    }

    return results;
  }

  private buildExpertPrompt(query: string, analysisResults: any): string {
    let prompt = `You are an expert AI assistant with access to comprehensive analytical tools. Based on the following multi-faceted analysis, provide an authoritative, well-structured response.

Original Query: ${query}

`;

    if (analysisResults.sequentialThinking) {
      prompt += `**Structured Analysis:**
${analysisResults.sequentialThinking.content}

`;
    }

    if (analysisResults.mentalModel) {
      prompt += `**Mental Model Framework:**
${analysisResults.mentalModel.content}

`;
    }

    if (analysisResults.designPattern) {
      prompt += `**Design Pattern Analysis:**
${analysisResults.designPattern.content}

`;
    }

    if (analysisResults.scientificMethod) {
      prompt += `**Scientific Method Application:**
${analysisResults.scientificMethod.content}

`;
    }

    if (analysisResults.collaborativeReasoning) {
      prompt += `**Multi-Perspective Analysis:**
${analysisResults.collaborativeReasoning.content}

`;
    }

    prompt += `Please synthesize all the above analyses into a comprehensive, expert-level response that addresses the original query with depth, nuance, and practical insights.`;

    return prompt;
  }

  private formatExpertResponse(analysisResults: any, expertResponse: string): string {
    let content = '# Expert Analysis\n\n';

    if (analysisResults.toolsUsed.length > 0) {
      content += `*Analysis conducted using: ${analysisResults.toolsUsed.join(', ')}*\n\n`;
    }

    content += expertResponse;

    if (analysisResults.toolsUsed.length > 1) {
      content += '\n\n---\n\n## Analytical Framework Summary\n\n';
      
      if (analysisResults.sequentialThinking) {
        content += '**Structured Thinking:** Applied systematic reasoning process\n';
      }
      if (analysisResults.mentalModel) {
        content += '**Mental Models:** Leveraged cognitive frameworks for deeper understanding\n';
      }
      if (analysisResults.designPattern) {
        content += '**Design Patterns:** Applied proven architectural solutions\n';
      }
      if (analysisResults.scientificMethod) {
        content += '**Scientific Method:** Used hypothesis-driven analysis\n';
      }
      if (analysisResults.collaborativeReasoning) {
        content += '**Multi-Perspective Analysis:** Considered diverse viewpoints\n';
      }
    }

    return content;
  }

  private async useSequentialThinking(query: string) {
    const toolCall: MCPToolCall = {
      name: 'sequentialthinking',
      arguments: {
        thought: `I need to perform a comprehensive analysis of this complex query: ${query}`,
        thoughtNumber: 1,
        totalThoughts: 5,
        nextThoughtNeeded: true
      }
    };

    return await this.llmService.executeMCPTool(toolCall);
  }

  private async useMentalModel(query: string) {
    // Select appropriate mental model based on query analysis
    let modelName = 'first_principles';
    
    if (query.toLowerCase().includes('decision') || query.toLowerCase().includes('choose')) {
      modelName = 'opportunity_cost';
    } else if (query.toLowerCase().includes('error') || query.toLowerCase().includes('debug')) {
      modelName = 'error_propagation';
    } else if (query.toLowerCase().includes('priority') || query.toLowerCase().includes('important')) {
      modelName = 'pareto_principle';
    }

    const toolCall: MCPToolCall = {
      name: 'mentalmodel',
      arguments: {
        modelName,
        problem: query
      }
    };

    return await this.llmService.executeMCPTool(toolCall);
  }

  private async useDesignPattern(query: string) {
    let patternName = 'modular_architecture';
    
    if (query.toLowerCase().includes('api') || query.toLowerCase().includes('integration')) {
      patternName = 'api_integration';
    } else if (query.toLowerCase().includes('state') || query.toLowerCase().includes('data')) {
      patternName = 'state_management';
    } else if (query.toLowerCase().includes('async') || query.toLowerCase().includes('concurrent')) {
      patternName = 'async_processing';
    } else if (query.toLowerCase().includes('scale') || query.toLowerCase().includes('performance')) {
      patternName = 'scalability';
    } else if (query.toLowerCase().includes('security') || query.toLowerCase().includes('auth')) {
      patternName = 'security';
    }

    const toolCall: MCPToolCall = {
      name: 'designpattern',
      arguments: {
        patternName,
        context: query
      }
    };

    return await this.llmService.executeMCPTool(toolCall);
  }

  private async useScientificMethod(query: string) {
    const toolCall: MCPToolCall = {
      name: 'scientificmethod',
      arguments: {
        stage: 'observation',
        observation: query,
        inquiryId: `inquiry_${Date.now()}`,
        iteration: 0,
        nextStageNeeded: true
      }
    };

    return await this.llmService.executeMCPTool(toolCall);
  }

  private async useCollaborativeReasoning(query: string) {
    const toolCall: MCPToolCall = {
      name: 'collaborativereasoning',
      arguments: {
        topic: query,
        personas: [
          {
            id: 'analyst',
            name: 'Systems Analyst',
            expertise: ['systems thinking', 'analysis', 'problem solving'],
            background: 'Expert in breaking down complex problems',
            perspective: 'Analytical and methodical',
            biases: ['over-analysis'],
            communication: { style: 'structured', tone: 'professional' }
          },
          {
            id: 'creative',
            name: 'Creative Strategist',
            expertise: ['innovation', 'creative thinking', 'ideation'],
            background: 'Specialist in novel approaches and solutions',
            perspective: 'Creative and unconventional',
            biases: ['novelty bias'],
            communication: { style: 'inspirational', tone: 'enthusiastic' }
          }
        ],
        contributions: [],
        stage: 'problem-definition',
        activePersonaId: 'analyst',
        sessionId: `session_${Date.now()}`,
        iteration: 0,
        nextContributionNeeded: true
      }
    };

    return await this.llmService.executeMCPTool(toolCall);
  }

  private isDesignRelated(query: string): boolean {
    const designKeywords = [
      'architecture', 'design', 'pattern', 'structure', 'system',
      'api', 'interface', 'module', 'component', 'framework'
    ];
    const lowerQuery = query.toLowerCase();
    return designKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  private isScientificInquiry(query: string): boolean {
    const scientificKeywords = [
      'hypothesis', 'test', 'experiment', 'research', 'study',
      'evidence', 'prove', 'validate', 'investigate', 'analyze'
    ];
    const lowerQuery = query.toLowerCase();
    return scientificKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  private requiresMultiplePerspectives(query: string): boolean {
    const complexityIndicators = [
      'complex', 'complicated', 'multifaceted', 'various', 'different',
      'perspective', 'viewpoint', 'opinion', 'debate', 'controversial'
    ];
    const lowerQuery = query.toLowerCase();
    return complexityIndicators.some(indicator => lowerQuery.includes(indicator)) || query.length > 200;
  }
} 