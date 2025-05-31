import React, { useState, useEffect } from 'react';
import { Card, Box, Button, Typography, CircularProgress, Chip, Tooltip } from '@mui/material';
import { scanHardwareSpecs, type HardwareSpecs } from '../utils/hardwareSpecs';

interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: number;
    completion: number;
    image?: number;
  };
  architecture: {
    input_modalities: string[];
    output_modalities: string[];
  };
  provider: string;
  capabilities: string[];
  limitations: string[];
}

const OPENROUTER_MODELS: OpenRouterModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Latest GPT-4 model with improved performance and 128k context',
    context_length: 128000,
    pricing: {
      prompt: 0.01,
      completion: 0.03
    },
    architecture: {
      input_modalities: ['text'],
      output_modalities: ['text']
    },
    provider: 'OpenAI',
    capabilities: ['Advanced reasoning', 'Code generation', 'Creative writing'],
    limitations: ['High latency', 'Expensive']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Most capable Claude model with superior reasoning',
    context_length: 200000,
    pricing: {
      prompt: 0.015,
      completion: 0.075
    },
    architecture: {
      input_modalities: ['text', 'image'],
      output_modalities: ['text']
    },
    provider: 'Anthropic',
    capabilities: ['Multimodal', 'Advanced reasoning', 'Long context'],
    limitations: ['Very expensive', 'High latency']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s latest model with strong performance',
    context_length: 32000,
    pricing: {
      prompt: 0.001,
      completion: 0.002
    },
    architecture: {
      input_modalities: ['text'],
      output_modalities: ['text']
    },
    provider: 'Google',
    capabilities: ['Fast inference', 'Good reasoning', 'Cost effective'],
    limitations: ['Limited context', 'Text-only']
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced Claude model for most use cases',
    context_length: 200000,
    pricing: {
      prompt: 0.003,
      completion: 0.015
    },
    architecture: {
      input_modalities: ['text', 'image'],
      output_modalities: ['text']
    },
    provider: 'Anthropic',
    capabilities: ['Multimodal', 'Good reasoning', 'Long context'],
    limitations: ['Higher latency']
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    description: 'Powerful open model with 32k context',
    context_length: 32000,
    pricing: {
      prompt: 0.002,
      completion: 0.006
    },
    architecture: {
      input_modalities: ['text'],
      output_modalities: ['text']
    },
    provider: 'Mistral AI',
    capabilities: ['Code generation', 'Technical tasks', 'Cost effective'],
    limitations: ['Text-only']
  }
];

export const OpenRouterStore: React.FC = () => {
  const [models, setModels] = useState<OpenRouterModel[]>(OPENROUTER_MODELS);
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<HardwareSpecs | null>(null);

  useEffect(() => {
    const loadSpecs = async () => {
      const hardwareSpecs = await scanHardwareSpecs();
      setSpecs(hardwareSpecs);
    };
    loadSpecs();
  }, []);

  const renderModelCard = (model: OpenRouterModel) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {model.name}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {model.description}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Capabilities:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {model.capabilities.map((capability) => (
            <Chip
              key={capability}
              label={capability}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Limitations:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {model.limitations.map((limitation) => (
            <Chip
              key={limitation}
              label={limitation}
              size="small"
              color="error"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Typography variant="body2" gutterBottom>
          Context Length: {model.context_length.toLocaleString()} tokens
        </Typography>
        <Typography variant="body2" gutterBottom>
          Provider: {model.provider}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Pricing (per 1K tokens):
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Input: ${(model.pricing.prompt * 1000).toFixed(3)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Output: ${(model.pricing.completion * 1000).toFixed(3)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => {
          // Handle model selection
          console.log(`Selected model: ${model.id}`);
        }}
      >
        Select Model
      </Button>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        OpenRouter Models
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3
      }}>
        {models.map((model) => (
          <Box key={model.id}>
            {renderModelCard(model)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}; 