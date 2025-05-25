/**
 * TanukiMCP Atlas - Prompt List Panel
 * Searchable tree view of all system prompts
 */

import React, { useState, useMemo } from 'react';
import { SystemPrompt, PromptSearchFilters, PromptSearchResult } from '../../types/prompt-types';
import { usePromptStore } from '../../stores/prompt-store';

interface PromptListPanelProps {
  prompts: SystemPrompt[];
  selectedPrompt: SystemPrompt | null;
  onSearch: (filters: PromptSearchFilters) => void;
  facets?: PromptSearchResult['facets'];
}

export const PromptListPanel: React.FC<PromptListPanelProps> = ({
  prompts,
  selectedPrompt,
  onSearch,
  facets
}) => {
  const { selectPrompt } = usePromptStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showModifiedOnly, setShowModifiedOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Group prompts by category
  const promptsByCategory = useMemo(() => {
    const grouped = new Map<string, SystemPrompt[]>();
    
    for (const prompt of prompts) {
      const categoryId = prompt.category.id;
      if (!grouped.has(categoryId)) {
        grouped.set(categoryId, []);
      }
      grouped.get(categoryId)!.push(prompt);
    }
    
    // Sort prompts within each category
    for (const [categoryId, categoryPrompts] of grouped) {
      categoryPrompts.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return grouped;
  }, [prompts]);

  const handleSearch = () => {
    const filters: PromptSearchFilters = {
      query: searchQuery.trim() || undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      modifiedOnly: showModifiedOnly || undefined,
      sortBy: 'category',
      sortOrder: 'asc'
    };
    onSearch(filters);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleCategoryFilter = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelected);
  };

  // Auto-expand categories with search results
  React.useEffect(() => {
    if (searchQuery) {
      const categoriesWithMatches = new Set<string>();
      for (const prompt of prompts) {
        if (prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prompt.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          categoriesWithMatches.add(prompt.category.id);
        }
      }
      setExpandedCategories(categoriesWithMatches);
    }
  }, [searchQuery, prompts]);

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-2 top-2.5 text-gray-400">
              🔍
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showModifiedOnly}
                onChange={(e) => setShowModifiedOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Modified only
              </span>
            </label>
            
            <button
              onClick={handleSearch}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </div>      {/* Category Filters */}
      {facets && facets.categories.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categories
          </h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {facets.categories.map(category => (
              <label
                key={category.id}
                className="flex items-center space-x-2 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategoryFilter(category.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {category.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({category.count})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Prompts Tree */}
      <div className="flex-1 overflow-y-auto">
        {Array.from(promptsByCategory.entries()).map(([categoryId, categoryPrompts]) => {
          const category = categoryPrompts[0]?.category;
          if (!category) return null;

          const isExpanded = expandedCategories.has(categoryId);
          const modifiedCount = categoryPrompts.filter(p => p.isModified).length;

          return (
            <div key={categoryId} className="border-b border-gray-100 dark:border-gray-800">
              {/* Category Header */}
              <div
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => toggleCategory(categoryId)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </div>
                  <div className="text-lg">{category.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {categoryPrompts.length} prompts
                      {modifiedCount > 0 && ` • ${modifiedCount} modified`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Prompts */}
              {isExpanded && (
                <div className="bg-gray-50 dark:bg-gray-800/50">
                  {categoryPrompts.map(prompt => (
                    <div
                      key={prompt.id}
                      className={`flex items-center space-x-3 p-3 pl-12 cursor-pointer border-l-2 transition-colors ${
                        selectedPrompt?.id === prompt.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                          : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => selectPrompt(prompt)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {prompt.name}
                          </div>
                          {prompt.isModified && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {prompt.description}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {prompt.agentModule} • {prompt.complexity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {promptsByCategory.size === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <div className="font-medium">No prompts found</div>
            <div className="text-sm">Try adjusting your search criteria</div>
          </div>
        )}
      </div>
    </div>
  );
};