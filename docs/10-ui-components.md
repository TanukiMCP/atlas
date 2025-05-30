# UI Components Specification

## 🎨 Main Layout Components

### Application Shell
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

interface LayoutState {
  sidebarCollapsed: boolean;
  previewPanelOpen: boolean;
  activeTool: string | null;
  fileTreeVisible: boolean;
  llmControlsVisible: boolean;
  qualityMonitorOpen: boolean;
}
```

### File Explorer Component
```typescript
interface FileExplorerProps {
  projectPath: string;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
  onFileCreate: (path: string, type: 'file' | 'directory') => void;
  onFileDelete: (path: string) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
}

interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  size?: number;
  modified: Date;
  children?: FileNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
  hasChanges?: boolean;
  gitStatus?: 'modified' | 'added' | 'deleted' | 'untracked';
}
```

### Chat Interface Component
```typescript
interface ChatInterfaceProps {
  conversationId: string;
  messages: ChatMessage[];
  isStreaming: boolean;
  currentTier?: ProcessingTier;
  progressData?: ProgressUpdate;
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  onToolSelect: (toolName: string, parameters: any) => void;
  onClearHistory: () => void;
  onEmergencyStop: () => void;
  onCorrectCourse: (correction: UserCorrection) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: {
    toolsUsed?: string[];
    executionTime?: number;
    tokenCount?: number;
    model?: string;
    todolist?: TodoList;
    fileChanges?: FileChange[];
    processingTier?: ProcessingTier;
    qualityScore?: number;
    interventions?: UserIntervention[];
  };
}
```

## 🛠️ Tool Selection Component

### @ Symbol Selector
```typescript
interface ToolSelectorProps {
  isOpen: boolean;
  position: { x: number; y: number };
  searchQuery: string;
  availableTools: ToolDefinition[];
  onToolSelect: (tool: ToolDefinition) => void;
  onClose: () => void;
  onSearchChange: (query: string) => void;
}

interface ToolSuggestion {
  name: string;
  description: string;
  category: 'file' | 'code' | 'web' | 'task' | 'project';
  icon: string;
  parameters: ParameterDefinition[];
  examples: string[];
  recentlyUsed: boolean;
  matchScore: number;
}
```

## 🧠 Enhanced LLM Control Components (NEW)

### Emergency Stop Button
```typescript
interface StopButtonProps {
  isExecuting: boolean;
  currentSession?: string;
  disabled?: boolean;
  onStop: (sessionId: string, reason?: string) => void;
  onGracefulPause: (sessionId: string) => void;
}

interface StopButtonState {
  isConfirming: boolean;
  stopType: 'immediate' | 'graceful' | 'phase_complete';
  confirmationTimeout: number;
}

