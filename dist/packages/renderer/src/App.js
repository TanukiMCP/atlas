"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const modern_ide_layout_1 = require("./components/ide/modern-ide-layout");
const loading_screen_1 = require("./components/shared/loading-screen");
const app_store_1 = require("./stores/app-store");
function App() {
    const [isReady, setIsReady] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const { theme, setTheme } = (0, app_store_1.useTheme)();
    (0, react_1.useEffect)(() => {
        initializeApp();
    }, []);
    const initializeApp = async () => {
        try {
            console.log('🚀 Initializing TanukiMCP Atlas IDE...');
            if (!window.electronAPI) {
                console.warn('⚠️ Electron API not available - running in browser mode');
            }
            else {
                try {
                    const health = await window.electronAPI.invoke('db:health');
                    console.log('📊 Database health:', health);
                }
                catch (dbError) {
                    console.warn('Database connection failed, continuing in offline mode');
                }
                await loadUserPreferences();
            }
            setIsReady(true);
            console.log('✅ TanukiMCP Atlas IDE initialized');
        }
        catch (err) {
            console.error('❌ Failed to initialize app:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };
    const loadUserPreferences = async () => {
        try {
            if (window.electronAPI) {
                const userTheme = await window.electronAPI.invoke('settings:get', 'app.theme');
                if (userTheme) {
                    setTheme(userTheme);
                }
            }
        }
        catch (err) {
            console.warn('Failed to load user preferences:', err);
        }
    };
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-8 max-w-md", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-tanuki-500 rounded-lg flex items-center justify-center mx-auto mb-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white text-2xl font-bold", children: "T" }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-red-600 dark:text-red-400 mb-4", children: "\uD83D\uDEA8 TanukiMCP Atlas Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-700 dark:text-gray-300 mb-4", children: "Failed to initialize the application:" }), (0, jsx_runtime_1.jsx)("code", { className: "bg-gray-100 dark:bg-gray-800 p-2 rounded block mb-4 text-sm", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "px-6 py-2 bg-tanuki-500 text-white rounded-lg hover:bg-tanuki-600 transition-colors", children: "\uD83D\uDD04 Retry" })] }) }));
    }
    if (!isReady) {
        return (0, jsx_runtime_1.jsx)(loading_screen_1.LoadingScreen, { message: "Initializing AI-powered IDE..." });
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: `app ${theme} h-screen flex flex-col font-sans`, children: (0, jsx_runtime_1.jsx)(modern_ide_layout_1.ModernIDELayout, {}) }));
}
exports.default = App;
//# sourceMappingURL=App.js.map