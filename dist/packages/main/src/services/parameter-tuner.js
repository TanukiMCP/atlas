"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterTuner = void 0;
class ParameterTuner {
    presets = new Map();
    tuningHistory = [];
    constructor() {
        this.initializePresets();
    }
    getPreset(task) {
        return this.presets.get(task);
    }
    getDefaultParameters() {
        return {
            temperature: 0.5,
            top_p: 0.9,
            top_k: 40,
            repeat_penalty: 1.1,
            num_ctx: 2048
        };
    }
    getAllPresets() {
        return new Map(this.presets);
    }
    initializePresets() {
        this.presets.set('coding', {
            temperature: 0.1,
            top_p: 0.95,
            top_k: 40,
            repeat_penalty: 1.1,
            num_ctx: 4096
        });
        this.presets.set('creative', {
            temperature: 0.8,
            top_p: 0.9,
            top_k: 50,
            repeat_penalty: 1.05,
            num_ctx: 2048
        });
        this.presets.set('analytical', {
            temperature: 0.2,
            top_p: 0.9,
            top_k: 30,
            repeat_penalty: 1.15,
            num_ctx: 4096
        });
        this.presets.set('conversational', {
            temperature: 0.7,
            top_p: 0.95,
            top_k: 40,
            repeat_penalty: 1.1,
            num_ctx: 2048
        });
    }
    async generateParameterVariations(base) {
        const variations = [];
        const tempVariations = [base.temperature * 0.8, base.temperature, base.temperature * 1.2];
        const topPVariations = [Math.max(0.1, base.top_p - 0.1), base.top_p, Math.min(1.0, base.top_p + 0.1)];
        for (const temp of tempVariations) {
            for (const topP of topPVariations) {
                variations.push({
                    ...base,
                    temperature: Math.max(0.01, Math.min(2.0, temp)),
                    top_p: topP
                });
            }
        }
        return variations;
    }
    async optimizeForTask(task, modelName) {
        const preset = this.getPreset(task) || this.getDefaultParameters();
        return preset; // Simplified - would implement actual optimization
    }
}
exports.ParameterTuner = ParameterTuner;
//# sourceMappingURL=parameter-tuner.js.map