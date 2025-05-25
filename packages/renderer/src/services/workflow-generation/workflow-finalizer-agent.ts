/**
 * LLM Agent 3: Workflow Finalizer & Templater (Hidden from User)
 * Validates and converts workflows to the locked template format
 */

import { BaseLLMAgent, LLMAgentConfig, LLMRequest, LLMResponse } from './base-llm-agent';
import { 
  WorkflowFinalizationRequest, 
  WorkflowFinalizationResponse,
  WorkflowTemplate,
  ValidationResult 
} from '../../types/workflow-types';

const FINALIZER_SYSTEM_PROMPT = `You are the Workflow Finalizer and Template Validator for TanukiMCP Atlas. Your critical role is to ensure all workflows conform perfectly to the locked template schema before they are saved.

CORE RESPONSIBILITIES:
1. Parse finalized workflow representations with absolute precision
2. Validate against the locked workflow template schema
3. Extract and structure all required information
4. Ensure complete schema compliance
5. Generate comprehensive validation reports
6. Transform free-form data into canonical structured format

SCHEMA VALIDATION REQUIREMENTS:
- All required fields must be present and properly typed
- Step IDs must be unique and follow naming conventions
- Tool calls must reference valid, available tools
- Parameter definitions must be complete and typed
- Flow logic must be sound (no orphaned steps, valid transitions)
- Error handling paths must be properly defined
- All string fields must meet length constraints
- Timestamps must be valid ISO 8601 format
- Version numbers must follow semantic versioning

CRITICAL VALIDATION POINTS:
1. **Structural Integrity**: Valid JSON structure, required fields
2. **Data Types**: Correct typing for all fields
3. **Logical Flow**: Steps connect properly, no circular references
4. **Tool Validation**: All referenced tools exist and are accessible
5. **Parameter Consistency**: Parameters used in steps are defined
6. **Error Handling**: Complete error paths and recovery strategies
7. **Naming Conventions**: IDs follow required patterns
8. **Constraints**: Length limits, value ranges, enum validation

FINALIZATION PROCESS:
1. Parse input (ASCII + partial workflow data)
2. Extract structural information from ASCII if needed
3. Validate all components against schema
4. Generate unique IDs where missing
5. Set timestamps and metadata
6. Ensure complete parameter definitions
7. Validate tool references
8. Check logical flow integrity
9. Generate final compliant workflow

OUTPUT FORMAT:
Always return a JSON response with this exact structure:
{
  "finalizedWorkflow": {complete WorkflowTemplate object},
  "validationResults": [
    {
      "field": "field_name",
      "isValid": boolean,
      "message": "detailed validation message",
      "severity": "error|warning|info"
    }
  ],
  "schemaCompliance": boolean
}

QUALITY STANDARDS:
- Zero tolerance for schema violations
- All workflows must be immediately executable
- Validation must be comprehensive and accurate
- Error messages must be actionable
- No data loss during transformation
- Maintain referential integrity throughout

Remember: You are the final quality gate. Every workflow that passes through you must be perfect and ready for production use.`;

export class WorkflowFinalizerAgent extends BaseLLMAgent {
  constructor() {
    const config: LLMAgentConfig = {
      id: 'workflow-finalizer-v1',
      name: 'Workflow Finalizer & Templater',
      role: 'finalizer',
      systemPrompt: FINALIZER_SYSTEM_PROMPT,
      model: 'gpt-4',
      temperature: 0.1, // Very low temperature for precise validation
      maxTokens: 4000
    };
    
    super(config);
  }

  /**
   * Finalize a workflow and ensure template compliance
   */
  async finalizeWorkflow(request: WorkflowFinalizationRequest): Promise<WorkflowFinalizationResponse> {
    const llmRequest: LLMRequest = {
      userMessage: this.formatFinalizationRequest(request),
      context: {
        availableTools: request.validationContext.availableTools,
        schemaVersion: request.validationContext.schemaVersion,
        constraints: request.validationContext.enforcedConstraints
      },
      temperature: 0.1 // Maximum precision
    };

    const response = await this.processRequest(llmRequest);
    return this.parseFinalizationResponse(response);
  }

