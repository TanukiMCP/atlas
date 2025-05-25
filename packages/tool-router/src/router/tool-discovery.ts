import { EventEmitter } from 'eventemitter3';
import { DiscoveredTool, ToolSource } from '../types/tool-router-types';

export interface ToolDiscoveryEvents {
  'tools:discovered': (tools: DiscoveredTool[]) => void;
  'source:connected': (sourceId: string) => void;
  'source:disconnected': (sourceId: string) => void;
  'source:unavailable': (sourceId: string) => void;
  'discovery:complete': (toolCount: number) => void;
  'discovery:error': (sourceId: string, error: Error) => void;
}

export class ToolDiscovery extends EventEmitter<ToolDiscoveryEvents> {
  private builtinToolsSource: any; // Reference to builtin MCP server
  private externalSourcesHub: any; // Reference to external MCP hub
  private discoveredTools: Map<string, DiscoveredTool> = new Map();
  private sourcesStatus: Map<string, boolean> = new Map();
  private discoveryInterval?: NodeJS.Timeout;
  private isDiscovering: boolean = false;

  constructor() {
    super();
    this.initializeSources();
  }

  private async initializeSources(): Promise<void> {
    try {
      // Initialize connection to builtin MCP server
      const { TanukiMCPServer } = await import('@tanukimcp/mcp-server');
      this.builtinToolsSource = new TanukiMCPServer();
      
      // Initialize connection to external MCP hub
      const { MCPClientHub } = await import('@tanukimcp/mcp-hub');
      this.externalSourcesHub = new MCPClientHub();
      
      console.log('Tool discovery sources initialized');
    } catch (error) {
      console.error('Failed to initialize tool discovery sources:', error);
      throw error;
    }
  }

  async discoverAllTools(): Promise<DiscoveredTool[]> {
    if (this.isDiscovering) {
      console.log('Discovery already in progress, waiting...');
      return Array.from(this.discoveredTools.values());
    }

    this.isDiscovering = true;
    const allTools: DiscoveredTool[] = [];

    try {
      // Discover from builtin source
      const builtinTools = await this.discoverBuiltinTools();
      allTools.push(...builtinTools);
      
      // Discover from external sources
      const externalTools = await this.discoverExternalTools();
      allTools.push(...externalTools);
      
      // Update internal cache
      this.discoveredTools.clear();
      for (const tool of allTools) {
        const key = `${tool.sourceId}:${tool.name}`;
        this.discoveredTools.set(key, tool);
      }
      
      this.emit('tools:discovered', allTools);
      this.emit('discovery:complete', allTools.length);
      
      console.log(`Discovered ${allTools.length} tools from all sources`);
      
    } catch (error) {
      console.error('Error during tool discovery:', error);
      this.emit('discovery:error', 'unknown', error as Error);
    } finally {
      this.isDiscovering = false;
    }

    return allTools;
  }  private async discoverBuiltinTools(): Promise<DiscoveredTool[]> {
    const tools: DiscoveredTool[] = [];
    
    try {
      // Get all tools from builtin MCP server
      const builtinTools = await this.builtinToolsSource.listTools();
      
      for (const tool of builtinTools) {
        const discoveredTool: DiscoveredTool = {
          name: tool.name,
          description: tool.description,
          sourceId: 'builtin',
          sourceType: 'builtin',
          inputSchema: tool.inputSchema,
          outputSchema: tool.outputSchema,
          category: this.inferCategory(tool.name, tool.description),
          tags: this.extractTags(tool.description, tool.name)
        };
        
        tools.push(discoveredTool);
      }
      
      this.sourcesStatus.set('builtin', true);
      this.emit('source:connected', 'builtin');
      
      console.log(`Discovered ${tools.length} builtin tools`);
      
    } catch (error) {
      console.error('Failed to discover builtin tools:', error);
      this.sourcesStatus.set('builtin', false);
      this.emit('source:unavailable', 'builtin');
      this.emit('discovery:error', 'builtin', error as Error);
    }
    
    return tools;
  }

