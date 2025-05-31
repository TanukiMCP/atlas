import { Request, Response } from 'express';
import { DecisionFrameworkTool, DecisionFrameworkType } from '../tools/decision-framework';

const tool = new DecisionFrameworkTool();

export const decisionFrameworkController = {
  /**
   * Apply a decision framework to analyze a problem
   */
  async analyze(req: Request, res: Response) {
    try {
      const { 
        decisionStatement, 
        analysisType, 
        options,
        sessionId 
      } = req.body;
      
      // Validate required parameters
      if (!decisionStatement) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required parameter: decisionStatement' 
        });
      }
      
      if (!analysisType || !Object.values(DecisionFrameworkType).includes(analysisType)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid or missing analysisType. Must be one of: ${Object.values(DecisionFrameworkType).join(', ')}` 
        });
      }
      
      // Apply the decision framework
      const result = await tool.analyze(
        decisionStatement,
        analysisType as DecisionFrameworkType,
        options,
        sessionId
      );
      
      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in decision framework analysis:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
}; 