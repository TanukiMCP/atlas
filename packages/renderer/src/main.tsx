import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/ide-theme.css';
import './styles/globals.css';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSettingsStore } from './stores/settings-store';

// Define ThemeProvider
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettingsStore();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Determine the actual theme mode
  const getActiveTheme = (): PaletteMode => {
    if (settings.theme === 'system') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return settings.theme as PaletteMode;
  };

  // Create the theme with TanukiMCP colors
  const theme = React.useMemo(
    () => createTheme({
      palette: {
        mode: getActiveTheme(),
        ...(getActiveTheme() === 'light'
          ? {
              primary: {
                main: '#d35400', // --color-accent
                dark: '#b8470d', // --color-accent-hover
                light: '#ffeccc', // --color-accent-secondary
              },
              secondary: {
                main: '#ffeccc', // --color-accent-secondary
                dark: '#ffd9a6', // --color-accent-secondary-hover
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
              primary: {
                main: '#d35400', // --color-accent
                dark: '#b8470d', // --color-accent-hover
                light: '#373044', // --color-accent-secondary
              },
              secondary: {
                main: '#373044', // --color-accent-secondary
                dark: '#4b4563', // --color-accent-secondary-hover
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
    }),
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

// Error boundary component for better error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: 'white',
          fontFamily: 'sans-serif'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px', padding: '20px' }}>
            <h2>🚨 React Error Detected</h2>
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
              <summary>Error details</summary>
              {this.state.error && this.state.error.toString()}
            </details>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🔄 Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Render the application
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Development hot reload
// @ts-ignore - Vite HMR
if (import.meta.hot) {
  // @ts-ignore - Vite HMR
  import.meta.hot.accept();
}

console.log('✅ TanukiMCP Atlas App loaded with error boundary'); 