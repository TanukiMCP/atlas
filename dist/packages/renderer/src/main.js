"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const App_1 = __importDefault(require("./App"));
require("./index.css");
require("./styles/ide-theme.css");
// Error boundary component for better error handling
class ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return ((0, jsx_runtime_1.jsx)("div", { style: {
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    fontFamily: 'sans-serif'
                }, children: (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', maxWidth: '500px', padding: '20px' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "\uD83D\uDEA8 React Error Detected" }), (0, jsx_runtime_1.jsxs)("details", { style: { whiteSpace: 'pre-wrap', marginTop: '20px' }, children: [(0, jsx_runtime_1.jsx)("summary", { children: "Error details" }), this.state.error && this.state.error.toString()] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), style: {
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }, children: "\uD83D\uDD04 Reload Application" })] }) }));
        }
        return this.props.children;
    }
}
// Render the application
const root = client_1.default.createRoot(document.getElementById('root'));
root.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }) }));
// Development hot reload
if (import.meta.hot) {
    import.meta.hot.accept();
}
console.log('✅ TanukiMCP Atlas App loaded with error boundary');
//# sourceMappingURL=main.js.map