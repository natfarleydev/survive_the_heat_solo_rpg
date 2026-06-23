import type { GameState } from '../types';
import { downloadMarkdownExport } from '../gameEngine';

interface CompletionScreenProps {
  gameState: GameState;
  onReset: () => void;
}

export default function CompletionScreen({ gameState, onReset }: CompletionScreenProps) {
  const handleExport = () => {
    downloadMarkdownExport(gameState);
  };

  const moraleLevel = (morale: number) => {
    if (morale >= 80) return 'Triumphant';
    if (morale >= 60) return 'Hopeful';
    if (morale >= 40) return 'Resilient';
    return 'Struggling but Alive';
  };

  return (
    <div className="container">
      <div className="completion-screen">
        <div className="completion-header">
          <h1 className="completion-title">Welcome to New Hope</h1>
          <p className="completion-subtitle">You made it. Against all odds, you survived.</p>
        </div>

        <div className="completion-stats">
          <h2>Your Journey Summary</h2>

          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-icon">📅</span>
              <span className="stat-title">Days Survived</span>
              <span className="stat-number">12</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💧</span>
              <span className="stat-title">Water Preserved</span>
              <span className="stat-number">{gameState.stats.waterPreserved}L</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🔥</span>
              <span className="stat-title">Heat Tactics</span>
              <span className="stat-number">{gameState.stats.heatTacticsCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🤝</span>
              <span className="stat-title">Relationships</span>
              <span className="stat-number">{gameState.stats.relationshipsFormed}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🌅</span>
              <span className="stat-title">Settlement Morale</span>
              <span className="stat-number">{gameState.stats.settlementMorale}%</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⚔️</span>
              <span className="stat-title">Morale Level</span>
              <span className="stat-number">{moraleLevel(gameState.stats.settlementMorale)}</span>
            </div>
          </div>
        </div>

        <div className="completion-narrative">
          <h2>Your Legacy</h2>
          <p>
            {gameState.characterName} arrived at New Hope on a dust-laden evening, dehydrated but unbroken.
            The settlement has already begun implementing the survival tactics you discovered over those
            grueling twelve days.
          </p>
          <p>
            The techniques you tested in the field are now being taught to new arrivals. The water
            preservation methods you refined have extended the settlement's reserves. Your resilience has
            become legend—proof that humans can survive the unbearable.
          </p>
          <p>
            You are no longer alone. You have a home. And you have a purpose: to help others survive what
            you survived.
          </p>
          {gameState.stats.settlementMorale >= 70 && (
            <p className="high-morale">
              <strong>
                The settlement celebrates your arrival. You didn't just survive—you inspired them to
                believe survival was possible.
              </strong>
            </p>
          )}
          {gameState.stats.settlementMorale >= 50 && gameState.stats.settlementMorale < 70 && (
            <p className="medium-morale">
              <strong>The settlement welcomes you. Your story will help them endure what comes next.</strong>
            </p>
          )}
          {gameState.stats.settlementMorale < 50 && (
            <p className="low-morale">
              <strong>
                Even in darkness, you survived. That alone is worth something. The settlement needs your
                strength now.
              </strong>
            </p>
          )}
        </div>

        <div className="completion-actions">
          <button className="btn btn-primary" onClick={handleExport}>
            📥 Export Your Story
          </button>
          <button className="btn btn-secondary" onClick={onReset}>
            ⟲ Start a New Journey
          </button>
        </div>

        <div className="completion-footer">
          <p>
            <strong>Thank you for playing.</strong>
          </p>
          <p>
            This game was created to explore how we find meaning in survival and how stories connect us
            across distance. Your story mattered.
          </p>
          <p className="credit">
            Survive the Heat is a solo RPG by{' '}
            <a href="https://github.com/nasfarley88/survive_the_heat_solo_rpg">Nas Farley</a>. Released
            under CC-0.
          </p>
        </div>
      </div>
    </div>
  );
}
