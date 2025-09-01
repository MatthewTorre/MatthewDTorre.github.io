import React, { useEffect, useRef } from 'react';

// Animated multiversal threads hugging the border of a container
// Usage: absolutely positioned inside a relatively positioned parent
const HeroBorderThreads: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const orbRefs = useRef<SVGCircleElement[]>([]);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const ro = new ResizeObserver(() => {
      const r = svg.parentElement!.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
      svg.setAttribute('width', String(r.width));
      svg.setAttribute('height', String(r.height));
    });
    ro.observe(svg.parentElement as Element);
    
    let raf: number | null = null;
    const t0 = performance.now();
    function step(t: number) {
      const r = svg.getBoundingClientRect();
      const w = r.width, h = r.height; const inset = 12;
      const L = 2 * ((w - 2 * inset) + (h - 2 * inset));

      function posAlong(pct: number) {
        let s = (pct % 1 + 1) % 1; // 0..1
        let d = s * L;
        const top = w - 2 * inset;
        const right = h - 2 * inset;
        const bottom = top;
        const left = right;
        if (d <= top) {
          return { x: inset + d, y: inset };
        } else if ((d -= top) <= right) {
          return { x: w - inset, y: inset + d };
        } else if ((d -= right) <= bottom) {
          return { x: w - inset - d, y: h - inset };
        } else {
          d -= bottom;
          return { x: inset, y: h - inset - d };
        }
      }

      // Three orbs with different speeds and hues
      const orbs = orbRefs.current;
      const speeds = [0.06, 0.045, 0.035]; // cycles per ms
      const hues = [320, 210, 50];
      for (let i = 0; i < orbs.length; i++) {
        const pct = ((t - t0) * speeds[i]) % 1;
        const { x, y } = posAlong(pct + i * 0.33);
        const el = orbs[i];
        if (el) {
          el.setAttribute('cx', String(x));
          el.setAttribute('cy', String(y));
          el.setAttribute('fill', `hsla(${hues[i]}, 100%, 75%, 0.9)`);
        }
      }

      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    return () => { ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <svg ref={ref} className="mv-border-threads" aria-hidden>
      <defs>
        <linearGradient id="mvGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff2244" />
          <stop offset="33%" stopColor="#5bb6ff" />
          <stop offset="66%" stopColor="#FCCC0A" />
          <stop offset="100%" stopColor="#B933AD" />
        </linearGradient>
        <filter id="orbBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
      </defs>
      {/* Outer glow */}
      <rect className="mv-thread mv-thread--glow" x="8" y="8" rx="18" ry="18" fill="none" />
      {/* Core strokes (offset duplicates create layered comic feel) */}
      <rect className="mv-thread mv-thread--core" x="8" y="8" rx="18" ry="18" fill="none" />
      <rect className="mv-thread mv-thread--core" x="12" y="14" rx="18" ry="18" fill="none" />
      {/* Pulse orbs traveling around the border */}
      <circle ref={el => { if (el) orbRefs.current[0] = el; }} r={16} fill="none" filter="url(#orbBlur)" />
      <circle ref={el => { if (el) orbRefs.current[1] = el; }} r={14} fill="none" filter="url(#orbBlur)" />
      <circle ref={el => { if (el) orbRefs.current[2] = el; }} r={12} fill="none" filter="url(#orbBlur)" />
    </svg>
  );
};

export default HeroBorderThreads;
