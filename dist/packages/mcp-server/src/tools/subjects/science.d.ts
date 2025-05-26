import { ToolResult } from '../../types';
export declare class ScienceTools {
    balanceEquation(params: {
        equation: string;
        showSteps?: boolean;
        calculateMass?: boolean;
    }): Promise<ToolResult>;
    runSimulation(params: {
        simulationType: 'projectile' | 'pendulum' | 'wave' | 'circuit';
        parameters: any;
        duration?: number;
        outputFormat?: 'data' | 'plot' | 'animation';
    }): Promise<ToolResult>;
    private performChemicalBalancing;
    private executeSimulation;
    unitConversion(params: {
        value: number;
        fromUnit: string;
        toUnit: string;
        quantity: string;
    }): Promise<ToolResult>;
}
//# sourceMappingURL=science.d.ts.map