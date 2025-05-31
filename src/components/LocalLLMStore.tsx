import React, { useState, useEffect } from 'react';
import { Card, Grid as MuiGrid, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, LinearProgress, CircularProgress } from '@mui/material';
import { scanHardwareSpecs, checkModelCompatibility, calculateMaxContextLength, type HardwareSpecs } from '../utils/hardwareSpecs';
import { ollamaClient } from '../services/ollamaClient';

interface LLMModel {
  id: string;
  name: string;
  size: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  provider: string;
  tags: string[];
  contextLength: number;
}

const LOCAL_MODELS: LLMModel[] = [
  {
    id: 'llama3-8b',
    name: 'Llama 3 (8B)',
    size: '8B',
    description: 'Latest Llama 3 model optimized for general use',
    strengths: ['Fast inference', 'Good general knowledge', 'Efficient resource usage'],
    weaknesses: ['Limited context vs larger models', 'May struggle with complex tasks'],
    provider: 'Meta',
    tags: ['General Purpose', 'Efficient'],
    contextLength: 8192
  },
  {
    id: 'llama3-70b',
    name: 'Llama 3 (70B)',
    size: '70B',
    description: 'Most capable openly available LLM to date',
    strengths: ['Superior reasoning', 'Strong coding abilities', 'Large knowledge base'],
    weaknesses: ['High resource requirements', 'Slower inference'],
    provider: 'Meta',
    tags: ['High Performance', 'Large Scale'],
    contextLength: 8192
  },
  {
    id: 'mistral-7b',
    name: 'Mistral (7B)',
    size: '7B',
    description: 'High-performance model with strong coding capabilities',
    strengths: ['Excellent code generation', 'Strong reasoning', 'Resource efficient'],
    weaknesses: ['Limited creative writing', 'Smaller knowledge base'],
    provider: 'Mistral AI',
    tags: ['Coding', 'Technical'],
    contextLength: 8192
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral (8x7B)',
    size: '8x7B',
    description: 'Mixture of Experts model with open weights by Mistral AI',
    strengths: ['Efficient computation', 'Strong performance', 'Versatile capabilities'],
    weaknesses: ['Complex deployment', 'Higher memory usage'],
    provider: 'Mistral AI',
    tags: ['MoE', 'High Performance'],
    contextLength: 32768
  },
  {
    id: 'qwen3-4b',
    name: 'Qwen 3 (4B)',
    size: '4B',
    description: 'Latest generation of Qwen series with dense and MoE variants',
    strengths: ['Balanced performance', 'Good multilingual support', 'Efficient'],
    weaknesses: ['Limited context window', 'Lower performance on specialized tasks'],
    provider: 'Alibaba',
    tags: ['Multilingual', 'Balanced'],
    contextLength: 8192
  },
  {
    id: 'qwen3-32b',
    name: 'Qwen 3 (32B)',
    size: '32B',
    description: 'Large-scale variant of Qwen 3 with superior capabilities',
    strengths: ['Strong reasoning', 'Excellent code generation', 'Rich knowledge'],
    weaknesses: ['High resource requirements', 'Slower inference'],
    provider: 'Alibaba',
    tags: ['High Performance', 'Large Scale'],
    contextLength: 32768
  },
  {
    id: 'phi4-mini',
    name: 'Phi-4 Mini (3.8B)',
    size: '3B',
    description: 'Lightweight model with enhanced multilingual and reasoning capabilities',
    strengths: ['Function calling support', 'Strong reasoning', 'Resource efficient'],
    weaknesses: ['Limited context window', 'Lower performance vs larger models'],
    provider: 'Microsoft',
    tags: ['Efficient', 'Function Calling'],
    contextLength: 4096
  },
  {
    id: 'codellama-7b',
    name: 'Code Llama (7B)',
    size: '7B',
    description: 'Specialized model for code generation and understanding',
    strengths: ['Superior code completion', 'Technical documentation', 'Efficient'],
    weaknesses: ['Limited general knowledge', 'Focused on coding tasks'],
    provider: 'Meta',
    tags: ['Coding', 'Technical'],
    contextLength: 16384
  },
  {
    id: 'stablelm2-1.6b',
    name: 'StableLM 2 (1.6B)',
    size: '1B',
    description: 'Multilingual model supporting 7 European languages',
    strengths: ['Lightweight', 'Good multilingual support', 'Fast inference'],
    weaknesses: ['Very limited context', 'Basic capabilities'],
    provider: 'Stability AI',
    tags: ['Multilingual', 'Efficient'],
    contextLength: 4096
  },
  {
    id: 'vicuna-7b',
    name: 'Vicuna (7B)',
    size: '7B',
    description: 'General use chat model with good performance',
    strengths: ['Well-rounded capabilities', 'Good chat performance', 'Efficient'],
    weaknesses: ['Jack of all trades', 'Master of none'],
    provider: 'lmsys',
    tags: ['Chat', 'General Purpose'],
    contextLength: 4096
  }
];

