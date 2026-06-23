import type { GameStats } from '../types';

interface StatsPanelProps {
  stats: GameStats;
  daysSurvived: number;
}

export default function StatsPanel({ stats, daysSurvived }: StatsPanelProps) {
  const getSettlementMoraleIcon = (morale: number): string => {
    if (morale >= 70) return '🌅';
    if (morale >= 50) return '🔥';
    if (morale >= 30) return '❄️';
    return '🌑';
  };

  return (
    <div className="stats-panel">
      <h3 className="panel-title">Settlement Impact</h3>

      <div className="stat-group">
        <div className="stat">
          <span className="stat-label">Days Survived</span>
          <span className="stat-value">{daysSurvived}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Heat Tactics</span>
          <span className="stat-value">{stats.heatTacticsCount}</span>
        </div>
      </div>

      <div className="stat-group">
        <div className="stat">
          <span className="stat-label">Relationships</span>
          <span className="stat-value">{stats.relationshipsFormed}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Allies Gained</span>
          <span className="stat-value">{stats.alliesGained}</span>
        </div>
      </div>

      <div className="stat-group">
        <div className="stat">
          <span className="stat-label">Water Preserved</span>
          <span className="stat-value">{stats.waterPreserved}L</span>
        </div>
      </div>

      <div className="morale-section">
        <div className="morale-header">
          <span className="stat-label">Settlement Morale</span>
          <span className="morale-icon">{getSettlementMoraleIcon(stats.settlementMorale)}</span>
        </div>
        <div className="morale-bar">
          <div className="morale-fill" style={{ width: `${Math.max(0, Math.min(100, stats.settlementMorale))}%` }} />
        </div>
        <span className="morale-value">{stats.settlementMorale}%</span>
      </div>
    </div>
  );
}
