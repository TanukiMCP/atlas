"use strict";
/**
 * TanukiMCP Atlas - LLM System Prompt Management UI
 * Main interface for viewing and editing all system prompts
 */
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
exports.LLMPromptManagement = void 0;
const react_1 = __importStar(require("react"));
const prompt_store_1 = require("../../stores/prompt-store");
const prompt_list_panel_1 = require("./prompt-list-panel");
const prompt_editor_panel_1 = require("./prompt-editor-panel");
const prompt_metadata_panel_1 = require("./prompt-metadata-panel");
const LLMPromptManagement = () => {
    const { isLoading, error, selectedPrompt, searchResults, hasUnsavedChanges, initialize, searchPrompts, clearError } = (0, prompt_store_1.usePromptStore)();
    const [sidebarWidth, setSidebarWidth] = (0, react_1.useState)(300);
    const [rightPanelWidth, setRightPanelWidth] = (0, react_1.useState)(350);
    (0, react_1.useEffect)(() => {
        initialize();
    }, [initialize]);
    (0, react_1.useEffect)(() => {
        // Handle unsaved changes warning
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);
    const handleSearch = (filters) => {
        searchPrompts(filters);
    };
    const handleResize = (panel, delta) => {
        if (panel === 'left') {
            setSidebarWidth(Math.max(250, Math.min(500, sidebarWidth + delta)));
        }
        else {
            setRightPanelWidth(Math.max(300, Math.min(600, rightPanelWidth + delta)));
        }
    };
    if (isLoading && !searchResults) {
        return (<div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading prompt registry...</p>
        </div>
      </div>);
    }
    return (<div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🧠</div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                LLM System Prompt Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and edit system prompts that guide all LLM agents
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (<div className="flex items-center space-x-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-yellow-700 dark:text-yellow-300">
                  Unsaved changes
                </span>
              </div>)}
            
            {searchResults && (<div className="text-sm text-gray-600 dark:text-gray-400">
                {searchResults.totalCount} prompts • {searchResults.prompts.filter(p => p.isModified).length} modified
              </div>)}
          </div>
        </div>

        {/* Error Display */}
        {error && (<div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-red-500">⚠️</div>
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
              <button onClick={clearError} className="text-red-500 hover:text-red-700 dark:hover:text-red-300">
                ✕
              </button>
            </div>
          </div>)}
      </div>      {/* Main Content - Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Prompt List */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700" style={{ width: sidebarWidth }}>
          <prompt_list_panel_1.PromptListPanel prompts={searchResults?.prompts || []} selectedPrompt={selectedPrompt} onSearch={handleSearch} facets={searchResults?.facets}/>
        </div>

        {/* Resize Handle - Left */}
        <div className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 cursor-col-resize" onMouseDown={(e) => {
            const startX = e.clientX;
            const handleMouseMove = (e) => {
                const delta = e.clientX - startX;
                handleResize('left', delta);
            };
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }}/>

        {/* Center Panel - Prompt Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <prompt_editor_panel_1.PromptEditorPanel />
        </div>

        {/* Resize Handle - Right */}
        <div className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 cursor-col-resize" onMouseDown={(e) => {
            const startX = e.clientX;
            const handleMouseMove = (e) => {
                const delta = startX - e.clientX;
                handleResize('right', delta);
            };
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }}/>

        {/* Right Panel - Metadata and Help */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700" style={{ width: rightPanelWidth }}>
          <prompt_metadata_panel_1.PromptMetadataPanel />
        </div>
      </div>
    </div>);
};
exports.LLMPromptManagement = LLMPromptManagement;
//# sourceMappingURL=llm-prompt-management.js.map