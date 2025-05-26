interface ParameterSet {
    temperature: number;
    top_p: number;
    top_k: number;
    repeat_penalty: number;
    num_ctx: number;
    seed?: number;
}
export declare class ParameterTuner {
    private presets;
    private tuningHistory;
    constructor();
    getPreset(task: string): ParameterSet | undefined;
    getDefaultParameters(): ParameterSet;
    getAllPresets(): Map<string, ParameterSet>;
    private initializePresets;
    generateParameterVariations(base: ParameterSet): Promise<ParameterSet[]>;
    optimizeForTask(task: string, modelName: string): Promise<ParameterSet>;
}
export {};
//# sourceMappingURL=parameter-tuner.d.ts.map