// Always visible, never disabled, instant response
const StopButton: React.FC<StopButtonProps> = ({
  isExecuting,
  currentSession,
  onStop,
  onGracefulPause
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  return (
    <div className="emergency-stop-container">
      <button
        className="emergency-stop-btn"
        onClick={() => setShowConfirmation(true)}
        disabled={false} // Never disabled
        aria-label="Emergency Stop"
      >
        🛑 STOP
      </button>
      {showConfirmation && (
        <StopConfirmationModal
          onImmediateStop={() => onStop(currentSession!, 'user_request')}
          onGracefulPause={() => onGracefulPause(currentSession!)}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};
```

### Processing Tier Indicator
```typescript
interface TierIndicatorProps {
  currentTier: ProcessingTier;
  complexity: number; // 1-10
  estimatedDuration: number; // seconds
  actualDuration?: number;
  onTierSwitch?: (newTier: ProcessingTier) => void;
}

interface ProcessingTier {
  tier: 'ATOMIC' | 'MODERATE' | 'COMPLEX' | 'EXPERT';
  name: string;
  description: string;
  maxDuration: number;
  capabilities: string[];
  qualityLevel: number; // 1-10
}

const TierIndicator: React.FC<TierIndicatorProps> = ({
  currentTier,
  complexity,
  estimatedDuration,
  onTierSwitch
}) => {
  return (
    <div className="tier-indicator">
      <div className="tier-badge" data-tier={currentTier.tier}>
        <span className="tier-icon">{getTierIcon(currentTier.tier)}</span>
        <span className="tier-name">{currentTier.name}</span>
      </div>
      <div className="complexity-meter">
        <div 
          className="complexity-fill" 
          style={{ width: `${complexity * 10}%` }}
        />
        <span className="complexity-label">
          Complexity: {complexity}/10
        </span>
      </div>
      <div className="duration-estimate">
        Est: {formatDuration(estimatedDuration)}
      </div>
    </div>
  );
};
```

### Progress Tracker Component
```typescript
interface ProgressTrackerProps {
  sessionId: string;
  tasklist?: EnhancedTasklist;
  currentPhase?: string;
  currentTask?: string;
  overallProgress: number; // 0-1
  phaseProgress: number; // 0-1
  taskProgress: number; // 0-1
  qualityScore?: number; // 0-1
  onTaskClick?: (taskId: string) => void;
}

interface TaskProgressItem {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'skipped';
  progress: number; // 0-1
  duration?: number;
  quality?: number;
  issues?: string[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  tasklist,
  currentPhase,
  overallProgress,
  qualityScore
}) => {
  return (
    <div className="progress-tracker">
      <div className="overall-progress">
        <div className="progress-header">
          <h3>Overall Progress</h3>
          <span className="progress-percentage">
            {Math.round(overallProgress * 100)}%
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>
        {qualityScore && (
          <div className="quality-indicator">
            Quality: {Math.round(qualityScore * 100)}%
          </div>
        )}
      </div>
      
      {tasklist && (
        <div className="phase-progress">
          {tasklist.phases.map(phase => (
            <PhaseProgressItem
              key={phase.id}
              phase={phase}
              isActive={phase.id === currentPhase}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

### User Intervention Panel
```typescript
interface InterventionPanelProps {
  isOpen: boolean;
  sessionId: string;
  currentContext: ExecutionContext;
  onClose: () => void;
  onCorrection: (correction: UserCorrection) => void;
  onRedirection: (newDirection: TaskRedirection) => void;
  onEnhancement: (enhancement: TaskEnhancement) => void;
}

interface UserCorrection {
  type: 'factual' | 'approach' | 'scope' | 'priority' | 'quality' | 'resource';
  target: 'current_task' | 'future_tasks' | 'overall_approach';
  correction: string;
  reasoning?: string;
  urgency: 'low' | 'medium' | 'high';
}

interface ExecutionContext {
  currentTask?: Task;
  completedTasks: Task[];
  remainingTasks: Task[];
  currentPhase: string;
  issues?: string[];
  qualityScore?: number;
}

const InterventionPanel: React.FC<InterventionPanelProps> = ({
  isOpen,
  sessionId,
  currentContext,
  onCorrection,
  onRedirection
}) => {
  const [correctionType, setCorrectionType] = useState<UserCorrection['type']>('approach');
  const [correctionText, setCorrectionText] = useState('');
  
  return (
    <div className={`intervention-panel ${isOpen ? 'open' : 'closed'}`}>
      <div className="panel-header">
        <h3>Course Correction</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="context-display">
        <h4>Current Context</h4>
        <div className="current-task">
          Task: {currentContext.currentTask?.title || 'None'}
        </div>
        <div className="progress-summary">
          Completed: {currentContext.completedTasks.length}
          Remaining: {currentContext.remainingTasks.length}
        </div>
        {currentContext.qualityScore && (
          <div className="quality-display">
            Quality: {Math.round(currentContext.qualityScore * 100)}%
          </div>
        )}
      </div>
      
      <div className="correction-form">
        <div className="correction-type">
          <label>Correction Type:</label>
          <select 
            value={correctionType} 
            onChange={(e) => setCorrectionType(e.target.value as UserCorrection['type'])}
          >
            <option value="factual">Factual Correction</option>
            <option value="approach">Change Approach</option>
            <option value="scope">Adjust Scope</option>
            <option value="priority">Reorder Priorities</option>
            <option value="quality">Quality Standards</option>
            <option value="resource">Resource Constraints</option>
          </select>
        </div>
        
        <div className="correction-input">
          <label>Correction Details:</label>
          <textarea
            value={correctionText}
            onChange={(e) => setCorrectionText(e.target.value)}
            placeholder="Describe what needs to be corrected or changed..."
            rows={4}
          />
        </div>
        
        <div className="correction-actions">
          <button 
            onClick={() => {
              onCorrection({
                type: correctionType,
                target: 'current_task',
                correction: correctionText,
                urgency: 'medium'
              });
              setCorrectionText('');
            }}
            disabled={!correctionText.trim()}
          >
            Apply Correction
          </button>
        </div>
      </div>
    </div>
  );
};
```

## 📊 Quality Monitor Component (NEW)

### Quality Assurance Display
```typescript
interface QualityMonitorProps {
  sessionId: string;
  qualityMetrics: QualityMetrics;
  tournamentStatus?: TournamentStatus;
  onQualityThresholdChange: (threshold: number) => void;
  onRequestEnhancement: () => void;
}

interface QualityMetrics {
  overallScore: number; // 0-1
  completeness: number; // 0-1
  accuracy: number; // 0-1
  efficiency: number; // 0-1
  innovation: number; // 0-1
  userSatisfaction?: number; // 0-1
}

interface TournamentStatus {
  active: boolean;
  round: 'quarterfinals' | 'semifinals' | 'grand_final' | 'expert_review';
  participants: number;
  currentWinner?: string;
  consensusLevel: number; // 0-1
}

const QualityMonitor: React.FC<QualityMonitorProps> = ({
  qualityMetrics,
  tournamentStatus,
  onQualityThresholdChange
}) => {
  return (
    <div className="quality-monitor">
      <div className="quality-header">
        <h3>Quality Assurance</h3>
        <div className="overall-score">
          {Math.round(qualityMetrics.overallScore * 100)}%
        </div>
      </div>
      
      <div className="quality-breakdown">
        <QualityMeter label="Completeness" value={qualityMetrics.completeness} />
        <QualityMeter label="Accuracy" value={qualityMetrics.accuracy} />
        <QualityMeter label="Efficiency" value={qualityMetrics.efficiency} />
        <QualityMeter label="Innovation" value={qualityMetrics.innovation} />
      </div>
      
      {tournamentStatus?.active && (
        <div className="tournament-status">
          <h4>AI Council Tournament</h4>
          <div className="tournament-round">
            Round: {tournamentStatus.round}
          </div>
          <div className="consensus-level">
            Consensus: {Math.round(tournamentStatus.consensusLevel * 100)}%
          </div>
          <div className="participants-count">
            Participants: {tournamentStatus.participants}
          </div>
        </div>
      )}
      
      <div className="quality-controls">
        <button 
          onClick={onRequestEnhancement}
          className="enhance-btn"
        >
          Request Enhancement
        </button>
      </div>
    </div>
  );
};
```

## 🎛️ Advanced Control Components

### Hybrid Mode Controller
```typescript
interface HybridModeControllerProps {
  currentMode: HybridMode;
  availableModes: HybridMode[];
  onModeChange: (mode: HybridMode) => void;
  complexityThreshold: number;
  onThresholdChange: (threshold: number) => void;
}

interface HybridMode {
  id: string;
  name: string;
  description: string;
  autoRouting: boolean;
  qualityPriority: number; // 0-1, 0=speed, 1=quality
  resourceLimit: number; // 0-1
}

const HybridModeController: React.FC<HybridModeControllerProps> = ({
  currentMode,
  availableModes,
  onModeChange,
  complexityThreshold,
  onThresholdChange
}) => {
  return (
    <div className="hybrid-mode-controller">
      <div className="mode-selector">
        <label>Processing Mode:</label>
        <select 
          value={currentMode.id}
          onChange={(e) => {
            const mode = availableModes.find(m => m.id === e.target.value);
            if (mode) onModeChange(mode);
          }}
        >
          {availableModes.map(mode => (
            <option key={mode.id} value={mode.id}>
              {mode.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="complexity-threshold">
        <label>Complexity Threshold:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={complexityThreshold}
          onChange={(e) => onThresholdChange(Number(e.target.value))}
        />
        <span>{complexityThreshold}/10</span>
      </div>
      
      <div className="quality-priority">
        <label>Quality vs Speed:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={currentMode.qualityPriority}
          disabled
        />
        <span>{currentMode.qualityPriority === 1 ? 'Max Quality' : 
               currentMode.qualityPriority === 0 ? 'Max Speed' : 'Balanced'}</span>
      </div>
    </div>
  );
};
```

These enhanced UI components provide complete user control over the sophisticated LLM processing system, ensuring users can monitor, intervene, and optimize the AI's performance in real-time while maintaining full context and progress preservation.