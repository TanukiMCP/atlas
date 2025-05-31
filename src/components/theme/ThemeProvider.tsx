import React, { useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSettingsStore } from '../../../packages/renderer/src/stores/settings-store';

// Colors from packages/renderer/src/styles/ide-theme.css
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode colors
          primary: {
            main: '#d35400', // --color-accent
            dark: '#b8470d', // --color-accent-hover
            light: '#ffeccc', // --color-accent-secondary
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ffeccc', // --color-accent-secondary
            dark: '#ffd9a6', // --color-accent-secondary-hover
            contrastText: '#0e0c19',
          },
          background: {
            default: '#ffffff', // --color-bg-primary
            paper: '#f9fafb', // --color-bg-tertiary
          },
          text: {
            primary: '#0e0c19', // --color-text-primary
            secondary: '#374151', // --color-text-secondary
          },
          error: {
            main: '#ef4444', // --color-error
          },
          warning: {
            main: '#f59e0b', // --color-warning
          },
          success: {
            main: '#10b981', // --color-success
          },
        }
      : {
          // Dark mode colors
          primary: {
            main: '#d35400', // --color-accent
            dark: '#b8470d', // --color-accent-hover
            light: '#373044', // --color-accent-secondary
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#373044', // --color-accent-secondary
            dark: '#4b4563', // --color-accent-secondary-hover
            contrastText: '#ffffff',
          },
          background: {
            default: '#0e0c19', // --color-bg-primary
            paper: '#1f1d2b', // --color-bg-secondary
          },
          text: {
            primary: '#ffffff', // --color-text-primary
            secondary: '#d1d5db', // --color-text-secondary
          },
          error: {
            main: '#ef4444', // --color-error
          },
          warning: {
            main: '#f59e0b', // --color-warning
          },
          success: {
            main: '#10b981', // --color-success
          },
        }),
  },
  shape: {
    borderRadius: 4, // --radius-sm
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useSettingsStore();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Determine the actual theme mode
  const getActiveTheme = (): PaletteMode => {
    if (settings.theme === 'system') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return settings.theme as PaletteMode;
  };

  // Create the theme
  const theme = React.useMemo(
    () => createTheme(getDesignTokens(getActiveTheme())),
    [settings.theme, prefersDarkMode]
  );
  
  // Apply the theme class to document root for CSS variables
  useEffect(() => {
    const activeTheme = getActiveTheme();
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(activeTheme);
  }, [settings.theme, prefersDarkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}; 