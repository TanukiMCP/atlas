"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = void 0;
const react_1 = require("react");
const useTheme = () => {
    const [theme, setTheme] = (0, react_1.useState)('dark');
    (0, react_1.useEffect)(() => {
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('tanuki-theme') || 'dark';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);
    const applyTheme = (newTheme) => {
        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        }
        else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    };
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('tanuki-theme', newTheme);
        applyTheme(newTheme);
    };
    const setThemeMode = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('tanuki-theme', newTheme);
        applyTheme(newTheme);
    };
    return {
        theme,
        toggleTheme,
        setTheme: setThemeMode
    };
};
exports.useTheme = useTheme;
//# sourceMappingURL=useTheme.js.map