"use strict";
/**
 * Workflow Parameter Input Dialog
 * Collects required parameters before executing a workflow
 */
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
exports.WorkflowParameterDialog = void 0;
const react_1 = __importStar(require("react"));
const WorkflowParameterDialog = ({ isOpen, workflow, onExecute, onCancel }) => {
    const [parameters, setParameters] = (0, react_1.useState)({});
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isExecuting, setIsExecuting] = (0, react_1.useState)(false);
    // Initialize parameters with default values
    (0, react_1.useEffect)(() => {
        if (isOpen && workflow) {
            const initialParams = {};
            workflow.parameters.forEach(param => {
                if (param.defaultValue !== undefined) {
                    initialParams[param.name] = param.defaultValue;
                }
                else {
                    // Set appropriate empty values based on type
                    switch (param.type) {
                        case 'string':
                            initialParams[param.name] = '';
                            break;
                        case 'number':
                            initialParams[param.name] = 0;
                            break;
                        case 'boolean':
                            initialParams[param.name] = false;
                            break;
                        case 'array':
                            initialParams[param.name] = [];
                            break;
                        case 'object':
                            initialParams[param.name] = {};
                            break;
                        default:
                            initialParams[param.name] = '';
                    }
                }
            });
            setParameters(initialParams);
            setErrors({});
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
            // Required parameter check
            if (param.required && (value === undefined || value === null || value === '')) {
                newErrors[param.name] = 'This parameter is required';
                return;
            }
            // Skip validation for empty optional parameters
            if (!param.required && (value === undefined || value === null || value === '')) {
                return;
            }
            // Type validation
            if (!validateParameterType(value, param.type)) {
                newErrors[param.name] = `Invalid type. Expected ${param.type}`;
                return;
            }
            // Value validation
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
            case 'object':
                return typeof value === 'object' && value !== null && !Array.isArray(value);
            case 'file':
                return typeof value === 'string';
            default:
                return true;
        }
    };
    const validateParameterValue = (value, validation) => {
        if (validation.minLength && value.length < validation.minLength) {
            return `Must be at least ${validation.minLength} characters`;
        }
        if (validation.maxLength && value.length > validation.maxLength) {
            return `Must be at most ${validation.maxLength} characters`;
        }
        if (validation.minimum && value < validation.minimum) {
            return `Must be at least ${validation.minimum}`;
        }
        if (validation.maximum && value > validation.maximum) {
            return `Must be at most ${validation.maximum}`;
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
            return 'Does not match required pattern';
        }
        if (validation.enum && !validation.enum.includes(value)) {
            return `Must be one of: ${validation.enum.join(', ')}`;
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
        catch (error) {
            console.error('Workflow execution failed:', error);
        }
        finally {
            setIsExecuting(false);
        }
    };
    const renderParameterInput = (param) => {
        const value = parameters[param.name];
        const error = errors[param.name];
        const baseInputClass = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`;
        switch (param.type) {
            case 'string':
                if (param.validation?.enum) {
                    // Dropdown for enum values
                    return (<select value={value || ''} onChange={(e) => handleParameterChange(param.name, e.target.value)} className={baseInputClass}>
              <option value="">Select an option...</option>
              {param.validation.enum.map((option) => (<option key={option} value={option}>
                  {option}
                </option>))}
            </select>);
                }
                else {
                    // Text input
                    return (<input type="text" value={value || ''} onChange={(e) => handleParameterChange(param.name, e.target.value)} placeholder={param.description} className={baseInputClass}/>);
                }
            case 'number':
                return (<input type="number" value={value || ''} onChange={(e) => handleParameterChange(param.name, parseFloat(e.target.value) || 0)} placeholder={param.description} min={param.validation?.minimum} max={param.validation?.maximum} className={baseInputClass}/>);
            case 'boolean':
                return (<label className="flex items-center space-x-2">
            <input type="checkbox" checked={value || false} onChange={(e) => handleParameterChange(param.name, e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {param.description}
            </span>
          </label>);
            case 'file':
                return (<input type="file" onChange={(e) => {
                        const file = e.target.files?.[0];
                        handleParameterChange(param.name, file ? file.name : '');
                    }} className={baseInputClass}/>);
            case 'array':
                return (<textarea value={Array.isArray(value) ? value.join('\n') : ''} onChange={(e) => handleParameterChange(param.name, e.target.value.split('\n').filter(line => line.trim()))} placeholder="Enter one item per line" rows={3} className={baseInputClass}/>);
            default:
                return (<input type="text" value={value || ''} onChange={(e) => handleParameterChange(param.name, e.target.value)} placeholder={param.description} className={baseInputClass}/>);
        }
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              🔧
            </div>
            <div>
              <h2 className="text-lg font-semibold">Execute Workflow</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {workflow.name}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            ✕
          </button>
        </div>

        {/* Workflow Description */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {workflow.description}
          </p>
          {workflow.tags && workflow.tags.length > 0 && (<div className="mt-2 flex flex-wrap gap-1">
              {workflow.tags.map(tag => (<span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  {tag}
                </span>))}
            </div>)}
        </div>

        {/* Parameters */}
        <div className="flex-1 overflow-y-auto p-4">
          {workflow.parameters.length === 0 ? (<div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>This workflow requires no parameters.</p>
              <p>Click Execute to run it immediately.</p>
            </div>) : (<div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Workflow Parameters
              </h3>
              {workflow.parameters.map(param => (<div key={param.name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {param.name}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderParameterInput(param)}
                  {errors[param.name] && (<p className="text-sm text-red-600">{errors[param.name]}</p>)}
                  {param.description && !errors[param.name] && (<p className="text-xs text-gray-500 dark:text-gray-400">
                      {param.description}
                    </p>)}
                </div>))}
            </div>)}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end space-x-2">
            <button onClick={onCancel} disabled={isExecuting} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleExecute} disabled={isExecuting} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
              {isExecuting && (<div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/>)}
              <span>{isExecuting ? 'Executing...' : 'Execute Workflow'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>);
};
exports.WorkflowParameterDialog = WorkflowParameterDialog;
//# sourceMappingURL=workflow-parameter-dialog.js.map