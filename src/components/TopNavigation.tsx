import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Tooltip, IconButton } from '@mui/material';
import { LightMode, DarkMode, SettingsBrightness } from '@mui/icons-material';
import { useSettingsStore } from '../../packages/renderer/src/stores/settings-store';

export const TopNavigation: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  
  const comingSoonItems = [
    'Agent Training Hub',
    'AI Image/Video Generation Hub',
    'Chat-based LLM Collaborative MCP Server Generator',
    'LLM-driven 2D Game Engine',
    'I.A.E.s'
  ];

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  // Get the current theme or system preference if on auto
  const getThemeIcon = () => {
    switch (settings.theme) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      case 'system':
        return <SettingsBrightness />;
      default:
        return <DarkMode />;
    }
  };

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
          
          {/* Theme toggle */}
          <Box sx={{ marginLeft: 'auto' }}>
            <Tooltip title={`Current theme: ${settings.theme}`}>
              <IconButton 
                onClick={() => {
                  // Cycle through themes: light -> dark -> system -> light
                  const nextTheme = 
                    settings.theme === 'light' ? 'dark' : 
                    settings.theme === 'dark' ? 'system' : 'light';
                  handleThemeChange(nextTheme);
                }}
                color="inherit"
              >
                {getThemeIcon()}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 