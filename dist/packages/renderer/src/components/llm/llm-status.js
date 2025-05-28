"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMStatus = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const llm_store_1 = require("../../stores/llm-store");
const lucide_react_1 = require("lucide-react");
const LLMStatus = () => {
    const { isConnected, healthStatus, availableModels, currentModel, isLoadingModels, checkHealth, refreshModels, setCurrentModel } = (0, llm_store_1.useLLMStore)();
    const getStatusIcon = () => {
        if (isConnected) {
            return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" });
        }
        else {
            return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-red-500" });
        }
    };
    const getStatusText = () => {
        if (isConnected) {
            return `Connected • ${availableModels.length} models`;
        }
        else {
            return healthStatus?.error || 'Disconnected';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [getStatusIcon(), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium", children: "Ollama LLM" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: getStatusText() })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [isConnected && availableModels.length > 0 && ((0, jsx_runtime_1.jsx)("select", { value: currentModel || '', onChange: (e) => setCurrentModel(e.target.value), className: "text-xs px-2 py-1 border rounded bg-white dark:bg-gray-700", children: availableModels.map(model => ((0, jsx_runtime_1.jsx)("option", { value: model.name, children: model.name }, model.name))) })), (0, jsx_runtime_1.jsx)("button", { onClick: checkHealth, disabled: isLoadingModels, className: "p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200", title: "Refresh connection", children: isLoadingModels ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 animate-spin" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-4 h-4" })) })] })] }));
};
exports.LLMStatus = LLMStatus;
//# sourceMappingURL=llm-status.js.map