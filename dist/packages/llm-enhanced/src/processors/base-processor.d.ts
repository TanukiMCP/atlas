import { EventEmitter } from 'eventemitter3';
import { ProcessingRequest, ProcessingResponse, ProcessingTier, QualityMetrics } from '../types/llm-types';
export interface ProcessorEvents {
    'processing:started': (requestId: string) => void;
    'processing:progress': (requestId: string, progress: number) => void;
    'processing:completed': (requestId: string, response: ProcessingResponse) => void;
    'processing:error': (requestId: string, error: Error) => void;
    'quality:calculated': (requestId: string, metrics: QualityMetrics) => void;
}
export declare abstract class BaseProcessor extends EventEmitter<ProcessorEvents> {
    protected tier: ProcessingTier;
    protected isProcessing: boolean;
    protected activeRequests: Map<string, AbortController>;
    constructor(tier: ProcessingTier);
    abstract process(request: ProcessingRequest): Promise<ProcessingResponse>;
    protected abstract generateResponse(request: ProcessingRequest): Promise<string>;
    protected abstract calculateQuality(response: string, request: ProcessingRequest): Promise<QualityMetrics>;
    protected processWithTimeout(request: ProcessingRequest, timeoutMs?: number): Promise<ProcessingResponse>;
    cancelRequest(requestId: string): Promise<void>;
    protected getDefaultTimeout(): number;
    protected calculateConfidence(metrics: QualityMetrics): number;
    protected extractReasoning(content: string): string[];
    protected extractCitations(content: string): string[];
    protected estimateTokenCount(content: string): number;
    protected abstract getModelName(): string;
    protected abstract getProcessingSteps(request: ProcessingRequest): any[];
    getHealth(): Promise<ProcessorHealth>;
    protected getAverageProcessingTime(): Promise<number>;
    protected getSuccessRate(): Promise<number>;
}
export interface ProcessorHealth {
    tier: ProcessingTier;
    isHealthy: boolean;
    activeRequests: number;
    averageProcessingTime: number;
    successRate: number;
}
//# sourceMappingURL=base-processor.d.ts.map