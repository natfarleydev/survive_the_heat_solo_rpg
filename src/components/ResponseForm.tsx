import { useState } from 'react';
import type { Response } from '../types';
import { getDailyPrompts } from '../promptGenerator';

interface ResponseFormProps {
  dayNumber: number;
  onSubmit: (response: string) => void;
  lastResponse?: Response;
}

export default function ResponseForm({ dayNumber, onSubmit }: ResponseFormProps) {
  const [responseText, setResponseText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const prompts = getDailyPrompts(dayNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (responseText.trim()) {
      onSubmit(responseText.trim());
      setResponseText('');
      setSubmitted(true);

      // Reset submitted state after animation
      setTimeout(() => setSubmitted(false), 2000);
    }
  };

  // Append a prompt to the textarea as a gentle nudge for players who want a starting point.
  const handlePromptClick = (prompt: string) => {
    if (submitted) return;
    setResponseText((prev) => {
      const trimmed = prev.trimEnd();
      const prefix = trimmed.length > 0 ? `${trimmed}\n\n` : '';
      return `${prefix}${prompt}\n`;
    });
  };

  return (
    <div className="response-form">
      <div className="prompt-seeds">
        <p className="prompt-seeds-label">You could tell them about&hellip;</p>
        <ul className="prompt-seeds-list">
          {prompts.map((prompt, idx) => (
            <li key={idx}>
              <button
                type="button"
                className="prompt-seed"
                onClick={() => handlePromptClick(prompt)}
                disabled={submitted}
              >
                {prompt}
              </button>
            </li>
          ))}
        </ul>
        <p className="prompt-seeds-hint">Tap one to begin, or write your own. There are no wrong answers.</p>
      </div>

      <form onSubmit={handleSubmit} className="transmission-form">
        <div className="transmission">
          <div className="transmission-header">
            <span className="transmission-rec" aria-hidden="true"></span>
            <span className="transmission-title">TRANSMISSION TO NEW HOPE &mdash; DAY {dayNumber}</span>
          </div>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Begin writing your report. Where were you when the heat was at its worst? What did you do to live through it?"
            className="textarea transmission-input"
            rows={10}
            disabled={submitted}
            autoFocus
          />
        </div>

        <div className="form-footer">
          <span className="char-count">{responseText.length} characters</span>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!responseText.trim() || submitted}
          >
            {submitted ? '✓ Transmitting…' : '📡 Send Report'}
          </button>
        </div>
      </form>

      <p className="form-hint">
        Your report is logged and sent to New Hope. The next letter arrives in 8 hours.
      </p>
    </div>
  );
}
