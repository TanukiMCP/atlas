import React, { useEffect, useState } from 'react';
import { useLocalLLMStore } from '../../stores/local-llm-store';
import { useLLMStore } from '../../stores/llm-store';
import { TanukiModel, SystemCapabilities } from '../../types/index';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, CheckCircle, Download, Server, Trash2, X, Cpu, HardDrive, Zap, Database } from 'lucide-react';

// Create Alert components since they might not exist in the UI library
interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ children, variant = "default", className = "" }) => {
  const variantClasses = {
    default: "bg-primary/10 text-primary",
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success"
  };
  
  return (
    <div className={`p-4 rounded-md ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface AlertTitleProps {
  children: React.ReactNode;
}

const AlertTitle: React.FC<AlertTitleProps> = ({ children }) => (
  <h5 className="font-medium mb-1 flex items-center gap-2">{children}</h5>
);

interface AlertDescriptionProps {
  children: React.ReactNode;
}

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => (
  <div className="text-sm opacity-90">{children}</div>
);

const LocalLLMHub: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('installed');
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [isOllamaInstalled, setIsOllamaInstalled] = useState<boolean>(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState<boolean>(false);
  
  // Local LLM store
  const {
    availableModels,
    installedModels,
    currentModel,
    isLoading,
    error,
    systemCapabilities,
    isSystemCapable,
    hardwareAssessment,
    isServerRunning,
    modelInstallProgress,
    checkSystemRequirements,
    installModel,
    uninstallModel,
    startServer,
    stopServer,
    fetchAvailableModels,
    getModelCompatibility
  } = useLocalLLMStore();
  
  // OpenRouter LLM store for integration
  const { setCurrentModel: setGlobalCurrentModel } = useLLMStore();
  
  // Initialize on component mount
  useEffect(() => {
    const init = async () => {
      await checkSystemRequirements();
      
      // Check if Ollama is installed
      if (window.electronAPI && typeof window.electronAPI.invoke === 'function') {
        try {
          const result = await window.electronAPI.invoke('llm:checkOllamaInstallStatus');
          setIsOllamaInstalled(result.isInstalled);
        } catch (error) {
          console.error('Error checking Ollama installation:', error);
        }
      }
    };
    
    init();
  }, []);
  
  // Handle model installation
  const handleInstallModel = async (modelName: string) => {
    try {
      await installModel(modelName);
    } catch (error) {
      console.error('Error installing model:', error);
    }
  };
  
  // Handle model uninstallation
  const handleUninstallModel = async (modelName: string) => {
    try {
      await uninstallModel(modelName);
    } catch (error) {
      console.error('Error uninstalling model:', error);
    }
  };
  
  // Handle server start/stop
  const handleStartServer = async () => {
    try {
      await startServer();
    } catch (error) {
      console.error('Error starting server:', error);
    }
  };
  
  const handleStopServer = async () => {
    try {
      await stopServer();
    } catch (error) {
      console.error('Error stopping server:', error);
    }
  };
  
  // Handle server refresh
  const handleRefresh = async () => {
    try {
      await fetchAvailableModels();
    } catch (error) {
      console.error('Error refreshing models:', error);
    }
  };
  
  // Handle Ollama installation
  const handleInstallOllama = async () => {
    setIsInstalling(true);
    
    try {
      if (window.electronAPI && typeof window.electronAPI.invoke === 'function') {
        const result = await window.electronAPI.invoke('llm:installOllama');
        
        if (result.success) {
          setShowInstallInstructions(true);
        } else {
          console.error('Error installing Ollama:', result.error);
        }
      }
    } catch (error) {
      console.error('Error installing Ollama:', error);
    } finally {
      setIsInstalling(false);
    }
  };
  
  // Render system requirements section
  const renderSystemRequirements = () => {
    if (!systemCapabilities) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-muted-foreground">Checking system capabilities...</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <Alert variant={isSystemCapable ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Check</AlertTitle>
          <AlertDescription>
            {isSystemCapable 
              ? "Your system meets the minimum requirements to run local LLMs" 
              : "Your system does not meet the minimum requirements to run local LLMs"}
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory</CardTitle>
              <CardDescription>Available RAM for LLM execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total RAM</span>
                  <span>{Math.round(systemCapabilities.totalRam / 1024)}GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Available RAM</span>
                  <span>{Math.round(systemCapabilities.availableRam / 1024)}GB</span>
                </div>
                <Progress 
                  value={(systemCapabilities.availableRam / systemCapabilities.totalRam) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Processor</CardTitle>
              <CardDescription>CPU cores available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>CPU Cores</span>
                  <span>{systemCapabilities.cpuCores}</span>
                </div>
                {systemCapabilities.gpuInfo && (
                  <>
                    <div className="flex justify-between">
                      <span>GPU</span>
                      <span>{systemCapabilities.gpuInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VRAM</span>
                      <span>{Math.round(systemCapabilities.gpuInfo.memory / 1024)}GB</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Storage</CardTitle>
              <CardDescription>Disk space for model storage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Disk Space</span>
                  <span>{Math.round(systemCapabilities.diskSpace / 1024)}GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="pt-4">
          <h3 className="text-lg font-medium mb-2">Recommended Models</h3>
          <div className="flex flex-wrap gap-2">
            {systemCapabilities.recommendedModels.map((model) => (
              <Badge key={model} variant="outline">{model}</Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render available models section
  const renderModels = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-muted-foreground">Loading models...</div>
          </div>
        </div>
      );
    }
    
    if (!isSystemCapable) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Requirements Not Met</AlertTitle>
          <AlertDescription>
            Your system does not meet the minimum requirements to run local LLMs.
            Please check the System tab for more details.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!isServerRunning) {
      return (
        <div className="text-center py-8">
          <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">LLM Server Not Running</h3>
          <p className="text-muted-foreground mb-4">
            The local LLM server needs to be started to manage models
          </p>
          <Button onClick={handleStartServer}>
            Start Server
          </Button>
        </div>
      );
    }
    
    if (availableModels.length === 0) {
      return (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Models Available</h3>
          <p className="text-muted-foreground mb-4">
            You don't have any local models installed yet
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => handleInstallModel('llama2:7b-chat-q4_0')}>
              Install Llama 2 (7B)
            </Button>
            <Button onClick={() => handleInstallModel('mistral:7b-instruct-v0.1-q4_0')}>
              Install Mistral (7B)
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableModels.map((model) => (
            <Card 
              key={model.name}
              className={currentModel?.name === model.name ? 'border-primary' : ''}
            >
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{model.displayName}</CardTitle>
                  {currentModel?.name === model.name && (
                    <Badge variant="outline" className="ml-2">Active</Badge>
                  )}
                </div>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Size</span>
                    <span>{Math.round(model.size / 1024)}GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parameters</span>
                    <span>{model.parameterCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Family</span>
                    <span>{model.family}</span>
                  </div>
                  {model.quantization && (
                    <div className="flex justify-between">
                      <span>Quantization</span>
                      <span>{model.quantization}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handleUninstallModel(model.name)}
                  disabled={isLoading || !isServerRunning}
                >
                  Uninstall
                </Button>
                <Button 
                  onClick={() => handleInstallModel(model.name)}
                  disabled={isLoading || !isServerRunning || getModelCompatibility(model) === 'incompatible'}
                >
                  Install
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="pt-4">
          <h3 className="text-lg font-medium mb-2">Install Additional Models</h3>
          <div className="flex flex-wrap gap-2">
            {!availableModels.some(m => m.name === 'llama2:7b-chat-q4_0') && (
              <Button 
                variant="outline" 
                onClick={() => handleInstallModel('llama2:7b-chat-q4_0')}
                disabled={isInstalling}
              >
                {isInstalling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Llama 2 (7B)
                  </>
                )}
              </Button>
            )}
            
            {!availableModels.some(m => m.name === 'mistral:7b-instruct-v0.1-q4_0') && (
              <Button 
                variant="outline" 
                onClick={() => handleInstallModel('mistral:7b-instruct-v0.1-q4_0')}
                disabled={isInstalling}
              >
                {isInstalling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Mistral (7B)
                  </>
                )}
              </Button>
            )}
            
            {!availableModels.some(m => m.name === 'phi:2-q4_0') && (
              <Button 
                variant="outline" 
                onClick={() => handleInstallModel('phi:2-q4_0')}
                disabled={isInstalling}
              >
                {isInstalling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Phi-2
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Render server management section
  const renderServer = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>LLM Server Status</CardTitle>
            <CardDescription>Manage the local Ollama server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isServerRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isServerRunning ? 'Running' : 'Stopped'}</span>
            </div>
            {isServerRunning && (
              <p className="text-sm text-muted-foreground mt-2">
                Server URL: {useLocalLLMStore.getState().serverUrl}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartServer}>
              {isServerRunning ? 'Stop Server' : 'Start Server'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Installation</CardTitle>
            <CardDescription>Ollama server installation status</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Ollama is required to run local LLMs. If you haven't installed it yet, please visit 
              <a 
                href="https://ollama.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                ollama.ai
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render system information section
  const renderSystemInfo = () => {
    if (!systemCapabilities) return null;
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>System Capabilities</CardTitle>
          <CardDescription>Hardware assessment for running local LLMs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <div>
                <div className="font-medium">RAM</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(systemCapabilities.availableRam / 1024)}GB available / {Math.round(systemCapabilities.totalRam / 1024)}GB total
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              <div>
                <div className="font-medium">CPU</div>
                <div className="text-sm text-muted-foreground">
                  {systemCapabilities.cpuCores} cores
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              <div>
                <div className="font-medium">Disk Space</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(systemCapabilities.diskSpace / 1024)}GB available
                </div>
              </div>
            </div>
            
            {systemCapabilities.gpuInfo && (
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <div>
                  <div className="font-medium">GPU</div>
                  <div className="text-sm text-muted-foreground">
                    {systemCapabilities.gpuInfo.name} ({Math.round(systemCapabilities.gpuInfo.memory / 1024)}MB)
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {hardwareAssessment && (
            <div className="mt-4">
              {hardwareAssessment.warnings.length > 0 && (
                <Alert className="mb-2" variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warnings</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 text-sm">
                      {hardwareAssessment.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {hardwareAssessment.optimizationTips.length > 0 && (
                <Alert className="mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Optimization Tips</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 text-sm">
                      {hardwareAssessment.optimizationTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Local LLM Hub</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-10">
            <TabsTrigger value="installed">Installed Models</TabsTrigger>
            <TabsTrigger value="available">Available Models</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="installed" className="h-full">
            {isLoading ? (
              <div className="text-center py-8">Loading installed models...</div>
            ) : installedModels.length === 0 ? (
              <div className="text-center py-8">No models installed. Install models from the Available tab.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {installedModels.map((model) => (
                  <Card key={model.name} className="w-full max-w-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{model.displayName}</CardTitle>
                        <Badge 
                          variant={
                            getModelCompatibility(model) === 'compatible' ? 'default' : 
                            getModelCompatibility(model) === 'limited' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {
                            getModelCompatibility(model) === 'compatible' ? 'Compatible' : 
                            getModelCompatibility(model) === 'limited' ? 'Limited' : 
                            'Incompatible'
                          }
                        </Badge>
                      </div>
                      <CardDescription>{model.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Database className="h-4 w-4" />
                          <span>RAM: {Math.round(model.requirements.minRam / 1024)}GB</span>
                        </div>
                        {model.requirements.minVram && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            <span>VRAM: {Math.round(model.requirements.minVram / 1024)}GB</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-4 w-4" />
                          <span>Size: {Math.round(model.size / 1024)}GB</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Cpu className="h-4 w-4" />
                          <span>Parameters: {model.parameterCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {model.capabilities.map(capability => (
                          <Badge key={capability} variant="outline">{capability}</Badge>
                        ))}
                      </div>
                      
                      {modelInstallProgress[model.name] && (
                        <Progress value={modelInstallProgress[model.name]} className="h-2 mb-2" />
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleUninstallModel(model.name)}
                        disabled={isLoading || !isServerRunning}
                      >
                        Uninstall
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="available" className="h-full">
            {isLoading ? (
              <div className="text-center py-8">Loading available models...</div>
            ) : !isServerRunning ? (
              <div className="text-center py-8">Start the Ollama server to view available models.</div>
            ) : availableModels.length === 0 ? (
              <div className="text-center py-8">No models available.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableModels
                  .filter(model => !installedModels.some(m => m.name === model.name))
                  .map((model) => (
                    <Card key={model.name} className="w-full max-w-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{model.displayName}</CardTitle>
                          <Badge 
                            variant={
                              getModelCompatibility(model) === 'compatible' ? 'default' : 
                              getModelCompatibility(model) === 'limited' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {
                              getModelCompatibility(model) === 'compatible' ? 'Compatible' : 
                              getModelCompatibility(model) === 'limited' ? 'Limited' : 
                              'Incompatible'
                            }
                          </Badge>
                        </div>
                        <CardDescription>{model.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <Database className="h-4 w-4" />
                            <span>RAM: {Math.round(model.requirements.minRam / 1024)}GB</span>
                          </div>
                          {model.requirements.minVram && (
                            <div className="flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              <span>VRAM: {Math.round(model.requirements.minVram / 1024)}GB</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-4 w-4" />
                            <span>Size: {Math.round(model.size / 1024)}GB</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Cpu className="h-4 w-4" />
                            <span>Parameters: {model.parameterCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {model.capabilities.map(capability => (
                            <Badge key={capability} variant="outline">{capability}</Badge>
                          ))}
                        </div>
                        
                        {modelInstallProgress[model.name] && (
                          <Progress value={modelInstallProgress[model.name]} className="h-2 mb-2" />
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => handleInstallModel(model.name)}
                          disabled={isLoading || !isServerRunning || getModelCompatibility(model) === 'incompatible'}
                        >
                          Install
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="recommended" className="h-full">
            {isLoading ? (
              <div className="text-center py-8">Loading recommended models...</div>
            ) : !systemCapabilities ? (
              <div className="text-center py-8">System assessment required to show recommendations.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableModels
                  .filter(model => 
                    systemCapabilities.recommendedModels.includes(model.name) || 
                    getModelCompatibility(model) === 'compatible'
                  )
                  .map((model) => (
                    <Card key={model.name} className="w-full max-w-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{model.displayName}</CardTitle>
                          <Badge 
                            variant={
                              getModelCompatibility(model) === 'compatible' ? 'default' : 
                              getModelCompatibility(model) === 'limited' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {
                              getModelCompatibility(model) === 'compatible' ? 'Compatible' : 
                              getModelCompatibility(model) === 'limited' ? 'Limited' : 
                              'Incompatible'
                            }
                          </Badge>
                        </div>
                        <CardDescription>{model.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <Database className="h-4 w-4" />
                            <span>RAM: {Math.round(model.requirements.minRam / 1024)}GB</span>
                          </div>
                          {model.requirements.minVram && (
                            <div className="flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              <span>VRAM: {Math.round(model.requirements.minVram / 1024)}GB</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-4 w-4" />
                            <span>Size: {Math.round(model.size / 1024)}GB</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Cpu className="h-4 w-4" />
                            <span>Parameters: {model.parameterCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {model.capabilities.map(capability => (
                            <Badge key={capability} variant="outline">{capability}</Badge>
                          ))}
                        </div>
                        
                        {modelInstallProgress[model.name] && (
                          <Progress value={modelInstallProgress[model.name]} className="h-2 mb-2" />
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => handleInstallModel(model.name)}
                          disabled={isLoading || !isServerRunning || getModelCompatibility(model) === 'incompatible'}
                        >
                          Install
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default LocalLLMHub; 