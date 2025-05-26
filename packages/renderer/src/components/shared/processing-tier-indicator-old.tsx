import React from 'react';

export type ProcessingTier = 'ATOMIC' | 'MODERATE' | 'COMPLEX' | 'EXPERT';

interface ProcessingTierIndicatorProps {
  currentTier: ProcessingTier;
  complexity: number; // 1-10
  estimatedDuration: number; // seconds
  actualDuration?: number;
  isActive: boolean;
  onTierSwitch?: (tier: ProcessingTier) => void;
}

export const ProcessingTierIndicator: React.FC<ProcessingTierIndicatorProps> = ({
  currentTier,
  complexity,
  estimatedDuration,
  actualDuration,
  isActive,
  onTierSwitch
}) => {
  const getTierInfo = (tier: ProcessingTier) => {
    switch (tier) {
      case 'ATOMIC':
        return {
          name: 'Atomic',
          icon: '⚡',
          color: '#4CAF50',
          description: 'Lightning-fast simple tasks',
          maxComplexity: 3,
          maxDuration: 5
        };
      case 'MODERATE':
        return {
          name: 'Moderate',
          icon: '🔧',
          color: '#FF9800',
          description: 'Balanced multi-step execution',
          maxComplexity: 6,
          maxDuration: 30
        };
      case 'COMPLEX':
        return {
          name: 'Complex',
          icon: '🧠',
          color: '#2196F3',
          description: 'Sophisticated processing pipeline',
          maxComplexity: 8,
          maxDuration: 180
        };
      case 'EXPERT':
        return {
          name: 'Expert',
          icon: '🎓',
          color: '#9C27B0',
          description: 'Full expert-level analysis',
          maxComplexity: 10,
          maxDuration: 600
        };
    }
  };

  const tierInfo = getTierInfo(currentTier);
  const allTiers: ProcessingTier[] = ['ATOMIC', 'MODERATE', 'COMPLEX', 'EXPERT'];

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 3) return '#4CAF50';
    if (complexity <= 6) return '#FF9800';
    if (complexity <= 8) return '#2196F3';
    return '#9C27B0';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '90px',
      right: '20px',
      width: '280px',
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
            Processing Tier
          </div>
          {isActive && (
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: tierInfo.color,
              animation: 'pulse 2s infinite'
            }} />
          )}
        </div>

        {/* Current Tier Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: tierInfo.color,
          color: 'white',
          borderRadius: 'var(--radius-md)',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '16px' }}>{tierInfo.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {tierInfo.name} Tier
            </div>
            <div style={{
              fontSize: '11px',
              opacity: 0.9
            }}>
              {tierInfo.description}
            </div>
          </div>
        </div>

        {/* Complexity Meter */}
        <div style={{ marginBottom: '8px' }}>
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
              Complexity
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: getComplexityColor(complexity)
            }}>
              {complexity}/10
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
              width: `${complexity * 10}%`,
              height: '100%',
              backgroundColor: getComplexityColor(complexity),
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Duration Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--color-text-secondary)'
        }}>
          <span>Est: {formatDuration(estimatedDuration)}</span>
          {actualDuration && (
            <span>Actual: {formatDuration(actualDuration)}</span>
          )}
        </div>
      </div>

      {/* Tier Selection */}
      {onTierSwitch && (
        <div style={{ padding: '12px' }}>
          <div style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            marginBottom: '8px'
          }}>
            Switch Tier:
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px'
          }}>
            {allTiers.map(tier => {
              const info = getTierInfo(tier);
              const isSelected = tier === currentTier;
              
              return (
                <button
                  key={tier}
                  onClick={() => onTierSwitch(tier)}
                  style={{
                    padding: '8px',
                    border: isSelected ? `2px solid ${info.color}` : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? `${info.color}20` : 'var(--color-bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontSize: '11px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.backgroundColor = 'var(--color-bg-tertiary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginBottom: '2px'
                  }}>
                    <span>{info.icon}</span>
                    <span style={{
                      fontWeight: isSelected ? '600' : '500',
                      color: isSelected ? info.color : 'var(--color-text-primary)'
                    }}>
                      {info.name}
                    </span>
                  </div>
                  <div style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '10px'
                  }}>
                    ≤{info.maxComplexity} complexity
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};