import { Request, Response } from 'express';
import { MentalModelsTool, MentalModel } from '../tools/mental-models';

const tool = new MentalModelsTool();

export const mentalModelsController = {
  /**
   * Apply a mental model to a problem
   */
  async apply(req: Request, res: Response) {
    try {
      const { modelName, problem } = req.body;
      
      // Validate required parameters
      if (!modelName) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required parameter: modelName' 
        });
      }
      
      if (!problem) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required parameter: problem' 
        });
      }
      
      // Convert string model name to enum
      let modelEnum: MentalModel;
      switch (modelName.toLowerCase()) {
        case 'first_principles':
          modelEnum = MentalModel.FIRST_PRINCIPLES;
          break;
        case 'opportunity_cost':
          modelEnum = MentalModel.OPPORTUNITY_COST;
          break;
        case 'error_propagation':
          modelEnum = MentalModel.ERROR_PROPAGATION;
          break;
        case 'rubber_duck':
          modelEnum = MentalModel.RUBBER_DUCK;
          break;
        case 'pareto_principle':
          modelEnum = MentalModel.PARETO_PRINCIPLE;
          break;
        case 'occams_razor':
          modelEnum = MentalModel.OCCAMS_RAZOR;
          break;
        default:
          return res.status(400).json({
            success: false,
            error: `Invalid model name. Must be one of: first_principles, opportunity_cost, error_propagation, rubber_duck, pareto_principle, occams_razor`
          });
      }
      
      // Apply the mental model
      const result = await tool.execute({
        modelName: modelEnum,
        problem
      });
      
      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in mental model analysis:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
}; 