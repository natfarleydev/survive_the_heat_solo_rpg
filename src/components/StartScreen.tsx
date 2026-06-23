import { useState, useEffect } from 'react';

interface StartScreenProps {
  onStartGame: (characterName: string) => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const [characterName, setCharacterName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    // After a short delay, show the full text (reveal gradually)
    const timer = setTimeout(() => setShowFullText(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (characterName.trim()) {
      onStartGame(characterName.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="container start-container">
      <div className="start-screen">
        {/* Animated background elements */}
        <div className="start-background">
          <div className="heat-shimmer heat-shimmer-1"></div>
          <div className="heat-shimmer heat-shimmer-2"></div>
          <div className="heat-shimmer heat-shimmer-3"></div>
        </div>

        {/* Main content - minimal and focused */}
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
    </div>
  );
}
