import type { Letter } from '../types';

interface LetterDisplayProps {
  letter: Letter;
}

export default function LetterDisplay({ letter }: LetterDisplayProps) {
  return (
    <div className="letter">
      <div className="letter-header">
        <div className="letter-title-row">
          <h2 className="letter-subject">{letter.subject}</h2>
          <span className="badge-new">NEW</span>
        </div>
        <p className="letter-from">
          <span className="label">From:</span>
          <span className="sender">{letter.from}</span>
        </p>
        <p className="letter-day">
          <span className="label">Day:</span>
          <span className="day-num">{letter.day}</span>
        </p>
      </div>

      <div className="letter-body">
        {letter.body.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
