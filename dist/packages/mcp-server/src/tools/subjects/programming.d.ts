import { ToolResult } from '../../types';
export declare class ProgrammingTools {
    analyzeCode(params: {
        filePath: string;
        analysisType?: string[];
        language?: string;
    }): Promise<ToolResult>;
    generateTests(params: {
        filePath: string;
        functions?: string[];
        framework?: string;
        coverage?: string;
    }): Promise<ToolResult>;
    private detectLanguage;
    private calculateComplexity;
    private analyzeStructure;
    private assessQuality;
    private checkSecurity;
    private analyzePerformance;
    private generateSuggestions;
    private extractFunctions;
    private createTestSuite;
}
//# sourceMappingURL=programming.d.ts.map