export const LocalLLMStore: React.FC = () => {
  const [specs, setSpecs] = useState<HardwareSpecs | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [installingModels, setInstallingModels] = useState<Record<string, number>>({});
  const [installedModels, setInstalledModels] = useState<string[]>([]);

  useEffect(() => {
    const loadSpecs = async () => {
      const systemSpecs = await scanHardwareSpecs();
      setSpecs(systemSpecs);
    };
    
    const loadInstalledModels = async () => {
      try {
        const { models } = await ollamaClient.listModels();
        setInstalledModels(models.map(m => m.name));
      } catch (error) {
        console.error('Failed to load installed models:', error);
      }
    };

    loadSpecs();
    loadInstalledModels();
  }, []);

  const handleInstall = (model: LLMModel) => {
    setSelectedModel(model);
    if (!dontShowAgain) {
      setShowDialog(true);
    } else {
      installModel(model);
    }
  };

  const installModel = async (model: LLMModel) => {
    try {
      setInstallingModels(prev => ({ ...prev, [model.id]: 0 }));
      
      await ollamaClient.pullModel(model.id, (progress) => {
        setInstallingModels(prev => ({ ...prev, [model.id]: progress }));
      });

      setInstalledModels(prev => [...prev, model.id]);
      
      // Save don't show again preference if checked
      if (dontShowAgain) {
        localStorage.setItem('llm-install-dialog-disabled', 'true');
      }
    } catch (error) {
      console.error('Failed to install model:', error);
    } finally {
      setInstallingModels(prev => {
        const newState = { ...prev };
        delete newState[model.id];
        return newState;
      });
    }
  };

  const handleUninstall = async (model: LLMModel) => {
    try {
      await ollamaClient.deleteModel(model.id);
      setInstalledModels(prev => prev.filter(id => id !== model.id));
    } catch (error) {
      console.error('Failed to uninstall model:', error);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setSelectedModel(null);
  };

  const handleDialogConfirm = () => {
    if (selectedModel) {
      installModel(selectedModel);
    }
    handleDialogClose();
  };

  const renderModelCard = (model: LLMModel) => {
    const compatibility = specs ? checkModelCompatibility(specs, model.size) : { compatible: false, warnings: [] };
    const maxContext = specs ? calculateMaxContextLength(specs, model.size) : model.contextLength;
    const isInstalled = installedModels.includes(model.id);
    const installProgress = installingModels[model.id];
    const isInstalling = installProgress !== undefined;

    return (
      <Card 
        key={model.id}
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <Typography variant="h6" gutterBottom>
          {model.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {model.description}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Strengths:
        </Typography>
        <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }}>
          {model.strengths.map((strength, i) => (
            <li key={i}>
              <Typography variant="body2">{strength}</Typography>
            </li>
          ))}
        </ul>

        <Typography variant="subtitle2" gutterBottom>
          System Requirements:
        </Typography>
        <Typography variant="body2" color={compatibility.compatible ? 'success.main' : 'error.main'}>
          {compatibility.compatible ? 'Compatible with your system' : compatibility.reason}
        </Typography>
        
        {compatibility.warnings.map((warning, i) => (
          <Typography key={i} variant="body2" color="warning.main">
            Warning: {warning}
          </Typography>
        ))}

        <Typography variant="body2" sx={{ mt: 1 }}>
          Max Context Length: {maxContext.toLocaleString()} tokens
        </Typography>

        <div style={{ flexGrow: 1 }} />

        {isInstalling && (
          <div style={{ marginTop: 16 }}>
            <LinearProgress 
              variant="determinate" 
              value={installProgress} 
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" align="center">
              Installing... {Math.round(installProgress)}%
            </Typography>
          </div>
        )}

        <Button 
          variant={isInstalled ? "outlined" : "contained"}
          fullWidth 
          onClick={() => isInstalled ? handleUninstall(model) : handleInstall(model)}
          disabled={!compatibility.compatible || isInstalling}
          sx={{ mt: 2 }}
          startIcon={isInstalling ? <CircularProgress size={20} /> : undefined}
        >
          {isInstalled ? 'Uninstall' : 'Install Model'}
        </Button>
      </Card>
    );
  };

  return (
    <>
      <MuiGrid container spacing={3} sx={{ p: 3 }}>
        {LOCAL_MODELS.map((model) => (
          <MuiGrid item key={model.id} xs={12} sm={6} md={4}>
            {renderModelCard(model)}
          </MuiGrid>
        ))}
      </MuiGrid>

      <Dialog open={showDialog} onClose={handleDialogClose}>
        <DialogTitle>
          Install {selectedModel?.name}
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            To use this model:
          </Typography>
          <ol>
            <li>
              <Typography>
                The model will be downloaded and optimized for your hardware.
              </Typography>
            </li>
            <li>
              <Typography>
                Once installed, you can select it from the model dropdown in the chat interface.
              </Typography>
            </li>
            <li>
              <Typography>
                The model will run entirely on your machine, ensuring privacy and offline capability.
              </Typography>
            </li>
          </ol>
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
            }
            label="Don't show this message again"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogConfirm} variant="contained">
            Install
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 