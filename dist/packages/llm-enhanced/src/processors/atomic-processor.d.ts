import { BaseProcessor } from './base-processor';
import { ProcessingRequest, ProcessingResponse, QualityMetrics } from '../types/llm-types';
export declare class AtomicProcessor extends BaseProcessor {
    private responseCache;
    private modelName;
    constructor();
    process(request: ProcessingRequest): Promise<ProcessingResponse>;
    protected generateResponse(request: ProcessingRequest): Promise<string>;
    protected calculateQuality(response: string, request: ProcessingRequest): Promise<QualityMetrics>;
    protected getModelName(): string;
    protected getProcessingSteps(request: ProcessingRequest): any[];
    private initializeCache;
    private generateCacheKey;
    private buildAtomicPrompt;
    private callOllamaModel;
    private generateTemplateResponse;
    private containsDirectAnswer;
    private assessCoherence;
    clearCache(): void;
    getCacheSize(): number;
    getCacheHitRate(): number;
}
//# sourceMappingURL=atomic-processor.d.ts.map