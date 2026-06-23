import { useState, useEffect } from 'react';

export default function AnimationToggle() {
  const [animationsDisabled, setAnimationsDisabled] = useState(false);

  useEffect(() => {
    if (animationsDisabled) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
  }, [animationsDisabled]);

  return (
    <button
      className="animation-toggle"
      onClick={() => setAnimationsDisabled(!animationsDisabled)}
      title={animationsDisabled ? 'Enable animations' : 'Disable animations'}
      aria-label={animationsDisabled ? 'Enable animations' : 'Disable animations'}
    >
      {animationsDisabled ? '🎬' : '⏸️'}
    </button>
  );
}
