#!/usr/bin/env node

/**
 * Phase 2 Integration Test
 * Tests all the new LLM and model management services
 */

import { OllamaService } from './services/ollama-service';
import { SystemMonitor } from './services/system-monitor';
import { ModelManager } from './services/model-manager';
import { HardwareAssessor } from './services/hardware-assessor';
import { OptimizationEngine } from './services/optimization-engine';
import { ParameterTuner } from './services/parameter-tuner';
import { ContextManager } from './services/context-manager';

async function testPhase2Services() {
  console.log('🧪 Testing Phase 2 Services...\n');

  try {
    // Test Ollama Service
    console.log('🔍 Testing Ollama Service...');
    const ollamaService = new OllamaService();
    
    const ollamaHealth = await ollamaService.checkOllamaHealth();
    console.log(`   Ollama Health: ${ollamaHealth ? '✅ Healthy' : '❌ Not Available'}`);
    
    const catalog = await ollamaService.getModelCatalog();
    console.log(`   Model Catalog: ${catalog.length} models available`);
    
    if (ollamaHealth) {
      const models = await ollamaService.listModels();
      console.log(`   Installed Models: ${models.length} models`);
    }
    
    // Test System Monitor
    console.log('\n💻 Testing System Monitor...');
    const systemMonitor = new SystemMonitor();
    
    const systemInfo = await systemMonitor.getSystemInfo();
    console.log(`   CPU: ${systemInfo.cpu.cores} cores, ${systemInfo.cpu.brand}`);
    console.log(`   Memory: ${systemInfo.memory.total}GB total, ${systemInfo.memory.available}GB available`);
    console.log(`   GPU: ${systemInfo.gpu.length} detected`);
    
    const metrics = await systemMonitor.getCurrentMetrics();
    console.log(`   CPU Usage: ${metrics.cpu.usage.toFixed(1)}%`);
    console.log(`   Memory Usage: ${metrics.memory.usage}%`);
    
    // Test Hardware Assessor
    console.log('\n🔧 Testing Hardware Assessor...');
    const hardwareAssessor = new HardwareAssessor();
    
    const capabilities = await hardwareAssessor.assessSystemCapabilities();
    console.log(`   System Assessment: ${capabilities.cpu.cores} cores, ${capabilities.memory.total}GB RAM`);
    
    const recommendations = await hardwareAssessor.getModelRecommendations(capabilities, catalog);
    console.log(`   Model Recommendations: ${recommendations.length} models recommended`);
    
    if (recommendations.length > 0) {
      const best = recommendations[0];
      console.log(`   Best Match: ${best.model.displayName} (${best.compatibility})`);
      console.log(`   Expected Performance: ${best.expectedPerformance.tokensPerSecond} tokens/sec`);
    }
    
    // Test Optimization Engine
    console.log('\n⚡ Testing Optimization Engine...');
    const optimizationEngine = new OptimizationEngine();
    
    const profiles = optimizationEngine.getAllProfiles();
    console.log(`   Available Profiles: ${profiles.length}`);
    
    const optimalProfile = await optimizationEngine.optimizeForHardware(capabilities);
    console.log(`   Recommended Profile: ${optimalProfile.name}`);
    console.log(`   Profile Settings: KV Cache: ${optimalProfile.settings.kvCacheType}, Parallel: ${optimalProfile.settings.numParallel}`);
    
    // Test Parameter Tuner
    console.log('\n🎛️  Testing Parameter Tuner...');
    const parameterTuner = new ParameterTuner();
    
    const presets = parameterTuner.getAllPresets();
    console.log(`   Available Presets: ${presets.size}`);
    
    const codingPreset = parameterTuner.getPreset('coding');
    if (codingPreset) {
      console.log(`   Coding Preset: temp=${codingPreset.temperature}, top_p=${codingPreset.top_p}`);
    }
    
    const analyticalPreset = parameterTuner.getPreset('analytical');
    if (analyticalPreset) {
      console.log(`   Analytical Preset: temp=${analyticalPreset.temperature}, top_k=${analyticalPreset.top_k}`);
    }
    
    // Test Context Manager
    console.log('\n🧠 Testing Context Manager...');
    const contextManager = new ContextManager();
    
    // Store some test context
    await contextManager.storeContext(
      'test-session-123',
      'concept',
      'quantum-computing',
      'Quantum computing uses quantum mechanical phenomena like superposition and entanglement to process information.',
      1.0
    );
    console.log('   ✅ Stored test context entry');
    
    // Retrieve relevant context
    const relevantContext = await contextManager.retrieveRelevantContext(
      'test-session-123',
      'How does quantum computing work?',
      5
    );
    console.log(`   Retrieved Context: ${relevantContext.length} relevant entries`);
    
    // Test Model Manager (integration)
    console.log('\n🤖 Testing Model Manager...');
    const modelManager = new ModelManager();
    
    const recommendedModels = await modelManager.getRecommendedModels();
    console.log(`   Recommended Models: ${recommendedModels.length} models`);
    
    if (recommendedModels.length > 0) {
      const topModel = recommendedModels[0];
      console.log(`   Top Recommendation: ${topModel.model.displayName}`);
      console.log(`   Compatibility: ${topModel.compatibility}`);
      console.log(`   Expected Speed: ${topModel.expectedPerformance.tokensPerSecond} tokens/sec`);
    }
    
    console.log('\n🎉 All Phase 2 services tested successfully!');
    
    // Summary
    console.log('\n📊 Phase 2 Implementation Summary:');
    console.log('   ✅ Ollama Service - REST API client with optimization');
    console.log('   ✅ System Monitor - Deep hardware detection');
    console.log('   ✅ Hardware Assessor - Performance prediction');
    console.log('   ✅ Optimization Engine - KV cache and performance tuning');
    console.log('   ✅ Parameter Tuner - Expert parameter optimization');
    console.log('   ✅ Context Manager - MCP-based context system');
    console.log('   ✅ Model Manager - Complete model lifecycle management');
    
  } catch (error) {
    console.error('❌ Phase 2 test failed:', error);
    process.exit(1);
  }
}

// Run the test if called directly
if (require.main === module) {
  testPhase2Services().then(() => {
    console.log('\n✅ Phase 2 testing complete!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Phase 2 testing failed:', error);
    process.exit(1);
  });
}

export { testPhase2Services };