import React from 'react';
import '../styles/flip-card.css';

type FlipCardProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  initiallyFlipped?: boolean;
};

export default function FlipCard({ front, back, className = '', initiallyFlipped = false }: FlipCardProps) {
  const [flipped, setFlipped] = React.useState(initiallyFlipped);

  const toggle = () => setFlipped((f) => !f);
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  };

  return (
    <div className={`flip-root ${className}`}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label="Flip card"
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={`flip-inner ${flipped ? 'is-flipped' : ''}`}
      >
        <div className="flip-face flip-front">
          {front}
        </div>
        <div className="flip-face flip-back">
          {back}
        </div>
      </div>
    </div>
  );
}

