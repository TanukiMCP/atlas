import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography, Paper, CircularProgress } from '@mui/material';

interface TaskComplexityVisualizerProps {
  taskDescription: string;
  onComplexityDetermined?: (complexity: number) => void;
}

interface TaskAnalysis {
  complexity: number;
  estimatedTime: number;
  steps: string[];
  confidence: number;
}

const ANALYSIS_STEPS = [
  'Analyzing task description...',
  'Identifying key components...',
  'Estimating complexity...',
  'Calculating time requirements...',
  'Generating execution plan...'
];

export const TaskComplexityVisualizer: React.FC<TaskComplexityVisualizerProps> = ({
  taskDescription,
  onComplexityDetermined
}) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<TaskAnalysis | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const analyzeTask = async () => {
      setAnalyzing(true);
      setProgress(0);
      setAnalysis(null);
      setCurrentStep(0);

      // Simulate API call to analyze task complexity
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        setCurrentStep(i);
        // Simulate step processing time (1-2 seconds per step)
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        setProgress((i + 1) * (100 / ANALYSIS_STEPS.length));
      }

      // Simulate task analysis result
      const mockAnalysis: TaskAnalysis = {
        complexity: Math.random() * 0.7 + 0.3, // 0.3 to 1.0
        estimatedTime: Math.floor(Math.random() * 300) + 60, // 60 to 360 seconds
        steps: [
          'Initialize environment',
          'Process input data',
          'Apply transformations',
          'Generate output',
          'Validate results'
        ],
        confidence: Math.random() * 0.3 + 0.7 // 0.7 to 1.0
      };

      setAnalysis(mockAnalysis);
      setAnalyzing(false);
      if (onComplexityDetermined) {
        onComplexityDetermined(mockAnalysis.complexity);
      }
    };

    analyzeTask();
  }, [taskDescription, onComplexityDetermined]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getComplexityLabel = (complexity: number): string => {
    if (complexity < 0.4) return 'Simple';
    if (complexity < 0.7) return 'Moderate';
    return 'Complex';
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      {analyzing ? (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography variant="body1">
              {ANALYSIS_STEPS[currentStep]}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4
              }
            }} 
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {Math.round(progress)}% complete
          </Typography>
        </Box>
      ) : analysis ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Task Analysis Complete
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Complexity: {getComplexityLabel(analysis.complexity)}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={analysis.complexity * 100}
              sx={{ 
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: analysis.complexity < 0.4 ? 'success.main' :
                                 analysis.complexity < 0.7 ? 'warning.main' :
                                 'error.main'
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Estimated Time: {formatTime(analysis.estimatedTime)}
            </Typography>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <CircularProgress 
                variant="determinate" 
                value={100}
                size={24}
                sx={{
                  color: 'divider'
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Confidence: {Math.round(analysis.confidence * 100)}%
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Execution Steps:
            </Typography>
            {analysis.steps.map((step, index) => (
              <Typography 
                key={index} 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 0.5
                }}
              >
                {index + 1}. {step}
              </Typography>
            ))}
          </Box>
        </Box>
      ) : null}
    </Paper>
  );
}; 