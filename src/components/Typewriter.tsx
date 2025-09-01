import React, { useEffect, useRef, useState } from 'react';

type Props = {
  text: string;
  trigger: boolean;
  speed?: number; // ms between characters
  className?: string;
  cursor?: boolean; // show blinking cursor
  cursorChar?: string; // glyph for cursor
};

const Typewriter: React.FC<Props> = ({ text, trigger, speed = 40, className, cursor = true, cursorChar = '▍' }) => {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    // Reset when trigger becomes false
    if (!trigger) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      setDisplayed('');
      indexRef.current = 0;
      return;
    }

    // Start typing when triggered
    if (timerRef.current) window.clearInterval(timerRef.current);
    setDisplayed('');
    indexRef.current = 0;
    setTyping(true);

    timerRef.current = window.setInterval(() => {
      const i = indexRef.current + 1;
      setDisplayed(text.slice(0, i));
      indexRef.current = i;
      if (i >= text.length) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setTyping(false);
      }
    }, speed);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [text, speed, trigger]);

  const showCursor = cursor && trigger; // show while active section is in view
  return (
    <span className={className}>
      <span>{displayed}</span>
      {showCursor && (
        <span className={`tw-cursor ${typing ? 'typing' : 'idle'}`} aria-hidden>
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default Typewriter;
