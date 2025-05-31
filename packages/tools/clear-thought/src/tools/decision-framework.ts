import { v4 as uuidv4 } from 'uuid';

export enum DecisionFrameworkType {
  PROS_CONS = 'pros-cons',
  WEIGHTED_CRITERIA = 'weighted-criteria',
  DECISION_TREE = 'decision-tree',
  EXPECTED_VALUE = 'expected-value',
  SCENARIO_ANALYSIS = 'scenario-analysis'
}

export interface DecisionFrameworkAnalysis {
  decisionId: string;
  decisionStatement: string;
  analysisType: DecisionFrameworkType;
  options: {
    id: string;
    name: string;
    description: string;
  }[];
  criteria?: {
    id: string;
    name: string;
    description: string;
    weight: number;
  }[];
  stage: 'problem-definition' | 'options-generation' | 'criteria-definition' | 'evaluation' | 'sensitivity-analysis' | 'decision';
  rationale?: string;
  recommendation?: string;
  iteration: number;
  nextStageNeeded: boolean;
}

interface FrameworkDefinition {
  name: string;
  description: string;
  stages: string[];
  applicableScenarios: string[];
}

export class DecisionFrameworkTool {
  private frameworkDefinitions = new Map<DecisionFrameworkType, FrameworkDefinition>();
  private sessionState = new Map<string, DecisionFrameworkAnalysis>();

  constructor() {
    this.initializeFrameworks();
  }

  private initializeFrameworks(): void {
    this.frameworkDefinitions.set(DecisionFrameworkType.PROS_CONS, {
      name: 'Pros and Cons Analysis',
      description: 'Simple evaluation of advantages and disadvantages of each option',
      stages: [
        'Define the decision problem',
        'Identify all viable options',
        'List pros and cons for each option',
        'Weigh the significance of each factor',
        'Make final decision based on balance'
      ],
      applicableScenarios: ['Binary decisions', 'Simple choices', 'Quick decision-making', 'Initial option filtering']
    });

    this.frameworkDefinitions.set(DecisionFrameworkType.WEIGHTED_CRITERIA, {
      name: 'Weighted Criteria Analysis',
      description: 'Systematic evaluation of options against weighted criteria',
      stages: [
        'Define the decision problem',
        'Identify evaluation criteria',
        'Assign weights to criteria',
        'Score each option against criteria',
        'Calculate weighted scores',
        'Select highest scoring option'
      ],
      applicableScenarios: ['Complex decisions', 'Multiple stakeholders', 'Many evaluation factors', 'Objective comparison needed']
    });

    this.frameworkDefinitions.set(DecisionFrameworkType.DECISION_TREE, {
      name: 'Decision Tree Analysis',
      description: 'Visualization of decision paths, probabilities, and outcomes',
      stages: [
        'Define the decision problem',
        'Identify decision points and options',
        'Map possible outcomes for each option',
        'Assign probabilities to outcomes',
        'Calculate expected value of each path',
        'Choose optimal decision path'
      ],
      applicableScenarios: ['Sequential decisions', 'Uncertain outcomes', 'Risk evaluation', 'Complex decision pathways']
    });

    this.frameworkDefinitions.set(DecisionFrameworkType.EXPECTED_VALUE, {
      name: 'Expected Value Analysis',
      description: 'Mathematical approach combining probabilities with outcome values',
      stages: [
        'Define the decision problem',
        'Identify all possible options',
        'Determine possible outcomes for each option',
        'Assign probabilities and values to outcomes',
        'Calculate expected value for each option',
        'Select option with highest expected value'
      ],
      applicableScenarios: ['Investment decisions', 'Resource allocation', 'Risk management', 'Probabilistic outcomes']
    });

    this.frameworkDefinitions.set(DecisionFrameworkType.SCENARIO_ANALYSIS, {
      name: 'Scenario Analysis',
      description: 'Evaluation of options across different possible future scenarios',
      stages: [
        'Define the decision problem',
        'Identify key uncertainties/variables',
        'Develop plausible future scenarios',
        'Evaluate options in each scenario',
        'Identify robust options across scenarios',
        'Select option with best overall performance'
      ],
      applicableScenarios: ['Long-term planning', 'Strategic decisions', 'Uncertain environments', 'High-impact choices']
    });
  }

