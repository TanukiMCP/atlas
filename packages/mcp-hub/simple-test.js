const { MCPClientHub, createStdioServerConfig } = require('./dist/index.js');

async function simpleTest() {
  console.log('🧪 Simple MCP Hub Test');
  
  try {
    // Test basic instantiation
    console.log('Creating MCPClientHub...');
    const hub = new MCPClientHub();
    console.log('✅ Hub created successfully');
    
    // Test configuration creation
    console.log('Creating server config...');
    const config = createStdioServerConfig({
      id: 'test-server',
      name: 'Test Server',
      description: 'Test description',
      command: 'echo',
      args: ['test']
    });
    console.log('✅ Server config created:', config.name);
    
    // Test initialization
    console.log('Initializing hub...');
    await hub.initialize();
    console.log('✅ Hub initialized successfully');
    
    // Test getting tools without any servers
    console.log('Getting tool catalog...');
    const catalog = await hub.getAllAvailableTools();
    console.log('✅ Tool catalog retrieved:', catalog.totalTools, 'tools');
    
    // Test health report
    console.log('Getting health report...');
    const health = await hub.getHealthReport();
    console.log('✅ Health report retrieved:', health.totalServers, 'servers');
    
    // Test shutdown
    console.log('Shutting down hub...');
    await hub.shutdown();
    console.log('✅ Hub shutdown complete');
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

simpleTest(); 