"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PROCESSING_REQUIREMENTS = exports.DEFAULT_USER_PREFERENCES = exports.TIER_CONFIGURATIONS = exports.TournamentBracket = exports.PerformanceTracker = exports.UserControls = exports.AtomicProcessor = exports.BaseProcessor = exports.RequestClassifier = exports.LLMRouter = void 0;
exports.createLLMRouter = createLLMRouter;
exports.requiresUserApproval = requiresUserApproval;
exports.calculateOptimalTier = calculateOptimalTier;
// Main LLM Router
var llm_router_1 = require("./router/llm-router");
Object.defineProperty(exports, "LLMRouter", { enumerable: true, get: function () { return llm_router_1.LLMRouter; } });
var request_classifier_1 = require("./router/request-classifier");
Object.defineProperty(exports, "RequestClassifier", { enumerable: true, get: function () { return request_classifier_1.RequestClassifier; } });
// Base Processor Architecture
var base_processor_1 = require("./processors/base-processor");
Object.defineProperty(exports, "BaseProcessor", { enumerable: true, get: function () { return base_processor_1.BaseProcessor; } });
var atomic_processor_1 = require("./processors/atomic-processor");
Object.defineProperty(exports, "AtomicProcessor", { enumerable: true, get: function () { return atomic_processor_1.AtomicProcessor; } });
// User Intervention System
var user_controls_1 = require("./intervention/user-controls");
Object.defineProperty(exports, "UserControls", { enumerable: true, get: function () { return user_controls_1.UserControls; } });
// Performance Tracking
var performance_tracker_1 = require("./analytics/performance-tracker");
Object.defineProperty(exports, "PerformanceTracker", { enumerable: true, get: function () { return performance_tracker_1.PerformanceTracker; } });
// Tournament Quality Assurance
var tournament_bracket_1 = require("./quality-assurance/tournament-bracket");
Object.defineProperty(exports, "TournamentBracket", { enumerable: true, get: function () { return tournament_bracket_1.TournamentBracket; } });
// Type Definitions
__exportStar(require("./types/llm-types"), exports);
// Helper function to create a configured LLM Router
function createLLMRouter() {
    return new LLMRouter();
}
// Helper function to determine if a request needs intervention approval
function requiresUserApproval(tier, estimatedTime, userPreferences) {
    // Expert tier always requires approval unless explicitly allowed
    if (tier === 'expert' && !userPreferences.allowExpertProcessing) {
        return true;
    }
    // Long processing times require approval
    if (estimatedTime > userPreferences.maxWaitTime) {
        return true;
    }
    // High intervention level users want to approve complex operations
    if (userPreferences.interventionLevel === 'high' && (tier === 'complex' || tier === 'expert')) {
        return true;
    }
    return false;
}
// Helper function to calculate optimal tier based on requirements
function calculateOptimalTier(requirements) {
    let score = 0;
    // Base complexity
    if (requirements.requiresMultiStep)
        score += 3;
    if (requirements.requiresReasoning)
        score += 2;
    if (requirements.requiresCreativity && requirements.requiresFactualAccuracy)
        score += 2;
    if (requirements.requiresCodeGeneration)
        score += 1;
    if (requirements.requiresMathematics)
        score += 1;
    // Quality requirements
    if (requirements.minQuality > 90)
        score += 3;
    else if (requirements.minQuality > 80)
        score += 2;
    else if (requirements.minQuality > 70)
        score += 1;
    // Latency constraints (negative scoring for time pressure)
    if (requirements.maxLatency < 2000)
        score -= 2;
    else if (requirements.maxLatency < 5000)
        score -= 1;
    // Map score to tier
    if (score >= 6)
        return 'expert';
    if (score >= 4)
        return 'complex';
    if (score >= 2)
        return 'moderate';
    return 'atomic';
}
// Constants for system configuration
exports.TIER_CONFIGURATIONS = {
    atomic: {
        timeout: 1000,
        qualityRange: [60, 80],
        models: ['llama3.2:1b'],
        features: ['caching', 'templates']
    },
    moderate: {
        timeout: 5000,
        qualityRange: [75, 85],
        models: ['llama3.2:3b', 'llama3.1:8b'],
        features: ['reasoning', 'tools']
    },
    complex: {
        timeout: 15000,
        qualityRange: [85, 95],
        models: ['deepseek-r1-distill-qwen:14b', 'qwq:32b'],
        features: ['multi-step', 'tool-chaining', 'validation']
    },
    expert: {
        timeout: 45000,
        qualityRange: [90, 98],
        models: ['qwq:32b', 'deepseek-r1-distill-qwen:32b'],
        features: ['multi-model', 'tournament', 'comprehensive-tools']
    }
};
exports.DEFAULT_USER_PREFERENCES = {
    qualityVsSpeed: 50,
    allowExpertProcessing: false,
    enableQualityAssurance: true,
    maxWaitTime: 30000,
    interventionLevel: 'balanced'
};
exports.DEFAULT_PROCESSING_REQUIREMENTS = {
    minQuality: 75,
    maxLatency: 10000,
    requiresReasoning: false,
    requiresCreativity: false,
    requiresFactualAccuracy: true,
    requiresCodeGeneration: false,
    requiresMathematics: false,
    requiresMultiStep: false
};
//# sourceMappingURL=index.js.map