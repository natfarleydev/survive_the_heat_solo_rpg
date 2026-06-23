import { useState } from 'react';
import type { Response } from '../types';

interface ResponseFormProps {
  dayNumber: number;
  onSubmit: (response: string) => void;
  lastResponse?: Response;
}

export default function ResponseForm({ dayNumber, onSubmit, lastResponse }: ResponseFormProps) {
  const [responseText, setResponseText] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <div className="response-form">
      <h3 className="form-title">Your Response - Day {dayNumber}</h3>

      {lastResponse && (
        <div className="reflection-prompts">
          <p className="prompts-label">Reflection prompts for today:</p>
          <ul>
            {lastResponse.generatedPrompts.slice(0, 2).map((prompt, idx) => (
              <li key={idx}>{prompt}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Write how you survived the heat today. Be specific about what you did, how you felt, what scared you, what kept you going..."
          className="textarea"
          rows={8}
          disabled={submitted}
        />

        <div className="form-footer">
          <span className="char-count">{responseText.length} characters</span>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!responseText.trim() || submitted}
          >
            {submitted ? '✓ Sent' : 'Send Response'}
          </button>
        </div>
      </form>

      <p className="form-hint">
        Your response will be sent to New Hope. The next letter will arrive in 8 hours.
      </p>
    </div>
  );
}
