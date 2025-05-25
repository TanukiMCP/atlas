import React, { useState } from 'react';

export const ThemeManager: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('light');
  
  const themes = [
    { id: 'light', name: 'Light', colors: ['#ffffff', '#f3f4f6', '#3b82f6'] },
    { id: 'dark', name: 'Dark', colors: ['#1f2937', '#111827', '#60a5fa'] },
    { id: 'blue', name: 'Ocean Blue', colors: ['#dbeafe', '#1e40af', '#3b82f6'] },
    { id: 'purple', name: 'Purple', colors: ['#ede9fe', '#7c3aed', '#8b5cf6'] }
  ];

  return (
    <div className="theme-manager p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize the look and feel of your IDE</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Theme Selection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-colors ${
                  selectedTheme === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex space-x-1 mb-2">
                  {theme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-sm font-medium">{theme.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Accessibility</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>High contrast mode</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Reduce animations</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Large text</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};