import { useState, useEffect } from 'react';

interface StartScreenProps {
  onStartGame: (characterName: string) => void;
}

type StartPhase = 'splash' | 'input';

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const [characterName, setCharacterName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [phase, setPhase] = useState<StartPhase>('splash');

  // Splash screen lifecycle
  useEffect(() => {
    if (phase === 'splash') {
      // Total splash duration: ~18 seconds (animations) + fade out
      // Each line gets time to be read and absorbed
      const timer = setTimeout(() => {
        setPhase('input');
      }, 18000);

      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Show context text after input form loads
  useEffect(() => {
    if (phase === 'input') {
      const timer = setTimeout(() => setShowFullText(true), 600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (characterName.trim()) {
      onStartGame(characterName.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="container start-container">
      {/* SPLASH SCREEN */}
      {phase === 'splash' && (
        <div className="splash-screen">
          <div className="start-background">
            <div className="heat-shimmer heat-shimmer-1"></div>
            <div className="heat-shimmer heat-shimmer-2"></div>
            <div className="heat-shimmer heat-shimmer-3"></div>
          </div>

          <div className="splash-content">
            <p className="splash-line splash-line-1">
              The world burns. Temperatures soar past anything the old records predicted.
            </p>
            <p className="splash-line splash-line-2">
              But you're still alive.
            </p>

            <div className="splash-break"></div>

            <p className="splash-line splash-line-3">
              A settlement called New Hope found your signal.
            </p>
            <p className="splash-line splash-line-4">
              They want to hear your story—how you survive each day in conditions most don't make it through.
            </p>
            <p className="splash-line splash-line-5">
              Your reports might save lives.
            </p>
          </div>
        </div>
      )}

      {/* INPUT SCREEN */}
      {phase === 'input' && (
        <div className="start-screen">
          <div className="start-background">
            <div className="heat-shimmer heat-shimmer-1"></div>
            <div className="heat-shimmer heat-shimmer-2"></div>
            <div className="heat-shimmer heat-shimmer-3"></div>
          </div>

          <div className="start-content animate-up">
            <h1 className="start-title animate-glow">Survive the Heat</h1>
            <p className="start-hook">
              You're alive. New Hope found your signal.
              <br />
              <em>They want to hear your story.</em>
            </p>

            {/* Character name input - VERY PROMINENT */}
            <form onSubmit={handleSubmit} className="character-form-minimal">
              <input
                id="character-name"
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Your name..."
                className="input-hero animate-in"
                autoFocus
                disabled={submitted}
                maxLength={30}
              />
              <button
                type="submit"
                className="btn btn-hero"
                disabled={!characterName.trim() || submitted}
              >
                {submitted ? '→ Beginning...' : '→ Begin'}
              </button>
            </form>

            {/* Additional context - revealed after input is visible */}
            {showFullText && (
              <div className="start-context animate-in">
                <p className="context-text">
                  Over 12 days, you'll receive letters and share how you survived. Each response
                  shapes what comes next.
                </p>
                <div className="context-meta">
                  <span>📅 5–10 min/day</span>
                  <span>💬 8-hour delays</span>
                  <span>💾 Auto-saves locally</span>
                </div>
                <p className="context-warning">
                  ⚠️ Themes: heat stress, isolation, survival decisions
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
