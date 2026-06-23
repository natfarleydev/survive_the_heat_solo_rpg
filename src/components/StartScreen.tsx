import { useState } from 'react';

interface StartScreenProps {
  onStartGame: (characterName: string) => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const [characterName, setCharacterName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (characterName.trim()) {
      onStartGame(characterName.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="container">
      <div className="start-screen">
        <h1 className="title">Survive the Heat</h1>
        <div className="subtitle">A Solo RPG in a Burning Future</div>

        <div className="intro-text">
          <p>
            The world burns. Temperatures soar past anything the old records predicted. But you're
            still alive.
          </p>
          <p>
            A settlement called New Hope found your signal. They want to hear your story—how you
            survive each day in conditions that kill most people. Your reports might save lives.
          </p>
          <p className="emphasis">
            Over the next 12 days, you'll receive letters from the settlement. Each day, you'll
            respond with how you survived the heat. Your choices shape the story.
          </p>
          <p className="small">
            Expect to spend about 5-10 minutes per day. Come back every 8 hours for the next
            letter.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="character-form">
          <label htmlFor="character-name" className="label">
            What's your name? <span className="required">*</span>
          </label>
          <input
            id="character-name"
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter your character's name"
            className="input"
            autoFocus
            disabled={submitted}
          />
          <button type="submit" className="btn btn-primary" disabled={!characterName.trim() || submitted}>
            {submitted ? 'Starting...' : 'Begin Your Journey'}
          </button>
        </form>

        <div className="footer-text">
          <p>
            <strong>Content Warning:</strong> This game explores heat stress, isolation, and difficult
            survival scenarios. It's designed to be reflective, not traumatizing.
          </p>
        </div>
      </div>
    </div>
  );
}
