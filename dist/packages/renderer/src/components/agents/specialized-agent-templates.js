"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecializedAgentTemplates = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AGENT_TEMPLATES = [
    {
        id: 'developer',
        name: 'Software Developer',
        description: 'Expert in coding, debugging, and software architecture',
        icon: '👨‍💻',
        capabilities: ['Code generation', 'Bug fixing', 'Architecture design', 'Code review'],
        isActive: false
    },
    {
        id: 'researcher',
        name: 'Research Analyst',
        description: 'Academic research, literature review, and data analysis',
        icon: '🔬',
        capabilities: ['Literature review', 'Data analysis', 'Citation management', 'Research synthesis'],
        isActive: true
    },
    {
        id: 'business',
        name: 'Business Analyst',
        description: 'Strategic planning, market analysis, and business intelligence',
        icon: '📊',
        capabilities: ['Market analysis', 'Strategic planning', 'Data visualization', 'Report generation'],
        isActive: false
    },
    {
        id: 'creative',
        name: 'Creative Writer',
        description: 'Content creation, storytelling, and creative writing',
        icon: '✍️',
        capabilities: ['Content creation', 'Story development', 'Copy writing', 'Creative ideation'],
        isActive: false
    }
];
const SpecializedAgentTemplates = () => {
    const [agents, setAgents] = (0, react_1.useState)(AGENT_TEMPLATES);
    const [selectedAgent, setSelectedAgent] = (0, react_1.useState)('researcher');
    const activateAgent = (agentId) => {
        setAgents(prev => prev.map(agent => ({
            ...agent,
            isActive: agent.id === agentId
        })));
    };
    const selectedAgentData = agents.find(a => a.id === selectedAgent);
    return ((0, jsx_runtime_1.jsxs)("div", { style: { height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }, children: [(0, jsx_runtime_1.jsx)("h2", { style: { fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }, children: "\uD83E\uDD16 Specialized AI Agents" }), (0, jsx_runtime_1.jsx)("p", { style: { color: '#6b7280', margin: 0 }, children: "Choose a specialized agent template for your workflow" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flex: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { width: '300px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '20px' }, children: agents.map(agent => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => setSelectedAgent(agent.id), style: {
                                padding: '16px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                marginBottom: '8px',
                                cursor: 'pointer',
                                backgroundColor: selectedAgent === agent.id ? '#eff6ff' : 'white'
                            }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '24px' }, children: agent.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: '600', fontSize: '14px' }, children: agent.name }), agent.isActive && (0, jsx_runtime_1.jsx)("span", { style: { fontSize: '10px', color: '#059669' }, children: "ACTIVE" })] })] }), (0, jsx_runtime_1.jsx)("p", { style: { fontSize: '12px', color: '#6b7280', margin: 0 }, children: agent.description })] }, agent.id))) }), selectedAgentData && ((0, jsx_runtime_1.jsx)("div", { style: { flex: 1, padding: '20px' }, children: (0, jsx_runtime_1.jsxs)("div", { style: { backgroundColor: 'white', borderRadius: '12px', padding: '24px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '48px' }, children: selectedAgentData.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { style: { fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }, children: selectedAgentData.name }), (0, jsx_runtime_1.jsx)("p", { style: { color: '#6b7280', margin: 0 }, children: selectedAgentData.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)("h4", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' }, children: "Core Capabilities" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' }, children: selectedAgentData.capabilities.map(capability => ((0, jsx_runtime_1.jsx)("span", { style: {
                                                    padding: '4px 8px',
                                                    backgroundColor: '#eff6ff',
                                                    color: '#1d4ed8',
                                                    borderRadius: '4px',
                                                    fontSize: '12px'
                                                }, children: capability }, capability))) })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => activateAgent(selectedAgentData.id), style: {
                                        padding: '12px 24px',
                                        backgroundColor: selectedAgentData.isActive ? '#059669' : '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }, children: selectedAgentData.isActive ? '✅ Currently Active' : '🚀 Activate Agent' })] }) }))] })] }));
};
exports.SpecializedAgentTemplates = SpecializedAgentTemplates;
//# sourceMappingURL=specialized-agent-templates.js.map