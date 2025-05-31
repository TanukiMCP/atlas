import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Tooltip } from '@mui/material';

export const TopNavigation: React.FC = () => {
  const comingSoonItems = [
    'Agent Training Hub',
    'AI Image/Video Generation Hub',
    'Chat-based LLM Collaborative MCP Server Generator',
    'LLM-driven 2D Game Engine',
    'I.A.E.s'
  ];

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
          {/* Main navigation items */}
          <Button color="inherit">File</Button>
          <Button color="inherit">Edit</Button>
          <Button color="inherit">View</Button>
          <Button color="inherit">Tools</Button>
          <Button color="inherit">Models</Button>
          <Button color="inherit">Workflow Builder</Button>

          {/* Coming soon items */}
          {comingSoonItems.map((item) => (
            <Tooltip key={item} title="Coming Soon" arrow>
              <Button 
                color="inherit" 
                disabled 
                sx={{ 
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                {item}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 