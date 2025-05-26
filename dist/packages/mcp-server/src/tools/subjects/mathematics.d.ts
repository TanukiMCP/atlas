import { ToolResult } from '../../types';
export declare class MathematicsTools {
    solveEquation(params: {
        equation: string;
        variables?: string[];
        showSteps?: boolean;
        outputFormat?: 'text' | 'latex' | 'ascii';
    }): Promise<ToolResult>;
    plotFunction(params: {
        function: string;
        xRange?: [number, number];
        yRange?: [number, number];
        resolution?: number;
        outputPath?: string;
    }): Promise<ToolResult>;
    private performAlgebraicSolution;
    private generatePlot;
    calculateIntegral(params: any): Promise<ToolResult>;
    analyzeFunction(params: any): Promise<ToolResult>;
}
//# sourceMappingURL=mathematics.d.ts.map