  private async discoverExternalTools(): Promise<DiscoveredTool[]> {
    const tools: DiscoveredTool[] = [];
    
    try {
      // Get all connected external MCP servers
      const connectedServers = await this.externalSourcesHub.getConnectedServers();
      
      for (const server of connectedServers) {
        try {
          const serverTools = await this.externalSourcesHub.listTools(server.id);
          
          for (const tool of serverTools) {
            const discoveredTool: DiscoveredTool = {
              name: tool.name,
              description: tool.description,
              sourceId: server.id,
              sourceType: 'external',
              inputSchema: tool.inputSchema,
              outputSchema: tool.outputSchema,
              category: this.inferCategory(tool.name, tool.description),
              tags: this.extractTags(tool.description, tool.name)
            };
            
            tools.push(discoveredTool);
          }
          
          this.sourcesStatus.set(server.id, true);
          this.emit('source:connected', server.id);
          
        } catch (serverError) {
          console.error(`Failed to discover tools from server ${server.id}:`, serverError);
          this.sourcesStatus.set(server.id, false);
          this.emit('source:unavailable', server.id);
          this.emit('discovery:error', server.id, serverError as Error);
        }
      }
      
      console.log(`Discovered ${tools.length} external tools`);
      
    } catch (error) {
      console.error('Failed to discover external tools:', error);
      this.emit('discovery:error', 'external', error as Error);
    }
    
    return tools;
  }  private inferCategory(toolName: string, description: string): string {
    const text = `${toolName} ${description}`.toLowerCase();
    
    // Mathematics category
    if (text.match(/math|equation|calculate|formula|solve|plot|graph|algebra|calculus|statistics/)) {
      return 'mathematics';
    }
    
    // Programming category
    if (text.match(/code|program|debug|compile|test|function|class|algorithm|refactor/)) {
      return 'programming';
    }
    
    // Science category
    if (text.match(/chemistry|physics|biology|science|experiment|molecule|reaction|simulation/)) {
      return 'science';
    }
    
    // Language category
    if (text.match(/translate|grammar|language|linguistic|pronunciation|dictionary/)) {
      return 'languages';
    }
    
    // File operations category
    if (text.match(/file|read|write|edit|search|directory|folder|document/)) {
      return 'files';
    }
    
    // Web/Network category
    if (text.match(/web|http|api|network|download|upload|request|url/)) {
      return 'web';
    }
    
    // Default category
    return 'general';
  }

  private extractTags(description: string, toolName: string): string[] {
    const tags: string[] = [];
    const text = `${toolName} ${description}`.toLowerCase();
    
    // Extract common action words as tags
    const actions = text.match(/\b(create|read|write|edit|delete|search|find|analyze|generate|convert|transform|process|execute|run|test|validate|format|parse|compile|build|deploy|monitor|track|log|debug|optimize|compress|encrypt|decrypt|sort|filter|merge|split|join|compare|diff|sync|backup|restore|export|import|preview|render|draw|plot|chart|graph|calculate|compute|solve|measure|count|sum|average|min|max|statistical|numerical|mathematical|scientific|linguistic|grammatical|syntactic|semantic|logical|boolean|conditional|iterative|recursive|parallel|sequential|asynchronous|synchronous)\b/g);
    
    if (actions) {
      tags.push(...actions.slice(0, 5)); // Limit to 5 action tags
    }
    
    // Extract domain-specific terms
    const domains = text.match(/\b(javascript|typescript|python|java|cpp|csharp|html|css|sql|json|xml|yaml|markdown|latex|regex|api|database|server|client|frontend|backend|fullstack|mobile|web|desktop|cloud|devops|cicd|git|docker|kubernetes|aws|azure|gcp|firebase|react|vue|angular|node|express|django|flask|spring|junit|jest|mocha|cypress|selenium|pandas|numpy|scipy|matplotlib|tensorflow|pytorch|opencv|nlp|ml|ai|blockchain|crypto|iot|embedded|realtime|streaming|microservices|serverless|graphql|rest|soap|grpc|websocket|http|https|tcp|udp|ssh|ftp|smtp|pop|imap|oauth|jwt|ssl|tls|vpn|dns|cdn|load|balance|cache|redis|mongodb|postgresql|mysql|sqlite|elasticsearch|kibana|grafana|prometheus|jenkins|gitlab|github|bitbucket|jira|confluence|slack|teams|zoom|docker|kubernetes|helm|terraform|ansible|puppet|chef|vagrant|virtualbox|vmware|linux|ubuntu|centos|debian|fedora|windows|macos|android|ios|flutter|reactnative|xamarin|cordova|ionic|electron|pwa|spa|ssr|ssg|jamstack|headless|cms|wordpress|drupal|magento|shopify|woocommerce|prestashop|opencart|bigcommerce|squarespace|wix|webflow|contentful|strapi|ghost|gatsby|next|nuxt|svelte|vue|angular|ember|backbone|jquery|bootstrap|tailwind|material|semantic|bulma|foundation|chakra|antd|mui|mantine)\b/g);
    
    if (domains) {
      tags.push(...domains.slice(0, 3)); // Limit to 3 domain tags
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }

  async getSourceStatus(sourceId: string): Promise<boolean> {
    return this.sourcesStatus.get(sourceId) ?? false;
  }

  async refreshSource(sourceId: string): Promise<DiscoveredTool[]> {
    if (sourceId === 'builtin') {
      return await this.discoverBuiltinTools();
    } else {
      // For external sources, rediscover all external tools
      return await this.discoverExternalTools();
    }
  }

  startPeriodicDiscovery(intervalMs: number = 60000): void {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
    }
    
    this.discoveryInterval = setInterval(async () => {
      await this.discoverAllTools();
    }, intervalMs);
  }

  stopPeriodicDiscovery(): void {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = undefined;
    }
  }

  async shutdown(): Promise<void> {
    this.stopPeriodicDiscovery();
    
    if (this.builtinToolsSource?.shutdown) {
      await this.builtinToolsSource.shutdown();
    }
    
    if (this.externalSourcesHub?.shutdown) {
      await this.externalSourcesHub.shutdown();
    }
    
    this.removeAllListeners();
  }
}