  public async analyze(
    decisionStatement: string,
    analysisType: DecisionFrameworkType,
    options?: string[],
    existingSessionId?: string
  ): Promise<DecisionFrameworkAnalysis> {
    let session: DecisionFrameworkAnalysis;
    
    if (existingSessionId && this.sessionState.has(existingSessionId)) {
      // Continue existing session
      session = this.sessionState.get(existingSessionId)!;
      session.iteration += 1;
      
      // Advance to next stage if needed
      if (session.nextStageNeeded) {
        this.advanceStage(session);
      }
    } else {
      // Create new session
      const decisionId = uuidv4();
      session = {
        decisionId,
        decisionStatement,
        analysisType,
        options: options ? options.map(opt => ({
          id: uuidv4(),
          name: opt,
          description: `Option: ${opt}`
        })) : [],
        stage: 'problem-definition',
        iteration: 0,
        nextStageNeeded: true
      };
      
      this.sessionState.set(decisionId, session);
    }
    
    // Process current stage
    await this.processStage(session);
    
    return session;
  }
  
  private advanceStage(session: DecisionFrameworkAnalysis): void {
    const stageOrder = [
      'problem-definition',
      'options-generation',
      'criteria-definition',
      'evaluation',
      'sensitivity-analysis',
      'decision'
    ] as const;
    
    const currentIndex = stageOrder.indexOf(session.stage);
    if (currentIndex < stageOrder.length - 1) {
      session.stage = stageOrder[currentIndex + 1];
    } else {
      // Reached final stage
      session.nextStageNeeded = false;
    }
  }
  
  private async processStage(session: DecisionFrameworkAnalysis): Promise<void> {
    switch (session.stage) {
      case 'problem-definition':
        // For problem definition, we just ensure we have a clear statement
        session.nextStageNeeded = true;
        break;
        
      case 'options-generation':
        // If we don't have options yet, generate some based on the decision statement
        if (session.options.length === 0) {
          session.options = this.generateSampleOptions(session.decisionStatement);
        }
        session.nextStageNeeded = true;
        break;
        
      case 'criteria-definition':
        // Generate criteria if needed
        if (!session.criteria || session.criteria.length === 0) {
          session.criteria = this.generateSampleCriteria(session.decisionStatement);
        }
        session.nextStageNeeded = true;
        break;
        
      case 'evaluation':
        // In a real implementation, this would evaluate options against criteria
        session.nextStageNeeded = true;
        break;
        
      case 'sensitivity-analysis':
        // This would test how robust the decision is to changes in assumptions
        session.nextStageNeeded = true;
        break;
        
      case 'decision':
        // Make final recommendation
        session.recommendation = this.generateRecommendation(session);
        session.rationale = this.generateRationale(session);
        session.nextStageNeeded = false;
        break;
    }
  }
  
  private generateSampleOptions(problem: string): Array<{id: string; name: string; description: string}> {
    // This is a simplified implementation - in production, this would use LLM to generate relevant options
    return [
      {
        id: uuidv4(),
        name: "Option A",
        description: `First approach to: ${problem}`
      },
      {
        id: uuidv4(),
        name: "Option B",
        description: `Alternative approach to: ${problem}`
      },
      {
        id: uuidv4(),
        name: "Option C",
        description: `Conservative solution to: ${problem}`
      }
    ];
  }
  
  private generateSampleCriteria(problem: string): Array<{id: string; name: string; description: string; weight: number}> {
    // This is a simplified implementation - in production, this would use LLM to generate relevant criteria
    return [
      {
        id: uuidv4(),
        name: "Cost",
        description: "Financial resources required",
        weight: 0.3
      },
      {
        id: uuidv4(),
        name: "Time",
        description: "Time to implement",
        weight: 0.2
      },
      {
        id: uuidv4(),
        name: "Quality",
        description: "Quality of outcome",
        weight: 0.3
      },
      {
        id: uuidv4(),
        name: "Risk",
        description: "Potential for negative outcomes",
        weight: 0.2
      }
    ];
  }
  
  private generateRecommendation(session: DecisionFrameworkAnalysis): string {
    // In a real implementation, this would provide a reasoned recommendation
    // based on the evaluation of options against criteria
    return `Based on the ${session.analysisType} analysis, Option A is recommended.`;
  }
  
  private generateRationale(session: DecisionFrameworkAnalysis): string {
    // In a real implementation, this would explain the reasoning behind the recommendation
    return `Option A provides the best balance of cost, quality, and risk management for this decision.`;
  }
} 