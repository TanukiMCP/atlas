import React, { useState, useEffect } from 'react';
import { Card, Grid, Typography, IconButton, Chip, Box, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'built-in' | 'external';
  server?: string;
}

interface ToolServer {
  id: string;
  name: string;
  url: string;
  tools: Tool[];
  isConnected: boolean;
}

export const ToolsDisplay: React.FC = () => {
  const [servers, setServers] = useState<ToolServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      // Load tools configuration from mcp.json
      const response = await fetch('/api/tools/config');
      const config = await response.json();
      
      // Check connectivity for each server
      const serversWithStatus = await Promise.all(
        config.servers.map(async (server: ToolServer) => {
          try {
            const status = await fetch(`${server.url}/health`);
            return { ...server, isConnected: status.ok };
          } catch {
            return { ...server, isConnected: false };
          }
        })
      );

      setServers(serversWithStatus);
    } catch (error) {
      console.error('Failed to load tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshServer = async (serverId: string) => {
    setRefreshing(prev => ({ ...prev, [serverId]: true }));
    try {
      const server = servers.find(s => s.id === serverId);
      if (server) {
        const status = await fetch(`${server.url}/health`);
        setServers(prev => prev.map(s => 
          s.id === serverId ? { ...s, isConnected: status.ok } : s
        ));
      }
    } catch {
      setServers(prev => prev.map(s => 
        s.id === serverId ? { ...s, isConnected: false } : s
      ));
    } finally {
      setRefreshing(prev => {
        const newState = { ...prev };
        delete newState[serverId];
        return newState;
      });
    }
  };

  const renderToolCard = (tool: Tool) => (
    <Box sx={{ mb: 1, p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
      <Typography variant="subtitle2">
        {tool.name}
        <Chip
          size="small"
          label={tool.category}
          color={tool.category === 'built-in' ? 'primary' : 'secondary'}
          sx={{ ml: 1 }}
        />
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {tool.description}
      </Typography>
    </Box>
  );

  const renderServerCard = (server: ToolServer) => (
    <Card sx={{ p: 2, height: '100%', position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          {server.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {server.isConnected ? (
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
          ) : (
            <ErrorIcon color="error" sx={{ mr: 1 }} />
          )}
          <IconButton 
            size="small" 
            onClick={() => handleRefreshServer(server.id)}
            disabled={refreshing[server.id]}
          >
            {refreshing[server.id] ? (
              <CircularProgress size={20} />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      {server.tools.map(tool => renderToolCard(tool))}
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {servers.map(server => (
        <Grid item key={server.id} xs={12} sm={6} md={4}>
          {renderServerCard(server)}
        </Grid>
      ))}
    </Grid>
  );
}; 