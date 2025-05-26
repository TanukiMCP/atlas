"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowParameterDialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Workflow Parameter Input Dialog
 * Collects required parameters before executing a workflow
 */
const react_1 = require("react");
const dialog_1 = require("../ui/dialog");
const button_1 = require("../ui/button");
const input_1 = require("../ui/input");
const scroll_area_1 = require("../ui/scroll-area");
const lucide_react_1 = require("lucide-react");
const WorkflowParameterDialog = ({ isOpen, workflow, onExecute, onCancel }) => {
    const [parameters, setParameters] = (0, react_1.useState)({});
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isExecuting, setIsExecuting] = (0, react_1.useState)(false);
    // Initialize parameters with default values
    (0, react_1.useEffect)(() => {
        if (isOpen && workflow) {
            const initialParams = {};
            workflow.parameters.forEach(param => {
                if (param.default !== undefined) {
                    initialParams[param.name] = param.default;
                }
            });
            setParameters(initialParams);
            setErrors({});
            setIsExecuting(false);
        }
    }, [isOpen, workflow]);
    const handleParameterChange = (paramName, value) => {
        setParameters(prev => ({
            ...prev,
            [paramName]: value
        }));
        // Clear error for this parameter
        if (errors[paramName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[paramName];
                return newErrors;
            });
        }
    };
    const validateParameters = () => {
        const newErrors = {};
        workflow.parameters.forEach(param => {
            const value = parameters[param.name];
            // Check required parameters
            if (param.required && (value === undefined || value === null || value === '')) {
                newErrors[param.name] = `${param.name} is required`;
                return;
            }
            // Skip validation for empty optional parameters
            if (!param.required && (value === undefined || value === null || value === '')) {
                return;
            }
            // Type validation
            if (!validateParameterType(value, param.type)) {
                newErrors[param.name] = `Invalid type for ${param.name}. Expected ${param.type}`;
                return;
            }
            // Custom validation
            if (param.validation) {
                const validationError = validateParameterValue(value, param.validation);
                if (validationError) {
                    newErrors[param.name] = validationError;
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const validateParameterType = (value, expectedType) => {
        switch (expectedType) {
            case 'string':
                return typeof value === 'string';
            case 'number':
                return typeof value === 'number' && !isNaN(value);
            case 'boolean':
                return typeof value === 'boolean';
            case 'array':
                return Array.isArray(value);
            case 'file':
                return typeof value === 'string'; // File path as string
            default:
                return true; // Unknown types pass validation
        }
    };
    const validateParameterValue = (value, validation) => {
        if (validation.minimum !== undefined && value < validation.minimum) {
            return `Value must be at least ${validation.minimum}`;
        }
        if (validation.maximum !== undefined && value > validation.maximum) {
            return `Value must be at most ${validation.maximum}`;
        }
        if (validation.minLength !== undefined && value.length < validation.minLength) {
            return `Must be at least ${validation.minLength} characters`;
        }
        if (validation.maxLength !== undefined && value.length > validation.maxLength) {
            return `Must be at most ${validation.maxLength} characters`;
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
            return `Value does not match required pattern`;
        }
        return null;
    };
    const handleExecute = async () => {
        if (!validateParameters()) {
            return;
        }
        setIsExecuting(true);
        try {
            await onExecute(parameters);
        }
        finally {
            setIsExecuting(false);
        }
    };
    const renderParameterInput = (param) => {
        const value = parameters[param.name];
        const baseInputClass = "w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
        switch (param.type) {
            case 'string':
                if (param.validation?.enum) {
                    // Dropdown for enum values
                    return ((0, jsx_runtime_1.jsxs)("select", { value: value || '', onChange: (e) => handleParameterChange(param.name, e.target.value), className: baseInputClass, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select an option..." }), param.validation.enum.map((option) => ((0, jsx_runtime_1.jsx)("option", { value: option, children: option }, option)))] }));
                }
                else {
                    // Text input
                    return ((0, jsx_runtime_1.jsx)(input_1.Input, { type: "text", value: value || '', onChange: (e) => handleParameterChange(param.name, e.target.value), placeholder: param.description }));
                }
            case 'number':
                return ((0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", value: value || '', onChange: (e) => handleParameterChange(param.name, parseFloat(e.target.value) || 0), placeholder: param.description, min: param.validation?.minimum, max: param.validation?.maximum }));
            case 'boolean':
                return ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: value || false, onChange: (e) => handleParameterChange(param.name, e.target.checked), className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-muted-foreground", children: param.description })] }));
            case 'file':
                return ((0, jsx_runtime_1.jsx)("input", { type: "file", onChange: (e) => {
                        const file = e.target.files?.[0];
                        handleParameterChange(param.name, file ? file.name : '');
                    }, className: baseInputClass }));
            case 'array':
                return ((0, jsx_runtime_1.jsx)("textarea", { value: Array.isArray(value) ? value.join('\n') : '', onChange: (e) => handleParameterChange(param.name, e.target.value.split('\n').filter(line => line.trim())), placeholder: "Enter one item per line", rows: 3, className: baseInputClass }));
            default:
                return ((0, jsx_runtime_1.jsx)(input_1.Input, { type: "text", value: value || '', onChange: (e) => handleParameterChange(param.name, e.target.value), placeholder: param.description }));
        }
    };
    return ((0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: isOpen, onOpenChange: (open) => !open && onCancel(), children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-[600px] max-h-[80vh] flex flex-col", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "Execute Workflow" }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: workflow.name })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "py-4 border-b", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: workflow.description }), workflow.tags && workflow.tags.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 flex flex-wrap gap-1", children: workflow.tags.map(tag => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 text-xs bg-muted text-muted-foreground rounded", children: tag }, tag))) }))] }), (0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "flex-1 pr-4", children: workflow.parameters.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center text-muted-foreground py-8", children: [(0, jsx_runtime_1.jsx)("p", { children: "This workflow requires no parameters." }), (0, jsx_runtime_1.jsx)("p", { children: "Click Execute to run it immediately." })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium", children: "Workflow Parameters" }), workflow.parameters.map(param => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium", children: [param.name, param.required && (0, jsx_runtime_1.jsx)("span", { className: "text-destructive ml-1", children: "*" })] }), renderParameterInput(param), errors[param.name] && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-destructive", children: errors[param.name] })), param.description && !errors[param.name] && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: param.description }))] }, param.name)))] })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2 pt-4 border-t", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: onCancel, disabled: isExecuting, children: "Cancel" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: handleExecute, disabled: isExecuting, children: [isExecuting && (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), isExecuting ? 'Executing...' : 'Execute Workflow'] })] })] }) }));
};
exports.WorkflowParameterDialog = WorkflowParameterDialog;
//# sourceMappingURL=workflow-parameter-dialog.js.map