  /**
   * Format the finalization request
   */
  private formatFinalizationRequest(request: WorkflowFinalizationRequest): string {
    const workflowJson = JSON.stringify(request.partialWorkflow, null, 2);
    
    return `Please finalize this workflow and ensure complete schema compliance:

PARTIAL WORKFLOW DATA:
${workflowJson}

ASCII VISUALIZATION:
${request.workflowVisualization}

VALIDATION CONTEXT:
- Available Tools: ${request.validationContext.availableTools.join(', ')}
- Schema Version: ${request.validationContext.schemaVersion}
- Enforced Constraints: ${request.validationContext.enforcedConstraints.join('; ')}

FINALIZATION REQUIREMENTS:
1. Validate against the complete workflow template schema
2. Generate any missing required fields (IDs, timestamps, etc.)
3. Ensure all tool references are valid
4. Validate logical flow and step connections
5. Complete parameter definitions with proper typing
6. Add metadata and usage statistics structure
7. Ensure version compatibility and compliance
8. Generate comprehensive validation report

MANDATORY FIELDS TO COMPLETE:
- workflowId (if missing, generate unique identifier)
- version (use semantic versioning, default 1.0.0)
- createdAt (current ISO timestamp)
- updatedAt (current ISO timestamp)
- Complete parameter validation rules
- Proper error handling for all steps
- Metadata including complexity assessment

Please ensure the finalized workflow is 100% schema compliant and ready for immediate execution.`;
  }

  /**
   * Parse and validate the finalization response
   */
  private parseFinalizationResponse(response: LLMResponse): WorkflowFinalizationResponse {
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in finalization response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!parsed.finalizedWorkflow || !parsed.validationResults || parsed.schemaCompliance === undefined) {
        throw new Error('Missing required fields in finalization response');
      }

      // Validate the finalized workflow structure
      this.validateWorkflowStructure(parsed.finalizedWorkflow);

      // Validate validation results array
      if (!Array.isArray(parsed.validationResults)) {
        throw new Error('Validation results must be an array');
      }

      // Validate each validation result
      parsed.validationResults.forEach((result: any, index: number) => {
        if (!result.field || result.isValid === undefined || !result.message || !result.severity) {
          throw new Error(`Invalid validation result at index ${index}`);
        }
        
        if (!['error', 'warning', 'info'].includes(result.severity)) {
          throw new Error(`Invalid severity level: ${result.severity}`);
        }
      });

