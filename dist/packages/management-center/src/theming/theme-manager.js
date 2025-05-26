"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeManager = void 0;
const react_1 = __importStar(require("react"));
const ThemeManager = () => {
    const [selectedTheme, setSelectedTheme] = (0, react_1.useState)('light');
    const themes = [
        { id: 'light', name: 'Light', colors: ['#ffffff', '#f3f4f6', '#3b82f6'] },
        { id: 'dark', name: 'Dark', colors: ['#1f2937', '#111827', '#60a5fa'] },
        { id: 'blue', name: 'Ocean Blue', colors: ['#dbeafe', '#1e40af', '#3b82f6'] },
        { id: 'purple', name: 'Purple', colors: ['#ede9fe', '#7c3aed', '#8b5cf6'] }
    ];
    return (<div className="theme-manager p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize the look and feel of your IDE</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Theme Selection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => (<div key={theme.id} onClick={() => setSelectedTheme(theme.id)} className={`cursor-pointer p-4 rounded-lg border-2 transition-colors ${selectedTheme === theme.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex space-x-1 mb-2">
                  {theme.colors.map((color, index) => (<div key={index} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}/>))}
                </div>
                <p className="text-sm font-medium">{theme.name}</p>
              </div>))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Accessibility</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2"/>
              <span>High contrast mode</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2"/>
              <span>Reduce animations</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2"/>
              <span>Large text</span>
            </label>
          </div>
        </div>
      </div>
    </div>);
};
exports.ThemeManager = ThemeManager;
//# sourceMappingURL=theme-manager.js.map