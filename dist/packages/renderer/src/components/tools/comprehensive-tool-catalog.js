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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprehensiveToolCatalog = void 0;
const react_1 = __importStar(require("react"));
const SAMPLE_TOOLS = [
    { id: 'read_file', name: 'Read File', description: 'Read contents of any file type', category: 'file', icon: '📖', version: '2.1.0', usage: 89, rating: 4.8, tags: ['core'], isInstalled: true, isPremium: false },
    { id: 'write_file', name: 'Write File', description: 'Create or modify files', category: 'file', icon: '✍️', version: '2.1.0', usage: 76, rating: 4.7, tags: ['core'], isInstalled: true, isPremium: false },
    { id: 'search_code', name: 'Code Search', description: 'Advanced code search with regex', category: 'code', icon: '🔍', version: '1.5.2', usage: 64, rating: 4.6, tags: ['search'], isInstalled: true, isPremium: false },
    { id: 'git_operations', name: 'Git Operations', description: 'Complete Git workflow automation', category: 'code', icon: '🔀', version: '3.0.1', usage: 58, rating: 4.9, tags: ['git'], isInstalled: false, isPremium: false },
    { id: 'web_scraper', name: 'Web Scraper Pro', description: 'Advanced web scraping with AI', category: 'web', icon: '🕷️', version: '2.3.0', usage: 71, rating: 4.5, tags: ['scraping'], isInstalled: false, isPremium: true },
    { id: 'data_visualizer', name: 'Data Visualizer', description: 'Create charts and graphs', category: 'data', icon: '📈', version: '1.8.0', usage: 42, rating: 4.4, tags: ['charts'], isInstalled: true, isPremium: false }
];
const CATEGORIES = [
    { id: 'all', name: 'All Tools', icon: '📂' },
    { id: 'file', name: 'File Operations', icon: '📁' },
    { id: 'code', name: 'Code & Development', icon: '💻' },
    { id: 'data', name: 'Data Analysis', icon: '📊' },
    { id: 'web', name: 'Web & APIs', icon: '🌐' },
    { id: 'automation', name: 'Automation', icon: '⚡' }
];
const ComprehensiveToolCatalog = () => {
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [tools, setTools] = (0, react_1.useState)(SAMPLE_TOOLS);
    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    const installTool = (toolId) => {
        setTools(prev => prev.map(tool => tool.id === toolId ? { ...tool, isInstalled: true } : tool));
    };
    return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 16px 0' }}>🛠️ Tool Catalog</h2>
        <input type="text" placeholder="Search tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', width: '300px' }}/>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Categories */}
        <div style={{ width: '200px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '16px' }}>
          {CATEGORIES.map(cat => (<div key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat.id ? '#eff6ff' : 'transparent',
                color: selectedCategory === cat.id ? '#1d4ed8' : '#374151',
                marginBottom: '4px'
            }}>
              {cat.icon} {cat.name}
            </div>))}
        </div>

        {/* Tools Grid */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredTools.map(tool => (<div key={tool.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '24px' }}>{tool.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>{tool.name}</h3>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>v{tool.version}</div>
                  </div>
                  {tool.isInstalled && (<span style={{ fontSize: '10px', color: '#059669', backgroundColor: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }}>
                      INSTALLED
                    </span>)}
                </div>
                <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>{tool.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    ⭐ {tool.rating} • 📈 {tool.usage}%
                  </div>
                  {!tool.isInstalled && (<button onClick={() => installTool(tool.id)} style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}>
                      {tool.isPremium ? '💎 Install Pro' : '📦 Install'}
                    </button>)}
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
};
exports.ComprehensiveToolCatalog = ComprehensiveToolCatalog;
//# sourceMappingURL=comprehensive-tool-catalog.js.map