      return {
        finalizedWorkflow: parsed.finalizedWorkflow,
        validationResults: parsed.validationResults,
        schemaCompliance: parsed.schemaCompliance
      };
    } catch (error) {
      throw new Error(`Failed to parse finalization response: ${error.message}`);
    }
  }

  /**
   * Validate the basic structure of a finalized workflow
   */
  private validateWorkflowStructure(workflow: WorkflowTemplate): void {
    const requiredFields = [
      'workflowId', 'name', 'description', 'version', 
      'createdAt', 'steps', 'parameters'
    ];
    
    requiredFields.forEach(field => {
      if (!(field in workflow)) {
        throw new Error(`Missing required field: ${field}`);
      }
    });

    // Validate steps array
    if (!Array.isArray(workflow.steps) || workflow.steps.length === 0) {
      throw new Error('Workflow must have at least one step');
    }

    // Validate parameters array
    if (!Array.isArray(workflow.parameters)) {
      throw new Error('Parameters must be an array');
    }

    // Validate step structure
    workflow.steps.forEach((step, index) => {
      const stepRequiredFields = [
        'stepId', 'name', 'description', 'toolCalls', 
        'inputs', 'outputs', 'onSuccess', 'onError'
      ];
      
      stepRequiredFields.forEach(field => {
        if (!(field in step)) {
          throw new Error(`Step ${index} missing required field: ${field}`);
        }
      });
    });
  }

  /**
   * Call the LLM API implementation
   */
  protected async callLLMAPI(
    messages: Array<{ role: string; content: string }>,
    options: { temperature: number; maxTokens: number; timeout: number }
  ): Promise<{ content: string; tokensUsed: number; metadata?: any }> {
    // Simulate finalization response
    const finalizedWorkflow: WorkflowTemplate = {
      workflowId: `workflow_${Date.now()}`,
      name: "Finalized Custom Workflow",
      description: "A fully validated and schema-compliant workflow",
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["custom", "finalized"],
      steps: [
        {
          stepId: "start_step",
          name: "Initialize Workflow",
          description: "Initialize the workflow execution",
          toolCalls: [],
          inputs: ["user_input"],
          outputs: ["initialized_context"],
          onSuccess: "end",
          onError: "abort"
        }
      ],
      parameters: [
        {
          name: "user_input",
          type: "string",
          description: "User input for the workflow",
          required: true
        }
      ],
      metadata: {
        complexity: "simple",
        estimatedDuration: 60,
        dependencies: [],
        usageStats: {
          executionCount: 0,
          successRate: 0,
          averageDuration: 0
        }
      }
    };

    const validationResults: ValidationResult[] = [
      {
        field: "workflowId",
        isValid: true,
        message: "Unique workflow ID generated successfully",
        severity: "info"
      },
      {
        field: "steps",
        isValid: true,
        message: "All steps validated successfully",
        severity: "info"
      },
      {
        field: "parameters",
        isValid: true,
        message: "Parameter definitions are complete and valid",
        severity: "info"
      }
    ];

    const simulatedResponse = {
      content: JSON.stringify({
        finalizedWorkflow,
        validationResults,
        schemaCompliance: true
      }),
      tokensUsed: 800,
      metadata: {
        model: this.model,
        temperature: options.temperature,
        validationPassed: true
      }
    };

    return simulatedResponse;
  }

  /**
   * Validate response format
   */
  protected validateResponse(content: string): boolean {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return false;
      
      const parsed = JSON.parse(jsonMatch[0]);
      return !!(
        parsed.finalizedWorkflow && 
        parsed.validationResults && 
        parsed.schemaCompliance !== undefined
      );
    } catch {
      return false;
    }
  }

  /**
   * Generate validation summary
   */
  generateValidationSummary(validationResults: ValidationResult[]): {
    errorCount: number;
    warningCount: number;
    infoCount: number;
    isValid: boolean;
    criticalIssues: ValidationResult[];
  } {
    const errors = validationResults.filter(r => r.severity === 'error');
    const warnings = validationResults.filter(r => r.severity === 'warning');
    const infos = validationResults.filter(r => r.severity === 'info');
    
    return {
      errorCount: errors.length,
      warningCount: warnings.length,
      infoCount: infos.length,
      isValid: errors.length === 0,
      criticalIssues: errors
    };
  }

  /**
   * Apply automatic fixes for common validation issues
   */
  applyAutomaticFixes(workflow: Partial<WorkflowTemplate>): {
    fixedWorkflow: Partial<WorkflowTemplate>;
    appliedFixes: string[];
  } {
    const fixedWorkflow = { ...workflow };
    const appliedFixes: string[] = [];

    // Generate missing workflowId
    if (!fixedWorkflow.workflowId) {
      fixedWorkflow.workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      appliedFixes.push('Generated unique workflow ID');
    }

    // Set default version
    if (!fixedWorkflow.version) {
      fixedWorkflow.version = '1.0.0';
      appliedFixes.push('Set default version to 1.0.0');
    }

    // Set timestamps
    const now = new Date().toISOString();
    if (!fixedWorkflow.createdAt) {
      fixedWorkflow.createdAt = now;
      appliedFixes.push('Set creation timestamp');
    }
    
    fixedWorkflow.updatedAt = now;
    appliedFixes.push('Updated modification timestamp');

    // Initialize empty arrays if missing
    if (!fixedWorkflow.tags) {
      fixedWorkflow.tags = [];
      appliedFixes.push('Initialized empty tags array');
    }

    if (!fixedWorkflow.parameters) {
      fixedWorkflow.parameters = [];
      appliedFixes.push('Initialized empty parameters array');
    }

    return { fixedWorkflow, appliedFixes };
  }
}