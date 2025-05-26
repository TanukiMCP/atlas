/**
 * Workflow Parameter Input Dialog
 * Collects required parameters before executing a workflow
 */

import React, { useState, useEffect } from 'react';
import { WorkflowTemplate, WorkflowParameter } from '../../services/workflow-execution/workflow-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2, Settings } from 'lucide-react';

interface WorkflowParameterDialogProps {
  isOpen: boolean;
  workflow: WorkflowTemplate;
  onExecute: (parameters: Record<string, any>) => void;
  onCancel: () => void;
}

export const WorkflowParameterDialog: React.FC<WorkflowParameterDialogProps> = ({
  isOpen,
  workflow,
  onExecute,
  onCancel
}) => {
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExecuting, setIsExecuting] = useState(false);

  // Initialize parameters with default values
  useEffect(() => {
    if (isOpen && workflow) {
      const initialParams: Record<string, any> = {};
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

  const handleParameterChange = (paramName: string, value: any) => {
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

  const validateParameters = (): boolean => {
    const newErrors: Record<string, string> = {};
    
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

  const validateParameterType = (value: any, expectedType: string): boolean => {
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

  const validateParameterValue = (value: any, validation: any): string | null => {
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
    } finally {
      setIsExecuting(false);
    }
  };

  const renderParameterInput = (param: WorkflowParameter) => {
    const value = parameters[param.name];
    const baseInputClass = "w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    switch (param.type) {
      case 'string':
        if (param.validation?.enum) {
          // Dropdown for enum values
          return (
            <select
              value={value || ''}
              onChange={(e) => handleParameterChange(param.name, e.target.value)}
              className={baseInputClass}
            >
              <option value="">Select an option...</option>
              {param.validation.enum.map((option: any) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        } else {
          // Text input
          return (
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => handleParameterChange(param.name, e.target.value)}
              placeholder={param.description}
            />
          );
        }
      
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleParameterChange(param.name, parseFloat(e.target.value) || 0)}
            placeholder={param.description}
            min={param.validation?.minimum}
            max={param.validation?.maximum}
          />
        );
      
      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleParameterChange(param.name, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-muted-foreground">
              {param.description}
            </span>
          </label>
        );
      
      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              handleParameterChange(param.name, file ? file.name : '');
            }}
            className={baseInputClass}
          />
        );
      
      case 'array':
        return (
          <textarea
            value={Array.isArray(value) ? value.join('\n') : ''}
            onChange={(e) => handleParameterChange(param.name, e.target.value.split('\n').filter(line => line.trim()))}
            placeholder="Enter one item per line"
            rows={3}
            className={baseInputClass}
          />
        );
      
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleParameterChange(param.name, e.target.value)}
            placeholder={param.description}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle>Execute Workflow</DialogTitle>
              <DialogDescription>
                {workflow.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Workflow Description */}
        <div className="py-4 border-b">
          <p className="text-sm text-muted-foreground">
            {workflow.description}
          </p>
          {workflow.tags && workflow.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {workflow.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Parameters */}
        <ScrollArea className="flex-1 pr-4">
          {workflow.parameters.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>This workflow requires no parameters.</p>
              <p>Click Execute to run it immediately.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">
                Workflow Parameters
              </h3>
              {workflow.parameters.map(param => (
                <div key={param.name} className="space-y-1">
                  <label className="block text-sm font-medium">
                    {param.name}
                    {param.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  {renderParameterInput(param)}
                  {errors[param.name] && (
                    <p className="text-sm text-destructive">{errors[param.name]}</p>
                  )}
                  {param.description && !errors[param.name] && (
                    <p className="text-xs text-muted-foreground">
                      {param.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
              onClick={onCancel}
              disabled={isExecuting}
            >
              Cancel
          </Button>
          <Button
              onClick={handleExecute}
              disabled={isExecuting}
            >
            {isExecuting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isExecuting ? 'Executing...' : 'Execute Workflow'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};