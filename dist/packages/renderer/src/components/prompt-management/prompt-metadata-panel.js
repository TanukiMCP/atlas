"use strict";
/**
 * TanukiMCP Atlas - Prompt Metadata Panel
 * Displays prompt information, variables, and guidance
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
exports.PromptMetadataPanel = void 0;
const react_1 = __importStar(require("react"));
const prompt_store_1 = require("../../stores/prompt-store");
const PromptMetadataPanel = () => {
    const { selectedPrompt } = (0, prompt_store_1.usePromptStore)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('info');
    if (!selectedPrompt) {
        return (<div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-2xl mb-2">📋</div>
          <div className="text-sm">
            Select a prompt to view metadata
          </div>
        </div>
      </div>);
    }
    const tabs = [
        { id: 'info', label: 'Info', icon: 'ℹ️' },
        { id: 'variables', label: 'Variables', icon: '🔧' },
        { id: 'guidance', label: 'Guidance', icon: '📖' },
        { id: 'default', label: 'Default', icon: '🔄' }
    ];
    return (<div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Prompt Metadata
          </h3>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'info' && (<div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prompt ID
              </label>
              <div className="text-sm text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                {selectedPrompt.id}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <div className="text-sm text-gray-900 dark:text-white">
                {selectedPrompt.description}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agent Module
              </label>
              <div className="text-sm text-gray-900 dark:text-white">
                {selectedPrompt.agentModule}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Purpose
              </label>
              <div className="text-sm text-gray-900 dark:text-white">
                {selectedPrompt.purpose}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Complexity
                </label>
                <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${selectedPrompt.complexity === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                selectedPrompt.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}>
                  {selectedPrompt.complexity}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Version
                </label>
                <div className="text-sm text-gray-900 dark:text-white">
                  {selectedPrompt.version}
                </div>
              </div>
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-1">
                {selectedPrompt.tags.map(tag => (<span key={tag} className="inline-flex px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded">
                    {tag}
                  </span>))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <label className="block font-medium mb-1">Created</label>
                <div>{selectedPrompt.created.toLocaleDateString()}</div>
              </div>
              <div>
                <label className="block font-medium mb-1">Last Modified</label>
                <div>{selectedPrompt.lastModified.toLocaleDateString()}</div>
              </div>
            </div>
          </div>)}

        {activeTab === 'variables' && (<div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Variables that can be used in this prompt template.
            </div>
            
            {selectedPrompt.variables.length > 0 ? (<div className="space-y-3">
                {selectedPrompt.variables.map((variable, index) => (<div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                        {`{{${variable.name}}}`}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${variable.required
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {variable.required ? 'Required' : 'Optional'}
                      </span>
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded">
                        {variable.type}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {variable.description}
                    </div>
                    
                    {variable.example && (<div className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Example:</span>
                        <code className="ml-1 bg-gray-100 dark:bg-gray-800 px-1 rounded">
                          {typeof variable.example === 'string'
                            ? variable.example
                            : JSON.stringify(variable.example)}
                        </code>
                      </div>)}
                  </div>))}
              </div>) : (<div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="text-2xl mb-2">📄</div>
                <div>No variables defined for this prompt</div>
              </div>)}
          </div>)}        {activeTab === 'guidance' && (<div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Guidelines and best practices for editing this prompt.
            </div>
            
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                {selectedPrompt.guidance}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                💡 General Editing Tips
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                <li>• Test changes with the validation tool before saving</li>
                <li>• Keep prompts focused and specific to their purpose</li>
                <li>• Use clear, unambiguous language</li>
                <li>• Consider token limits for performance</li>
                <li>• Document any custom variables you add</li>
              </ul>
            </div>
          </div>)}

        {activeTab === 'default' && (<div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Original default prompt for comparison.
              </div>
              {selectedPrompt.isModified && (<div className="text-xs text-yellow-600 dark:text-yellow-400">
                  Currently using modified version
                </div>)}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Default Content
                </div>
              </div>
              <div className="p-4">
                <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedPrompt.defaultContent}
                </pre>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              This is the original prompt content as shipped with TanukiMCP Atlas.
              Your modifications are stored separately and can be reset at any time.
            </div>
          </div>)}
      </div>
    </div>);
};
exports.PromptMetadataPanel = PromptMetadataPanel;
//# sourceMappingURL=prompt-metadata-panel.js.map