import React, { useEffect, useRef } from 'react';

// Animated multiversal threads hugging the border of a container
// Usage: absolutely positioned inside a relatively positioned parent
const HeroBorderThreads: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const svgEl = svg as SVGSVGElement; // non-null after guard
    const parent: Element = (svg.parentElement || svg);
    const ro = new ResizeObserver(() => {
      const r = parent.getBoundingClientRect();
      svgEl.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
      svgEl.setAttribute('width', String(r.width));
      svgEl.setAttribute('height', String(r.height));
    });
    ro.observe(parent);

    return () => { ro.disconnect(); };
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
    </svg>
  );
};

export default HeroBorderThreads;
