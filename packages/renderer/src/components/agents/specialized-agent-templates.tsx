import React, { useState } from 'react';

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
  isActive: boolean;
}

const AGENT_TEMPLATES: AgentTemplate[] = [
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

export const SpecializedAgentTemplates: React.FC = () => {
  const [agents, setAgents] = useState<AgentTemplate[]>(AGENT_TEMPLATES);
  const [selectedAgent, setSelectedAgent] = useState<string>('researcher');

  const activateAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => ({
      ...agent,
      isActive: agent.id === agentId
    })));
  };

  const selectedAgentData = agents.find(a => a.id === selectedAgent);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>🤖 Specialized AI Agents</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Choose a specialized agent template for your workflow</p>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Agent List */}
        <div style={{ width: '300px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '20px' }}>
          {agents.map(agent => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              style={{
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                backgroundColor: selectedAgent === agent.id ? '#eff6ff' : 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{agent.icon}</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{agent.name}</div>
                  {agent.isActive && <span style={{ fontSize: '10px', color: '#059669' }}>ACTIVE</span>}
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{agent.description}</p>
            </div>
          ))}
        </div>

        {/* Agent Details */}
        {selectedAgentData && (
          <div style={{ flex: 1, padding: '20px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '48px' }}>{selectedAgentData.icon}</span>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>
                    {selectedAgentData.name}
                  </h3>
                  <p style={{ color: '#6b7280', margin: 0 }}>{selectedAgentData.description}</p>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Core Capabilities</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedAgentData.capabilities.map(capability => (
                    <span
                      key={capability}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => activateAgent(selectedAgentData.id)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: selectedAgentData.isActive ? '#059669' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {selectedAgentData.isActive ? '✅ Currently Active' : '🚀 Activate Agent'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};