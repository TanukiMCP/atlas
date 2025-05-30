import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
// import { Switch } from '../ui/switch'; // MISSING COMPONENT
// import { Label } from '../ui/label'; // MISSING COMPONENT
// import { RadioGroup, RadioGroupItem } from '../ui/radio-group'; // MISSING COMPONENT
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info } from 'lucide-react';
// import { Separator } from '../ui/separator'; // MISSING COMPONENT
import { Button } from '../ui/button';

// Placeholder for missing Label component
const Label = ({ htmlFor, className, children }: { htmlFor?: string; className?: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className={className}>{children}</label>
);

// Placeholder for missing RadioGroup component
const RadioGroup = ({ value, onValueChange, className, children }: { value: string; onValueChange: (value: string) => void; className?: string; children: React.ReactNode }) => (
  <div className={className}>{children}</div>
);
// Placeholder for missing RadioGroupItem component
const RadioGroupItem = ({ value, id }: { value: string; id: string }) => (
  <input type="radio" name="radio-group-placeholder" value={value} id={id} />
);

// Placeholder for missing Separator component
const Separator = () => <hr className="my-4 border-muted" />;

// Placeholder for missing Switch component
const Switch = ({ checked, onCheckedChange, id }: { checked: boolean, onCheckedChange: (checked: boolean) => void, id?: string }) => (
  <input type="checkbox" id={id} checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} className="h-6 w-10 appearance-none rounded-full bg-gray-300 checked:bg-blue-500 transition-all duration-300 ease-in-out relative inline-block cursor-pointer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-300 after:ease-in-out checked:after:translate-x-4" />
);

interface ToolSettingsProps {
  onSettingsChange?: (settings: ToolSettings) => void;
}

export interface ToolSettings {
  approvalMode: 'auto' | 'manual' | 'selective';
  selectiveTools: string[];
  showToolContext: boolean;
  visualDiffing: boolean;
  diffingAnimationSpeed: 'slow' | 'normal' | 'fast';
  clearThoughtReasoning: boolean;
}

const ToolSettings: React.FC<ToolSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<ToolSettings>({
    approvalMode: 'auto',
    selectiveTools: [],
    showToolContext: true,
    visualDiffing: true,
    diffingAnimationSpeed: 'normal',
    clearThoughtReasoning: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('tool_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Failed to parse saved tool settings:', error);
      }
    }
  }, []);

  const handleSettingChange = <K extends keyof ToolSettings>(key: K, value: ToolSettings[K]) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    localStorage.setItem('tool_settings', JSON.stringify(updatedSettings));
    onSettingsChange?.(updatedSettings);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tool Execution Settings</CardTitle>
        <CardDescription>Configure how tools are executed in your conversations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Approval Mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Tool Approval Mode</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Control how tools are executed when requested by the AI assistant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <RadioGroup 
            value={settings.approvalMode} 
            onValueChange={(value) => handleSettingChange('approvalMode', value as 'auto' | 'manual' | 'selective')}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="auto" id="auto" />
              <Label htmlFor="auto" className="font-normal">Automatic Execution</Label>
            </div>
            <div className="text-xs text-muted-foreground ml-6 -mt-1 mb-2">
              Tools will execute automatically without confirmation
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual" className="font-normal">Manual Approval</Label>
            </div>
            <div className="text-xs text-muted-foreground ml-6 -mt-1 mb-2">
              All tool executions require your confirmation
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selective" id="selective" />
              <Label htmlFor="selective" className="font-normal">Selective Approval</Label>
            </div>
            <div className="text-xs text-muted-foreground ml-6 -mt-1 mb-2">
              Only specific tools require confirmation (configure in Tool Browser)
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Tool Context */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="show-context" className="text-base font-medium">Show Tool Context</Label>
            <p className="text-sm text-muted-foreground">
              Provide AI with context about available tools
            </p>
          </div>
          <Switch 
            id="show-context"
            checked={settings.showToolContext}
            onCheckedChange={(checked) => handleSettingChange('showToolContext', checked)}
          />
        </div>
        
        {/* Visual Diffing */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="visual-diffing" className="text-base font-medium">Visual Diffing</Label>
            <p className="text-sm text-muted-foreground">
              Show visual diffs for file modifications
            </p>
          </div>
          <Switch 
            id="visual-diffing"
            checked={settings.visualDiffing}
            onCheckedChange={(checked) => handleSettingChange('visualDiffing', checked)}
          />
        </div>
        
        {/* Animation Speed (only if visualDiffing is enabled) */}
        {settings.visualDiffing && (
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <Label className="text-sm font-medium">Animation Speed</Label>
            <RadioGroup 
              value={settings.diffingAnimationSpeed} 
              onValueChange={(value) => handleSettingChange('diffingAnimationSpeed', value as 'slow' | 'normal' | 'fast')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="slow" id="slow" />
                <Label htmlFor="slow" className="font-normal text-sm">Slow</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="font-normal text-sm">Normal</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="fast" id="fast" />
                <Label htmlFor="fast" className="font-normal text-sm">Fast</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        
        <Separator />
        
        {/* Clear Thought Integration */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="clear-thought" className="text-base font-medium">Clear Thought Reasoning</Label>
            <p className="text-sm text-muted-foreground">
              Enable advanced reasoning capabilities for complex tasks
            </p>
          </div>
          <Switch 
            id="clear-thought"
            checked={settings.clearThoughtReasoning}
            onCheckedChange={(checked) => handleSettingChange('clearThoughtReasoning', checked)}
          />
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="secondary" 
            onClick={() => {
              const defaultSettings: ToolSettings = {
                approvalMode: 'auto',
                selectiveTools: [],
                showToolContext: true,
                visualDiffing: true,
                diffingAnimationSpeed: 'normal',
                clearThoughtReasoning: true
              };
              setSettings(defaultSettings);
              localStorage.setItem('tool_settings', JSON.stringify(defaultSettings));
              onSettingsChange?.(defaultSettings);
            }}
          >
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolSettings; 