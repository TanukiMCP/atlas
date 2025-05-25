import React, { useState, useEffect } from 'react';
import { UnifiedTool, ToolProperty } from '../types/tool-router-types';

interface ParameterInputProps {
  tool: UnifiedTool;
  onSubmit: (parameters: any) => void;
  onCancel: () => void;
}

export const ParameterInput: React.FC<ParameterInputProps> = ({
  tool,
  onSubmit,
  onCancel
}) => {
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Initialize with default values
    const initialParams: Record<string, any> = {};
    
    Object.entries(tool.inputSchema.properties).forEach(([key, prop]) => {
      if (prop.default !== undefined) {
        initialParams[key] = prop.default;
      }
    });
    
    setParameters(initialParams);
  }, [tool]);

  useEffect(() => {
    validateParameters();
  }, [parameters]);

  const validateParameters = () => {
    const newErrors: Record<string, string> = {};
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

  const validateValue = (value: any, prop: ToolProperty): string | null => {
    switch (prop.type) {
      case 'string':
        if (typeof value !== 'string') return 'Must be a string';
        if (prop.pattern && !new RegExp(prop.pattern).test(value)) {
          return 'Invalid format';
        }
        break;
      case 'number':
        const num = Number(value);
        if (isNaN(num)) return 'Must be a number';
        if (prop.minimum !== undefined && num < prop.minimum) {
          return `Must be at least ${prop.minimum}`;
        }
        if (prop.maximum !== undefined && num > prop.maximum) {
          return `Must be at most ${prop.maximum}`;
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') return 'Must be true or false';
        break;
      case 'array':
        if (!Array.isArray(value)) return 'Must be an array';
        break;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(parameters);
    }
  };

  const renderInput = (paramName: string, prop: ToolProperty) => {
    const value = parameters[paramName] || '';
    const error = errors[paramName];
    
    const commonProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setParameters(prev => ({
          ...prev,
          [paramName]: e.target.value
        }));
      },
      className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error 
          ? 'border-red-300 dark:border-red-600' 
          : 'border-gray-300 dark:border-gray-600'
      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`
    };

    switch (prop.type) {
      case 'string':
        if (prop.enum) {
          return (
            <select {...commonProps}>
              <option value="">Select an option</option>
              {prop.enum.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          );
        }
        
        if (prop.description?.toLowerCase().includes('multiline') || 
            prop.description?.toLowerCase().includes('text area')) {
          return <textarea {...commonProps} rows={3} />;
        }
        
        return <input type="text" {...commonProps} />;
        
      case 'number':
        return (
          <input 
            type="number" 
            {...commonProps}
            min={prop.minimum}
            max={prop.maximum}
          />
        );
        
      case 'boolean':
        return (
          <select {...commonProps}>
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
        
      default:
        return <input type="text" {...commonProps} />;
    }
  };  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
          Configure {tool.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Fill in the required parameters below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(tool.inputSchema.properties).map(([paramName, prop]) => {
          const isRequired = tool.inputSchema.required?.includes(paramName);
          const error = errors[paramName];
          
          return (
            <div key={paramName}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {paramName}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {prop.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {prop.description}
                </p>
              )}
              
              {renderInput(paramName, prop)}
              
              {error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {error}
                </p>
              )}
              
              {prop.default !== undefined && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Default: {String(prop.default)}
                </p>
              )}
            </div>
          );
        })}

        <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Execute Tool
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};