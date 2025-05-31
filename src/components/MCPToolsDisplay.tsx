import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, IconButton, Chip, CircularProgress, Collapse, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import { Tool, ToolServer } from '../types/mcp';
import { userMCPConfigService } from '../services/userMCPConfigService';

const BUILT_IN_TOOLS: Tool[] = [
  {
    id: 'tanuki-file-search',
    name: 'File Search',
    description: 'Search for files in the workspace',
    category: 'built-in'
  },
  {
    id: 'tanuki-code-search',
    name: 'Code Search',
    description: 'Search for code patterns in the workspace',
    category: 'built-in'
  },
  {
    id: 'tanuki-edit',
    name: 'Code Edit',
    description: 'Edit code files in the workspace',
    category: 'built-in'
  }
];

export const MCPToolsDisplay: React.FC = () => {
  const [servers, setServers] = useState<ToolServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});
  const [expandedServers, setExpandedServers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    initializeAndLoadServers();
  }, []);

  const initializeAndLoadServers = async () => {
    try {
      setLoading(true);
      await userMCPConfigService.initialize();
      await loadServers();
    } catch (error) {
      console.error('Failed to initialize MCP config:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadServers = async () => {
    try {
      const loadedServers = await userMCPConfigService.getServers();
      setServers(loadedServers);
    } catch (error) {
      console.error('Failed to load MCP servers:', error);
    }
  };

  const refreshServer = async (serverId: string) => {
    setRefreshing(prev => ({ ...prev, [serverId]: true }));
    try {
      await userMCPConfigService.updateServer(serverId, {});
      await loadServers();
    } finally {
      setRefreshing(prev => ({ ...prev, [serverId]: false }));
    }
  };

  const toggleServerExpanded = (serverId: string) => {
    setExpandedServers(prev => ({
      ...prev,
      [serverId]: !prev[serverId]
    }));
  };

  const openConfigInEditor = () => {
    // This is a placeholder for the functionality to open the config file in Monaco editor
    // The actual implementation would depend on your editor integration
    const configPath = userMCPConfigService.getConfigPath();
    console.log('Open MCP config in editor:', configPath);
    // Example: window.electron.openFile(configPath);
  };

  const renderToolCard = (tool: Tool) => (
    <Card 
      key={tool.id}
      sx={{ 
        p: 2,
        mb: 1,
        backgroundColor: tool.category === 'built-in' ? 'background.default' : 'background.paper'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1">
          {tool.name}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Chip
          size="small"
          label={tool.category}
          color={tool.category === 'built-in' ? 'primary' : 'secondary'}
          variant="outlined"
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {tool.description}
      </Typography>
    </Card>
  );

  const renderServerCard = (server: ToolServer) => (
    <Card key={server.id} sx={{ mb: 2 }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">
            {server.name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {server.isConnected ? (
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
          ) : (
            <ErrorIcon color="error" sx={{ mr: 1 }} />
          )}
          <IconButton 
            size="small" 
            onClick={() => refreshServer(server.id)}
            disabled={refreshing[server.id]}
          >
            {refreshing[server.id] ? (
              <CircularProgress size={20} />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
          <IconButton
            size="small"
            onClick={() => toggleServerExpanded(server.id)}
          >
            {expandedServers[server.id] ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {server.url}
        </Typography>
      </Box>
      <Collapse in={expandedServers[server.id]}>
        <Box sx={{ px: 2, pb: 2 }}>
          {server.tools.map(tool => renderToolCard(tool))}
        </Box>
      </Collapse>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">MCP Tools Configuration</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          startIcon={<EditIcon />} 
          variant="outlined" 
          size="small"
          onClick={openConfigInEditor}
        >
          Edit Config
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Built-in Tools
      </Typography>
      {BUILT_IN_TOOLS.map(tool => renderToolCard(tool))}

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        External MCP Servers
      </Typography>
      {servers.map(server => renderServerCard(server))}
    </Box>
  );
}; 