import React, { useState, useEffect } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: { id: string; name: string; icon: string };
  status: 'available' | 'busy' | 'error';
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

export const ToolCatalogBrowser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showTestingSandbox, setShowTestingSandbox] = useState(false);

  const categories: Category[] = [
    { id: 'filesystem', name: 'File System', icon: '📁' },
    { id: 'web', name: 'Web & HTTP', icon: '🌐' },
    { id: 'database', name: 'Database', icon: '🗄️' },
    { id: 'ai', name: 'AI & ML', icon: '🤖' },
    { id: 'development', name: 'Development', icon: '💻' }
  ];

  const tools: Tool[] = [
    {
      id: '1',
      name: 'File Reader',
      description: 'Read and analyze files from the local filesystem',
      category: categories[0],
      status: 'available'
    },
    {
      id: '2', 
      name: 'Web Scraper',
      description: 'Extract data from web pages and APIs',
      category: categories[1],
      status: 'available'
    },
    {
      id: '3',
      name: 'Database Query',
      description: 'Execute SQL queries and database operations',
      category: categories[2],
      status: 'busy'
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };  return (
    <div className="tool-catalog p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tool Catalog</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse and manage available MCP tools</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedTool(tool)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{tool.category.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(tool.status)}`} />
                  <span className="text-xs text-gray-500">{tool.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No tools found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};