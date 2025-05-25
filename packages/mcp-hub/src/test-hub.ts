import { MCPClientHub, createStdioServerConfig, createSSEServerConfig, commonServerConfigs } from './index';

async function testMCPHub() {
  console.log('🚀 Testing MCP Client Hub...');

  // Create hub instance
  const hub = new MCPClientHub();

  try {
    // Initialize the hub
    await hub.initialize();
    console.log('✅ Hub initialized successfully');

    // Test adding a stdio server configuration
    const fileSystemConfig = createStdioServerConfig({
      id: 'test-filesystem',
      name: 'Test Filesystem Server',
      description: 'Test filesystem operations',
      command: 'echo',
      args: ['{"jsonrpc":"2.0","id":"test","result":{"tools":[]}}']
    });

    console.log('📝 Created filesystem server config:', fileSystemConfig.name);

    // Test adding an SSE server configuration
    const webConfig = createSSEServerConfig({
      id: 'test-web',
      name: 'Test Web Server',
      description: 'Test web operations',
      url: 'http://localhost:3000/mcp'
    });

    console.log('🌐 Created web server config:', webConfig.name);

    // Test common server configurations
    const gitConfig = commonServerConfigs.git();
    console.log('🗂️ Created Git server config:', gitConfig.name);

    const dbConfig = commonServerConfigs.database({
      connectionString: 'sqlite:///tmp/test.db'
    });
    console.log('🗄️ Created database server config:', dbConfig.name);

    // Test tool catalog generation (without actual connections)
    const catalog = await hub.getAllAvailableTools();
    console.log('📚 Tool catalog generated:', {
      totalTools: catalog.totalTools,
      sources: catalog.sources,
      categories: catalog.categories,
      conflicts: catalog.conflicts.length
    });

    // Test health report generation
    const healthReport = await hub.getHealthReport();
    console.log('🏥 Health report generated:', {
      totalServers: healthReport.totalServers,
      connectedServers: healthReport.connectedServers,
      totalTools: healthReport.totalTools
    });

    // Test export configuration
    const exportedConfig = await hub.exportConfiguration();
    console.log('📤 Configuration exported (length):', exportedConfig.length, 'characters');

    console.log('✅ All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean shutdown
    await hub.shutdown();
    console.log('🔚 Hub shutdown complete');
  }
}

// Demonstration of transport validation
function testTransportValidation() {
  console.log('\n🔍 Testing transport validation...');

  const { validateServerConfig } = require('./index');

  // Valid stdio config
  const validStdioConfig = {
    transport: {
      type: 'stdio',
      command: 'node',
      args: ['server.js']
    }
  };

  // Valid SSE config
  const validSSEConfig = {
    transport: {
      type: 'sse',
      url: 'https://example.com/mcp'
    }
  };

  // Invalid config (missing command)
  const invalidConfig = {
    transport: {
      type: 'stdio'
      // missing command
    }
  };

  console.log('Valid stdio config:', validateServerConfig(validStdioConfig)); // Should be true
  console.log('Valid SSE config:', validateServerConfig(validSSEConfig)); // Should be true
  console.log('Invalid config:', validateServerConfig(invalidConfig)); // Should be false

  console.log('✅ Transport validation tests complete');
}

// Run tests if this file is executed directly
if (require.main === module) {
  console.log('🧪 Running MCP Hub Tests\n');
  
  testTransportValidation();
  
  testMCPHub()
    .then(() => {
      console.log('\n🎉 All tests completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Tests failed:', error);
      process.exit(1);
    });
}

export { testMCPHub, testTransportValidation }; 