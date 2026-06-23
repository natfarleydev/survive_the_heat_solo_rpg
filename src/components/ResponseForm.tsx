import { useState } from 'react';
import type { Response } from '../types';
import { getDailyPrompts } from '../promptGenerator';

interface ResponseFormProps {
  dayNumber: number;
  onSubmit: (response: string) => void;
  lastResponse?: Response;
}

// New Hope's uplink is a narrow, salvaged data-link. Reports are capped and
// sent through a slow modem — the telemetry below sells that constraint.
const MAX_CHARS = 1500;
const BAUD = 1200; // bits/sec — a period-appropriate trickle

const byteLength = (text: string): number => new TextEncoder().encode(text).length;

const formatBytes = (n: number): string =>
  n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;

// Information-theoretic lower bound (Shannon entropy) + a little gzip-style
// overhead. Gives a believable, content-responsive "compressed size": repetitive
// text squeezes down further, dense text less so.
const estimateCompressedBytes = (text: string): number => {
  if (!text) return 0;
  const bytes = new TextEncoder().encode(text);
  const freq = new Map<number, number>();
  for (const b of bytes) freq.set(b, (freq.get(b) ?? 0) + 1);
  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / bytes.length;
    entropy -= p * Math.log2(p);
  }
  const compressed = Math.ceil((entropy * bytes.length) / 8) + 18;
  return Math.min(bytes.length, compressed);
};

export default function ResponseForm({ dayNumber, onSubmit }: ResponseFormProps) {
  const [responseText, setResponseText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const prompts = getDailyPrompts(dayNumber);

  const chars = responseText.length;
  const rawBytes = byteLength(responseText);
  const compressedBytes = estimateCompressedBytes(responseText);
  const savings = rawBytes > 0 ? Math.round((1 - compressedBytes / rawBytes) * 100) : 0;
  const uplinkSeconds = (compressedBytes * 8) / BAUD;
  const usage = chars / MAX_CHARS;
  const bufferState = usage >= 1 ? 'full' : usage >= 0.85 ? 'warn' : 'ok';

  const status =
    chars === 0
      ? { cls: 'idle', text: '◌ AWAITING INPUT' }
      : bufferState === 'full'
        ? { cls: 'full', text: '⚠ BUFFER FULL — TRIM TO SEND' }
        : bufferState === 'warn'
          ? { cls: 'warn', text: '⚠ NEARING BANDWIDTH LIMIT' }
          : { cls: 'ok', text: '◉ LINK STABLE' };

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
      return `${prefix}${prompt}\n`.slice(0, MAX_CHARS);
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
            maxLength={MAX_CHARS}
            autoFocus
          />

          <div className="transmission-telemetry">
            <div className="tx-bandwidth">
              <span className="tx-label">BANDWIDTH</span>
              <div className="tx-bar">
                <div
                  className="tx-bar-fill"
                  data-state={bufferState}
                  style={{ width: `${Math.min(100, usage * 100)}%` }}
                ></div>
              </div>
              <span className="tx-chars">
                {chars.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>
            <div className="tx-stats">
              <span>PAYLOAD {formatBytes(rawBytes)}</span>
              <span className="tx-sep">·</span>
              <span>
                COMPRESSED {formatBytes(compressedBytes)} <em>(&minus;{savings}%)</em>
              </span>
              <span className="tx-sep">·</span>
              <span>UPLINK ~{uplinkSeconds.toFixed(1)}s @ {BAUD} baud</span>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <span className={`tx-status tx-status-${status.cls}`}>{status.text}</span>
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
        Bandwidth is scarce. Reports are capped at {MAX_CHARS.toLocaleString()} characters, compressed, and
        relayed to New Hope. The next letter arrives in 8 hours.
      </p>
    </div>
  );
}
