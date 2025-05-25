import React from 'react';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number; // 0-1
}

interface ProgressTrackerProps {
  isVisible: boolean;
  currentTier: 'ATOMIC' | 'MODERATE' | 'COMPLEX' | 'EXPERT';
  overallProgress: number; // 0-1
  tasks: Task[];
  qualityScore?: number; // 0-1
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  isVisible,
  currentTier,
  overallProgress,
  tasks,
  qualityScore
}) => {
  if (!isVisible) return null;

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'ATOMIC': return '⚡';
      case 'MODERATE': return '🔧';
      case 'COMPLEX': return '🧠';
      case 'EXPERT': return '🎓';
      default: return '⚙️';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'ATOMIC': return '#4CAF50';
      case 'MODERATE': return '#FF9800';
      case 'COMPLEX': return '#2196F3';
      case 'EXPERT': return '#9C27B0';
      default: return 'var(--color-accent)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'active': return '▶️';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '⚪';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      width: '300px',
      backgroundColor: 'var(--color-bg-primary)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 100,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--color-bg-secondary)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--color-text-primary)'
          }}>
            Processing Status
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            backgroundColor: getTierColor(currentTier),
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            <span>{getTierIcon(currentTier)}</span>
            <span>{currentTier}</span>
          </div>
        </div>

        {/* Overall Progress */}
        <div style={{
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)'
            }}>
              Overall Progress
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
            }}>
              {Math.round(overallProgress * 100)}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'var(--color-bg-quaternary)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${overallProgress * 100}%`,
              height: '100%',
              backgroundColor: 'var(--color-accent)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Quality Score */}
        {qualityScore !== undefined && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px'
          }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>
              Quality Score
            </span>
            <span style={{
              fontWeight: '500',
              color: qualityScore > 0.8 ? 'var(--color-success)' : 
                     qualityScore > 0.6 ? 'var(--color-warning)' : 'var(--color-error)'
            }}>
              {Math.round(qualityScore * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Task List */}
      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        padding: '8px'
      }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: task.status === 'active' ? 'var(--color-bg-tertiary)' : 'transparent',
              marginBottom: '4px'
            }}
          >
            <span style={{ fontSize: '14px' }}>
              {getStatusIcon(task.status)}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: task.status === 'active' ? '500' : '400',
                color: 'var(--color-text-primary)',
                marginBottom: '2px'
              }}>
                {task.title}
              </div>
              {task.status === 'active' && (
                <div style={{
                  width: '100%',
                  height: '3px',
                  backgroundColor: 'var(--color-bg-quaternary)',
                  borderRadius: '1.5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${task.progress * 100}%`,
                    height: '100%',
                    backgroundColor: 'var(--color-accent)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};