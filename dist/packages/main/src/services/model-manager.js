"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelManager = void 0;
const ollama_service_1 = require("./ollama-service");
const hardware_assessor_1 = require("./hardware-assessor");
class ModelManager {
    ollamaService;
    hardwareAssessor;
    installations = new Map();
    configurations = new Map();
    constructor() {
        this.ollamaService = new ollama_service_1.OllamaService();
        this.hardwareAssessor = new hardware_assessor_1.HardwareAssessor();
    }
    async getRecommendedModels() {
        const catalog = await this.ollamaService.getModelCatalog();
        const systemCaps = await this.hardwareAssessor.assessSystemCapabilities();
        return this.hardwareAssessor.getModelRecommendations(systemCaps, catalog);
    }
    async installModel(modelName, onProgress) {
        const installation = {
            modelName,
            status: 'downloading',
            progress: 0
        };
        this.installations.set(modelName, installation);
        onProgress?.(installation);
        try {
            await this.ollamaService.pullModelWithOptimization(modelName, (progress) => {
                installation.progress = this.calculateProgress(progress);
                installation.status = progress.status === 'success' ? 'completed' : 'downloading';
                this.installations.set(modelName, installation);
                onProgress?.(installation);
            });
            installation.status = 'completed';
            installation.progress = 100;
            this.installations.set(modelName, installation);
            onProgress?.(installation);
        }
        catch (error) {
            installation.status = 'failed';
            installation.error = error.message;
            this.installations.set(modelName, installation);
            onProgress?.(installation);
            throw error;
        }
    }
    async uninstallModel(modelName) {
        try {
            await this.ollamaService.deleteModel(modelName);
            this.installations.delete(modelName);
            this.configurations.delete(modelName);
        }
        catch (error) {
            throw new Error(`Failed to uninstall model ${modelName}: ${error.message}`);
        }
    }
    calculateProgress(progress) {
        if (progress.completed && progress.total) {
            return Math.round((progress.completed / progress.total) * 100);
        }
        return 0;
    }
    getInstallationStatus(modelName) {
        return this.installations.get(modelName);
    }
}
exports.ModelManager = ModelManager;
//# sourceMappingURL=model-manager.js.map