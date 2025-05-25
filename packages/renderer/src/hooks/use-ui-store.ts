// UI state management hook for TanukiMCP Atlas
import { useState, useCallback } from 'react';

export interface PanelLayout {
  leftPanel: {
    width: number;
    isVisible: boolean;
    activeTab: string;
  };
  rightPanel: {
    width: number;
    isVisible: boolean;
    activeTab: string;
  };
  bottomPanel: {
    height: number;
    isVisible: boolean;
    activeTab: string;
  };
}

const DEFAULT_LAYOUT: PanelLayout = {
  leftPanel: {
    width: 300,
    isVisible: true,
    activeTab: 'fileExplorer'
  },
  rightPanel: {
    width: 300,
    isVisible: false,
    activeTab: 'workflowManager'
  },
  bottomPanel: {
    height: 200,
    isVisible: false,
    activeTab: 'terminal'
  }
};

export const useUIStore = () => {
  const [layout, setLayout] = useState<PanelLayout>(DEFAULT_LAYOUT);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isFullscreen, setIsFullscreen] = useState(false);  const updateLayout = useCallback((newLayout: Partial<PanelLayout>) => {
    setLayout(prev => ({ ...prev, ...newLayout }));
  }, []);

  const togglePanel = useCallback((panel: keyof PanelLayout) => {
    setLayout(prev => ({
      ...prev,
      [panel]: {
        ...prev[panel],
        isVisible: !prev[panel].isVisible
      }
    }));
  }, []);

  return {
    layout,
    theme,
    isFullscreen,
    updateLayout,
    togglePanel,
    setTheme,
    setIsFullscreen
  };
};