import type { Response } from '../types';

interface HistoryPanelProps {
  responses: Response[];
  onClose: () => void;
}

export default function HistoryPanel({ responses, onClose }: HistoryPanelProps) {
  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-content" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h2>Your Journey</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="history-list">
          {responses.map((response) => (
            <details key={response.day} className="history-item">
              <summary className="history-summary">
                <span className="history-day">Day {response.day}</span>
                <span className="history-subject">{response.letter.subject}</span>
              </summary>
              <div className="history-details">
                <div className="history-from">
                  <strong>From:</strong> {response.letter.from}
                </div>
                <div className="history-response">
                  <strong>Your Response:</strong>
                  <p>{response.content}</p>
                </div>
                {response.generatedPrompts.length > 0 && (
                  <div className="history-prompts">
                    <strong>Reflection Prompts:</strong>
                    <ul>
                      {response.generatedPrompts.map((prompt, idx) => (
                        <li key={idx}>{prompt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
