"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterInput = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ParameterInput = ({ tool, onSubmit, onCancel }) => {
    const [parameters, setParameters] = (0, react_1.useState)({});
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isValid, setIsValid] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Initialize with default values
        const initialParams = {};
        Object.entries(tool.inputSchema.properties).forEach(([key, prop]) => {
            if (prop.default !== undefined) {
                initialParams[key] = prop.default;
            }
        });
        setParameters(initialParams);
    }, [tool]);
    (0, react_1.useEffect)(() => {
        validateParameters();
    }, [parameters]);
    const validateParameters = () => {
        const newErrors = {};
        const required = tool.inputSchema.required || [];
        required.forEach(paramName => {
            if (!parameters[paramName] || (typeof parameters[paramName] === 'string' && parameters[paramName].trim() === '')) {
                newErrors[paramName] = 'This field is required';
            }
        });
        // Type validation
        Object.entries(tool.inputSchema.properties).forEach(([key, prop]) => {
            const value = parameters[key];
            if (value !== undefined && value !== '') {
                const error = validateValue(value, prop);
                if (error) {
                    newErrors[key] = error;
                }
            }
        });
        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
    };
    const validateValue = (value, prop) => {
        switch (prop.type) {
            case 'string':
                if (typeof value !== 'string')
                    return 'Must be a string';
                if (prop.pattern && !new RegExp(prop.pattern).test(value)) {
                    return 'Invalid format';
                }
                break;
            case 'number':
                const num = Number(value);
                if (isNaN(num))
                    return 'Must be a number';
                if (prop.minimum !== undefined && num < prop.minimum) {
                    return `Must be at least ${prop.minimum}`;
                }
                if (prop.maximum !== undefined && num > prop.maximum) {
                    return `Must be at most ${prop.maximum}`;
                }
                break;
            case 'boolean':
                if (typeof value !== 'boolean')
                    return 'Must be true or false';
                break;
            case 'array':
                if (!Array.isArray(value))
                    return 'Must be an array';
                break;
        }
        return null;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) {
            onSubmit(parameters);
        }
    };
    const renderInput = (paramName, prop) => {
        const value = parameters[paramName] || '';
        const error = errors[paramName];
        const commonProps = {
            value,
            onChange: (e) => {
                setParameters(prev => ({
                    ...prev,
                    [paramName]: e.target.value
                }));
            },
            className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`
        };
        switch (prop.type) {
            case 'string':
                if (prop.enum) {
                    return ((0, jsx_runtime_1.jsxs)("select", { ...commonProps, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select an option" }), prop.enum.map(option => ((0, jsx_runtime_1.jsx)("option", { value: option, children: option }, option)))] }));
                }
                if (prop.description?.toLowerCase().includes('multiline') ||
                    prop.description?.toLowerCase().includes('text area')) {
                    return (0, jsx_runtime_1.jsx)("textarea", { ...commonProps, rows: 3 });
                }
                return (0, jsx_runtime_1.jsx)("input", { type: "text", ...commonProps });
            case 'number':
                return ((0, jsx_runtime_1.jsx)("input", { type: "number", ...commonProps, min: prop.minimum, max: prop.maximum }));
            case 'boolean':
                return ((0, jsx_runtime_1.jsxs)("select", { ...commonProps, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select" }), (0, jsx_runtime_1.jsx)("option", { value: "true", children: "True" }), (0, jsx_runtime_1.jsx)("option", { value: "false", children: "False" })] }));
            default:
                return (0, jsx_runtime_1.jsx)("input", { type: "text", ...commonProps });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "font-medium text-gray-900 dark:text-white mb-1", children: ["Configure ", tool.name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Fill in the required parameters below" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [Object.entries(tool.inputSchema.properties).map(([paramName, prop]) => {
                        const isRequired = tool.inputSchema.required?.includes(paramName);
                        const error = errors[paramName];
                        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [paramName, isRequired && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500 ml-1", children: "*" })] }), prop.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-2", children: prop.description })), renderInput(paramName, prop), error && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-red-600 dark:text-red-400 mt-1", children: error })), prop.default !== undefined && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: ["Default: ", String(prop.default)] }))] }, paramName));
                    }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: !isValid, className: "flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Execute Tool" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onCancel, className: "px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors", children: "Cancel" })] })] })] }));
};
exports.ParameterInput = ParameterInput;
//# sourceMappingURL=parameter-input.js.map