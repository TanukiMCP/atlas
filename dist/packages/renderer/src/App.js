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
const react_1 = __importStar(require("react"));
const ide_layout_1 = require("./components/ide/ide-layout");
const app_store_1 = require("./stores/app-store");
function App() {
    const [isReady, setIsReady] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const { theme, setTheme } = (0, app_store_1.useAppStore)();
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
        return (<div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 TanukiMCP Atlas Error</h1>
          <p className="text-gray-700 mb-4">Failed to initialize the application:</p>
          <code className="bg-gray-100 p-2 rounded block mb-4">{error}</code>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            🔄 Retry
          </button>
        </div>
      </div>);
    }
    if (!isReady) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">TanukiMCP Atlas</h2>
          <p className="text-gray-600">Initializing AI-powered IDE...</p>
        </div>
      </div>);
    }
    return (<div className={`app ${theme} h-screen flex flex-col`}>
      <ide_layout_1.IDELayout />
    </div>);
}
exports.default = App;
//# sourceMappingURL=App.js.map