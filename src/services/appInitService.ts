import { userMCPConfigService } from './userMCPConfigService';
import { mcpServerDetectionService } from './mcpServerDetectionService';

/**
 * Service responsible for initializing application services at startup
 */
class AppInitService {
  /**
   * Initialize all application services
   */
  async initialize(): Promise<void> {
    console.log('Initializing application services...');
    
    // Initialize user MCP configuration
    await this.initializeUserMCPConfig();
    
    // Initialize MCP server detection
    this.initializeMCPServerDetection();
    
    console.log('Application services initialized');
  }
  
  /**
   * Initialize user MCP configuration
   */
  private async initializeUserMCPConfig(): Promise<void> {
    try {
      console.log('Initializing user MCP configuration...');
      await userMCPConfigService.initialize();
      console.log('User MCP configuration initialized');
    } catch (error) {
      console.error('Failed to initialize user MCP configuration:', error);
    }
  }
  
  /**
   * Initialize MCP server detection
   */
  private initializeMCPServerDetection(): void {
    try {
      console.log('Initializing MCP server detection...');
      mcpServerDetectionService.startWatching();
      mcpServerDetectionService.monitorPackageInstallations();
      console.log('MCP server detection initialized');
    } catch (error) {
      console.error('Failed to initialize MCP server detection:', error);
    }
  }
}

export const appInitService = new AppInitService(); 