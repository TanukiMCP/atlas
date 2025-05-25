#!/usr/bin/env node

/**
 * Validation test for TanukiMCP Phase 3 implementation
 * Tests the built-in MCP server with subject-specific tools
 */

const { TanukiMCPServer } = require('./dist/server');
const fs = require('fs');
const path = require('path');

async function runValidationTests() {
  console.log('🧪 TanukiMCP Phase 3 Validation Tests');
  console.log('=====================================\n');

  const server = new TanukiMCPServer();
  let testsRun = 0;
  let testsPassed = 0;

  // Test helper function
  function test(name, fn) {
    testsRun++;
    try {
      console.log(`📋 Testing: ${name}`);
      const result = fn();
      if (result === true || (result && result.success)) {
        console.log(`✅ PASS: ${name}`);
        testsPassed++;
      } else {
        console.log(`❌ FAIL: ${name} - ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ FAIL: ${name} - ${error.message}`);
    }
    console.log('');
  }

  // Test 1: Server initialization
  test('Server Initialization', () => {
    return server instanceof TanukiMCPServer;
  });

  // Test 2: Subject Mode Manager
  test('Subject Mode Manager', () => {
    const currentMode = server.subjectModeManager?.getCurrentMode();
    return currentMode && currentMode.id === 'general';
  });

  // Test 3: Available Modes
  test('Available Subject Modes', () => {
    const modes = server.subjectModeManager?.getAvailableModes();
    return modes && modes.length >= 3; // Should have at least math, science, programming
  });

  // Test 4: Tool Registration
  test('Core Tools Registration', () => {
    // Check if tools are registered (simplified test)
    return server.fileOps && server.taskMgmt && server.mathTools;
  });

  // Test 5: File Operations Tool
  test('File Operations Tool Instance', () => {
    return server.fileOps && typeof server.fileOps.readFile === 'function';
  });

  // Test 6: Mathematics Tools
  test('Mathematics Tools Instance', () => {
    return server.mathTools && typeof server.mathTools.solveEquation === 'function';
  });

  // Test 7: Science Tools
  test('Science Tools Instance', () => {
    return server.scienceTools && typeof server.scienceTools.balanceEquation === 'function';
  });

  // Test 8: Programming Tools
  test('Programming Tools Instance', () => {
    return server.programmingTools && typeof server.programmingTools.analyzeCode === 'function';
  });

  // Test 9: Subject Mode Switching
  test('Subject Mode Switching', async () => {
    try {
      await server.switchSubjectMode('mathematics');
      const currentMode = server.subjectModeManager.getCurrentMode();
      return currentMode.id === 'mathematics';
    } catch (error) {
      console.log(`Mode switching error: ${error.message}`);
      return false;
    }
  });

  // Summary
  console.log('=====================================');
  console.log(`🏁 Tests completed: ${testsPassed}/${testsRun} passed`);
  
  if (testsPassed === testsRun) {
    console.log('🎉 All tests passed! Phase 3 implementation is ready.');
    console.log('\n📋 Next Steps for Phase 4:');
    console.log('- Implement MCP Client Hub for external server connections');
    console.log('- Add tool aggregation from multiple sources');
    console.log('- Implement health monitoring and auto-reconnection');
    return true;
  } else {
    console.log('⚠️  Some tests failed. Please review the implementation.');
    return false;
  }
}

// Run tests if called directly
if (require.main === module) {
  runValidationTests().catch(console.error);
}

module.exports = { runValidationTests };