import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type Skill = {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
  since?: string; // e.g., '2022'
  icon?: React.ReactNode | string;
  note?: never; // explicitly no endorsements/notes
};

export interface SkillsDeckProps {
  items?: Skill[];
  autoplay?: boolean;     // default true
  intervalMs?: number;    // default 4000
  visibleStack?: number;  // default 3
  peelThreshold?: number; // default 0.4 (40%)
}

// Simple suits to decorate corners
const SUITS = ['♦️', '♣️', '♥️', '♠️'];

function useVisibility() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  return visible;
}

export const SkillsDeck: React.FC<SkillsDeckProps> = ({
  items = [],
  autoplay = true,
  intervalMs = 4000,
  visibleStack = 3,
  peelThreshold = 0.4,
}) => {
  const [queue, setQueue] = useState<Skill[]>(items);
  const [flipped, setFlipped] = useState(false);
  const [paused, setPaused] = useState(false);
  const visible = useVisibility();
  const liveRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const animatingRef = useRef(false);
  const peelRef = useRef({ active: false, startX: 0, startY: 0, angle: 0 });
  const [peelAngle, setPeelAngle] = useState(0);
  const [peeling, setPeeling] = useState(false);
  const hapticRef = useRef({ started: false, threshold: false });

  const vibrate = useCallback((pattern: number | number[]) => {
    try {
      const anyNav: any = navigator;
      if (anyNav && typeof anyNav.vibrate === 'function') {
        anyNav.vibrate(pattern as any);
      }
    } catch {
      // ignore if not supported
    }
  }, []);

  useEffect(() => {
    setQueue(items);
  }, [items]);

  const active = queue[0];

  const announce = useCallback((text: string) => {
    if (!liveRef.current) return;
    // Clear then set to ensure announcement
    liveRef.current.textContent = '';
    // small timeout to force DOM update
    window.setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = text;
    }, 10);
  }, []);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    if (animatingRef.current) return;
    animatingRef.current = true;
    setFlipped(true);
    // After flip animation completes, move first to end
    window.setTimeout(() => {
      setQueue((q) => (q.length > 0 ? [...q.slice(1), q[0]] : q));
      setFlipped(false);
      // focus new active
      window.setTimeout(() => {
        activeRef.current?.focus();
        animatingRef.current = false;
      }, 30);
    }, 650);
  }, [queue.length]);

  const prev = useCallback(() => {
    if (queue.length === 0) return;
    if (animatingRef.current) return;
    animatingRef.current = true;
    setQueue((q) => (q.length > 0 ? [q[q.length - 1], ...q.slice(0, -1)] : q));
    setFlipped(false);
    window.setTimeout(() => {
      activeRef.current?.focus();
      animatingRef.current = false;
    }, 30);
  }, [queue.length]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || paused || !visible) return;
    const id = window.setInterval(() => next(), intervalMs);
    return () => window.clearInterval(id);
  }, [autoplay, paused, visible, intervalMs, next]);

  // Announce active card changes
  useEffect(() => {
    if (active) announce(`Showing: ${active.name}${active.level ? ` (${active.level})` : ''}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    },
    [next, prev]
  );

  const handlePointer = useCallback(() => next(), [next]);
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (animatingRef.current) return;
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const yFromTop = e.clientY - rect.top;
    // Start peel only if grab happens within top 25% of card height
    if (yFromTop > rect.height * 0.25) return;
    peelRef.current = { active: true, startX: e.clientX, startY: e.clientY, angle: 0 };
    setPaused(true);
    setPeeling(true);
    hapticRef.current.started = false;
    hapticRef.current.threshold = false;
    if ((e as any).pointerType === 'touch') vibrate(6);
    target.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!peelRef.current.active) return;
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    const dy = e.clientY - peelRef.current.startY;
    const ratio = Math.max(0, Math.min(1, dy / rect.height));
    // Elastic resistance
    const eased = Math.pow(ratio, 0.85);
    const angle = eased * 55; // up to ~55deg before flip
    peelRef.current.angle = angle;
    setPeelAngle(angle);
    // Haptic: small tick on initial movement and a stronger one at threshold
    if ((e as any).pointerType === 'touch') {
      if (!hapticRef.current.started && ratio > 0.05) {
        hapticRef.current.started = true;
        vibrate(8);
      }
      if (!hapticRef.current.threshold && ratio >= peelThreshold) {
        hapticRef.current.threshold = true;
        vibrate([10, 20, 10]);
      }
    }
  }, []);

  const cancelPeel = useCallback(() => {
    peelRef.current.active = false;
    setPeelAngle(0);
    setPaused(false);
    setPeeling(false);
    hapticRef.current.started = false;
    hapticRef.current.threshold = false;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!peelRef.current.active) return;
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    const progressed = Math.min(1, Math.max(0, (e.clientY - peelRef.current.startY) / rect.height));
    const past = progressed >= peelThreshold;
    if (past) {
      // complete flip and advance
      if ((e as any).pointerType === 'touch') vibrate(20);
      next();
    } else {
      // snap back
      setPeelAngle(0);
      if ((e as any).pointerType === 'touch' && hapticRef.current.started) vibrate(5);
    }
    cancelPeel();
  }, [cancelPeel, next, peelThreshold]);

  const stack = useMemo(() => queue.slice(0, Math.max(1, visibleStack)), [queue, visibleStack]);

  return (
    <div
      className="skills-deck-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true" ref={liveRef} />
      <div className="skills-deck" role="list" aria-label="Skills deck">
        {stack.map((item, i) => {
          const depth = i; // 0 is active
          const offset = Math.min(depth, 3);
          const scale = 1 - offset * 0.05;
          const rotate = (offset % 2 === 0 ? -1 : 1) * offset * 1.5;
          const translateY = offset * 6;
          const opacity = 1 - offset * 0.15;
          const z = stack.length - depth;
          const isActive = i === 0;

          return (
            <div
              key={item.id}
              role="listitem"
              className={`deck-card ${isActive ? 'active' : ''}`}
              style={{
                zIndex: z,
                transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                opacity,
              }}
            >
              <div
                className={`deck-card-inner ${isActive && flipped ? 'flipped' : ''} ${isActive && peeling ? 'peeling' : ''}`}
                onClick={isActive ? handlePointer : undefined}
                onKeyDown={isActive ? onKeyDown : undefined}
                onPointerDown={isActive ? onPointerDown : undefined}
                onPointerMove={isActive ? onPointerMove : undefined}
                onPointerUp={isActive ? onPointerUp : undefined}
                onPointerCancel={isActive ? cancelPeel : undefined}
                tabIndex={isActive ? 0 : -1}
                ref={isActive ? activeRef : null}
                style={isActive && !flipped ? { transform: `rotateX(${peelAngle}deg)` } : undefined}
                aria-label={isActive ? `${item.name}. Drag from the top edge to peel and flip, or press Enter/Space to advance.` : undefined}
              >
                {/* Front */}
                <div className="deck-face deck-face--front verse-card verse-card--light">
                  <div className="corner tl">{SUITS[i % SUITS.length]}</div>
                  <div className="corner br">{SUITS[(i + 1) % SUITS.length]}</div>
                  <div className="deck-face-body">
                    <div className="deck-icon" aria-hidden="true">{item.icon}</div>
                    <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>{item.name}</h3>
                    {item.category && (
                      <span className="badge-chip" aria-label="category">{item.category}</span>
                    )}
                  </div>
                </div>
                {/* Back */}
                <div className="deck-face deck-face--back verse-card verse-card--light">
                  <div className="deck-face-body">
                    {item.level && (
                      <p className="card-desc" style={{ marginBottom: '0.35rem' }}>Level: {item.level}</p>
                    )}
                    {item.since && (
                      <p className="card-desc" style={{ marginBottom: 0 }}>In production since {item.since}.</p>
                    )}
                    {!item.level && !item.since && (
                      <p className="card-desc" style={{ marginBottom: 0 }}>Tap to advance.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="sr-only">Drag from the top edge to peel and flip to next. Keyboard: Left/Right arrows for prev/next; Enter or Space flips/advances.</p>
    </div>
  );
};

export default SkillsDeck;
