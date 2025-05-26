"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const mcp_service_1 = require("../../services/mcp-service");
const card_1 = require("../ui/card");
const input_1 = require("../ui/input");
const badge_1 = require("../ui/badge");
const scroll_area_1 = require("../ui/scroll-area");
const button_1 = require("../ui/button");
const lucide_react_1 = require("lucide-react");
const ToolSelector = ({ isOpen, position, operationalMode, onToolSelect, onClose }) => {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(0);
    const [availableTools, setAvailableTools] = (0, react_1.useState)([]);
    // Load tools from MCP service
    (0, react_1.useEffect)(() => {
        if (isOpen && mcp_service_1.mcpService.isReady()) {
            const tools = mcp_service_1.mcpService.getAvailableTools(operationalMode);
            setAvailableTools(tools);
        }
    }, [isOpen, operationalMode]);
    const filteredTools = searchQuery
        ? availableTools.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        : availableTools;
    const getCategoryColor = (category) => {
        const colors = {
            'file': 'bg-blue-100 text-blue-800',
            'web': 'bg-green-100 text-green-800',
            'data': 'bg-purple-100 text-purple-800',
            'ai': 'bg-orange-100 text-orange-800',
            'system': 'bg-gray-100 text-gray-800',
            'thinking': 'bg-indigo-100 text-indigo-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed z-50", style: { left: position.x, top: position.y }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "w-80 max-h-96 shadow-lg border", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "pb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "text-sm font-semibold", children: ["Tool Selection (", operationalMode, " mode)"] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: onClose, className: "h-6 w-6 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Search tools...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-8 h-9" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "p-0", children: [(0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "p-3 space-y-2", children: filteredTools.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-6 text-muted-foreground text-sm", children: searchQuery ? `No tools found matching "${searchQuery}"` : 'No tools available' })) : (filteredTools.map((tool, index) => ((0, jsx_runtime_1.jsx)("div", { onClick: () => onToolSelect(tool), className: `p-3 rounded-lg cursor-pointer transition-colors border ${index === selectedIndex
                                        ? 'bg-accent border-accent-foreground/20'
                                        : 'hover:bg-muted border-transparent'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "mt-0.5", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-4 w-4 text-orange-500" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-sm truncate", children: tool.name }), tool.category && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: `text-xs px-1.5 py-0.5 ${getCategoryColor(tool.category)}`, children: tool.category }))] }), tool.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground line-clamp-2", children: tool.description }))] })] }) }, tool.name)))) }) }), (0, jsx_runtime_1.jsx)("div", { className: "border-t bg-muted/30 px-3 py-2", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-muted-foreground text-center", children: ["Click to select \u2022 ", filteredTools.length, " tools available"] }) })] })] }) }));
};
exports.ToolSelector = ToolSelector;
//# sourceMappingURL=tool-selector.js.map