import type { GameState, Letter } from '../types';
import { submitResponse, downloadMarkdownExport, skipTime } from '../gameEngine';
import LetterDisplay from './LetterDisplay';
import ResponseForm from './ResponseForm';
import StatsPanel from './StatsPanel';
import HistoryPanel from './HistoryPanel';
import { useState } from 'react';

interface GameScreenProps {
  gameState: GameState;
  currentLetter: Letter | null;
  letterReady: boolean;
  formattedTime: string;
  onGameStateChange: (state: GameState) => void;
  onReset: () => void;
}

export default function GameScreen({
  gameState,
  currentLetter,
  letterReady,
  formattedTime,
  onGameStateChange,
  onReset,
}: GameScreenProps) {
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmitResponse = (responseText: string) => {
    const newState = submitResponse(gameState, responseText);
    onGameStateChange(newState);
  };

  const handleSkipTime = () => {
    const newState = skipTime(gameState);
    onGameStateChange(newState);
  };

  const handleExport = () => {
    downloadMarkdownExport(gameState);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure? This will erase your progress and start a new game.')) {
      onReset();
    }
  };

  if (!currentLetter) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Journey Complete</h2>
          <p>Check the completion screen for your final stats.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="header-content">
          <h1 className="game-title">Survive the Heat</h1>
          <div className="character-info">
            <span className="character-name">{gameState.characterName}</span>
            <span className="day-counter">
              Day {gameState.currentDay} of 12
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-icon" onClick={() => setShowHistory(!showHistory)} title="View history" aria-label="View your journey history">
            <span className="icon-label">📖 History</span>
          </button>
          <button className="btn-icon" onClick={handleExport} title="Export as markdown" aria-label="Download your story">
            <span className="icon-label">📥 Export</span>
          </button>
          {!letterReady && (
            <button className="btn-icon" onClick={handleSkipTime} title="Skip to next letter (for testing)" aria-label="Skip time to next letter">
              <span className="icon-label">⏩ Skip</span>
            </button>
          )}
          <button className="btn-icon" onClick={handleReset} title="Reset game and start over" aria-label="Start a new game">
            <span className="icon-label">↻ Reset</span>
          </button>
        </div>
      </header>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(gameState.currentDay / 12) * 100}%` }}></div>
      </div>

      <main className="game-main">
        <div className="game-content">
          <section className="letter-section">
            {letterReady ? (
              <LetterDisplay letter={currentLetter} />
            ) : (
              <div className="waiting-state">
                <h2>Next letter in {formattedTime}</h2>
                <p className="waiting-message">
                  New Hope is preparing their response. <strong>It's safe to close this tab and come back later</strong>—your progress is saved automatically.
                </p>
                <p className="waiting-hint">
                  💡 <em>Pro tip: Click the ⏩ button above to skip ahead for testing.</em>
                </p>
              </div>
            )}
          </section>

          <section className="response-section">
            {letterReady ? (
              <ResponseForm
                dayNumber={gameState.currentDay}
                onSubmit={handleSubmitResponse}
                lastResponse={gameState.responses[gameState.responses.length - 1]}
              />
            ) : (
              <div className="response-locked">
                <p>You'll be able to respond once the next letter arrives.</p>
              </div>
            )}
          </section>
        </div>

        <aside className="game-sidebar">
          <StatsPanel stats={gameState.stats} daysSurvived={gameState.responses.length} />
        </aside>
      </main>

      {showHistory && (
        <aside className="history-panel">
          <HistoryPanel responses={gameState.responses} onClose={() => setShowHistory(false)} />
        </aside>
      )}
    </div>
  );
}
