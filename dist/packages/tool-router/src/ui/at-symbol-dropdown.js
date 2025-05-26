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
exports.AtSymbolDropdown = void 0;
const react_1 = __importStar(require("react"));
const tool_selector_1 = require("./tool-selector");
const tool_preview_1 = require("./tool-preview");
const parameter_input_1 = require("./parameter-input");
const AtSymbolDropdown = ({ isOpen, onClose, onToolSelect, context, position, initialQuery = '', toolRouter }) => {
    const [query, setQuery] = (0, react_1.useState)(initialQuery);
    const [selectedTool, setSelectedTool] = (0, react_1.useState)(null);
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(0);
    const [showPreview, setShowPreview] = (0, react_1.useState)(false);
    const [showParameters, setShowParameters] = (0, react_1.useState)(false);
    const [currentCategory, setCurrentCategory] = (0, react_1.useState)('all');
    const [searchResults, setSearchResults] = (0, react_1.useState)([]);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const dropdownRef = (0, react_1.useRef)(null);
    const inputRef = (0, react_1.useRef)(null);
    // Load initial data
    (0, react_1.useEffect)(() => {
        if (isOpen && toolRouter) {
            loadInitialData();
        }
    }, [isOpen, toolRouter]);
    // Search when query or category changes
    (0, react_1.useEffect)(() => {
        if (isOpen && toolRouter) {
            performSearch();
        }
    }, [query, currentCategory, isOpen, toolRouter]);
    const loadInitialData = (0, react_1.useCallback)(async () => {
        try {
            setIsLoading(true);
            const [availableCategories] = await Promise.all([
                toolRouter.getAvailableCategories(context)
            ]);
            setCategories(availableCategories);
        }
        catch (error) {
            console.error('Failed to load initial data:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, [toolRouter, context]);
    const performSearch = (0, react_1.useCallback)(async () => {
        if (!toolRouter)
            return;
        try {
            setIsLoading(true);
            let results;
            if (query.trim()) {
                results = await toolRouter.searchTools(query, context, {
                    maxResults: 10,
                    categoryFilter: currentCategory === 'all' ? undefined : [currentCategory]
                });
            }
            else if (currentCategory === 'all') {
                // Show recently used tools when no query
                results = await toolRouter.searchTools('', context, { maxResults: 10 });
            }
            else {
                results = await toolRouter.getToolsByCategory(currentCategory, context);
            }
            setSearchResults(results);
            setSelectedIndex(0);
        }
        catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        }
        finally {
            setIsLoading(false);
        }
    }, [query, currentCategory, toolRouter, context]); // Keyboard navigation
    (0, react_1.useEffect)(() => {
        if (!isOpen)
            return;
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (searchResults[selectedIndex]) {
                        handleToolSelection(searchResults[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    if (showParameters) {
                        setShowParameters(false);
                        setSelectedTool(null);
                    }
                    else {
                        onClose();
                    }
                    break;
                case 'Tab':
                    event.preventDefault();
                    if (searchResults[selectedIndex]) {
                        setShowPreview(!showPreview);
                    }
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, searchResults, showPreview, showParameters, onClose]);
    // Focus input when opened
    (0, react_1.useEffect)(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
    // Click outside to close
    (0, react_1.useEffect)(() => {
        if (!isOpen)
            return;
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);
    const handleToolSelection = (0, react_1.useCallback)(async (tool) => {
        setSelectedTool(tool);
        // Check if tool requires parameters
        const hasRequiredParams = tool.inputSchema.required && tool.inputSchema.required.length > 0;
        if (hasRequiredParams && !showParameters) {
            setShowParameters(true);
        }
        else {
            onToolSelect(tool);
            onClose();
        }
    }, [onToolSelect, onClose, showParameters]);
    const handleParameterSubmit = (0, react_1.useCallback)((parameters) => {
        if (selectedTool) {
            onToolSelect(selectedTool, parameters);
            onClose();
        }
    }, [selectedTool, onToolSelect, onClose]);
    const handleCategoryChange = (0, react_1.useCallback)((categoryId) => {
        setCurrentCategory(categoryId);
        setSelectedIndex(0);
        if (categoryId !== 'all') {
            setQuery(''); // Clear query when switching to category view
        }
    }, []);
    if (!isOpen)
        return null;
    return (<div ref={dropdownRef} className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-2xl w-full" style={{
            left: position.x,
            top: position.y,
            maxHeight: '70vh'
        }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <span className="text-blue-500 font-mono text-lg">@</span>
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tools..." className="flex-1 bg-transparent border-none outline-none text-lg dark:text-white placeholder-gray-500 dark:placeholder-gray-400"/>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Tab for preview • Enter to select
          </span>
        </div>
        
        {/* Category tabs */}
        <div className="flex space-x-2 mt-3 overflow-x-auto">
          <button className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${currentCategory === 'all'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`} onClick={() => handleCategoryChange('all')}>
            All Tools
          </button>
          {categories.map(category => (<button key={category.id} className={`px-3 py-1 text-xs rounded-full whitespace-nowrap flex items-center space-x-1 transition-colors ${currentCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`} onClick={() => handleCategoryChange(category.id)}>
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>))}
        </div>
      </div>

      <div className="flex max-h-96">
        {/* Tool list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (<div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
            </div>) : searchResults.length > 0 ? (searchResults.map((tool, index) => (<tool_selector_1.ToolSelector key={tool.id} tool={tool} isSelected={index === selectedIndex} onClick={() => handleToolSelection(tool)} onHover={() => setSelectedIndex(index)} showUsageStats={true}/>))) : (<div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🔍</div>
              <div className="font-medium">No tools found</div>
              <div className="text-sm mt-1">Try a different search term or category</div>
            </div>)}
        </div>

        {/* Preview panel */}
        {showPreview && selectedTool && (<div className="w-80 border-l border-gray-200 dark:border-gray-700">
            <tool_preview_1.ToolPreview toolId={selectedTool.id} toolRouter={toolRouter}/>
          </div>)}
      </div>

      {/* Parameter input */}
      {showParameters && selectedTool && (<div className="border-t border-gray-200 dark:border-gray-700">
          <parameter_input_1.ParameterInput tool={selectedTool} onSubmit={handleParameterSubmit} onCancel={() => {
                setShowParameters(false);
                setSelectedTool(null);
            }}/>
        </div>)}

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>↑↓ Navigate</span>
          <span>⏎ Select</span>
          <span>⇥ Preview</span>
          <span>⎋ Close</span>
        </div>
        <div>
          {searchResults.length} tools available
        </div>
      </div>
    </div>);
};
exports.AtSymbolDropdown = AtSymbolDropdown;
//# sourceMappingURL=at-symbol-dropdown.js.map