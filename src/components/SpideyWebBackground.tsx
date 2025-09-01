import React, { useEffect, useRef } from 'react';

export const spideyWebConfig: {
  density: number;
  maxNeighborDist: number;
  neighbors: number;
  rippleInterval: number;
  rippleLifeMs: number;
  clickPulseLifeMs: number;
  spring: { k: number; damp: number };
  brightnessBoost: number;
  halftone: boolean;
  effectsLevel: 'low' | 'medium' | 'high';
} = {
  density: 1.0, // node count multiplier
  maxNeighborDist: 120, // px (logical, before DPR)
  neighbors: 3,
  rippleInterval: 60,
  rippleLifeMs: 900,
  clickPulseLifeMs: 1400,
  spring: { k: 0.08, damp: 0.12 },
  brightnessBoost: 0.4,
  halftone: true,
  effectsLevel: 'medium',
};

type Node = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; n: number[] };
type Ripple = { x: number; y: number; t0: number; life: number; big?: boolean };

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

export default function SpideyWebBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0, height = 0;

    // Colors via CSS variables with fallbacks to computed colors
    const css = getComputedStyle(document.documentElement);
    const bg = css.getPropertyValue('--background') || getComputedStyle(document.body).backgroundColor || 'transparent';
    const base = css.getPropertyValue('--muted-foreground') || 'rgba(150,160,170,1)';
    const primary = css.getPropertyValue('--primary') || 'rgba(91,182,255,1)';
    const nodeColor = css.getPropertyValue('--foreground') || 'rgba(220,230,240,1)';

    let nodes: Node[] = [];
    let ripples: Ripple[] = [];
    let lastMove = 0;
    let paused = document.visibilityState === 'hidden';

    function resize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = Math.floor(vw * dpr);
      height = Math.floor(vh * dpr);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = vw + 'px';
      canvas.style.height = vh + 'px';
      buildNodes();
    }

    function levelScale() {
      return spideyWebConfig.effectsLevel === 'high' ? 1.25 : spideyWebConfig.effectsLevel === 'low' ? 0.75 : 1.0;
    }

    function buildNodes() {
      const scale = levelScale();
      const cell = 24; // logical pixels
      const cols = Math.ceil(window.innerWidth / cell);
      const rows = Math.ceil(window.innerHeight / cell);
      const density = spideyWebConfig.density * scale;
      nodes = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (Math.random() > density) continue;
          const jx = (x + 0.5 + (Math.random() - 0.5) * 0.6) * cell;
          const jy = (y + 0.5 + (Math.random() - 0.5) * 0.6) * cell;
          const nx = jx * dpr;
          const ny = jy * dpr;
          nodes.push({ x: nx, y: ny, ox: nx, oy: ny, vx: 0, vy: 0, n: [] });
        }
      }
      computeNeighbors();
    }

    function computeNeighbors() {
      const maxDist = spideyWebConfig.maxNeighborDist * levelScale() * dpr;
      const gridSize = maxDist;
      const grid = new Map<string, number[]>();
      function key(ix: number, iy: number) { return ix + ':' + iy; }
      nodes.forEach((p, i) => {
        const ix = Math.floor(p.x / gridSize);
        const iy = Math.floor(p.y / gridSize);
        const k = key(ix, iy);
        (grid.get(k) || grid.set(k, []).get(k)!).push(i);
      });
      nodes.forEach((p, i) => {
        const ix = Math.floor(p.x / gridSize);
        const iy = Math.floor(p.y / gridSize);
        const candidates: { j: number; d2: number }[] = [];
        for (let gy = iy - 1; gy <= iy + 1; gy++) {
          for (let gx = ix - 1; gx <= ix + 1; gx++) {
            const arr = grid.get(key(gx, gy));
            if (!arr) continue;
            for (const j of arr) {
              if (j === i) continue;
              const q = nodes[j];
              const dx = q.x - p.x, dy = q.y - p.y;
              const d2 = dx * dx + dy * dy;
              if (d2 <= maxDist * maxDist) candidates.push({ j, d2 });
            }
          }
        }
        candidates.sort((a, b) => a.d2 - b.d2);
        p.n = candidates.slice(0, spideyWebConfig.neighbors).map(c => c.j);
      });
    }

    function addRipple(x: number, y: number, big = false) {
      const now = performance.now();
      if (!big && now - lastMove < spideyWebConfig.rippleInterval) return;
      lastMove = now;
      ripples.push({ x: x * dpr, y: y * dpr, t0: now, life: big ? spideyWebConfig.clickPulseLifeMs : spideyWebConfig.rippleLifeMs, big });
    }

    function step(t: number) {
      if (paused) return;
      ctx.clearRect(0, 0, width, height);

      // Idle drift + spring back
      const driftAmp = 0.8 * levelScale() * dpr;
      for (const p of nodes) {
        const time = t / 1000;
        const dx0 = Math.sin((p.ox + time * 30) * 0.002) * driftAmp;
        const dy0 = Math.cos((p.oy + time * 24) * 0.002) * driftAmp;
        let tx = p.ox + dx0;
        let ty = p.oy + dy0;
        // Ripple reaction forces
        for (const r of ripples) {
          const age = (t - r.t0) / r.life;
          if (age < 0 || age > 1) continue;
          const rad = (r.big ? 240 : 140) * easeOutCubic(age) * dpr * levelScale();
          const dx = p.x - r.x; const dy = p.y - r.y; const d = Math.hypot(dx, dy);
          if (d < rad) {
            const push = (1 - d / rad) * 6 * dpr; // 2–6px push
            const nx = dx / (d || 1), ny = dy / (d || 1);
            tx += nx * push; ty += ny * push;
          }
        }
        const ax = (tx - p.x) * spideyWebConfig.spring.k;
        const ay = (ty - p.y) * spideyWebConfig.spring.damp;
        p.vx = (p.vx + ax) * (1 - spideyWebConfig.spring.damp);
        p.vy = (p.vy + ay) * (1 - spideyWebConfig.spring.damp);
        p.x += p.vx; p.y += p.vy;
      }

      // Draw edges
      const maxDist = spideyWebConfig.maxNeighborDist * levelScale() * dpr;
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        for (const j of p.n) {
          if (j <= i) continue; // avoid duplicates
          const q = nodes[j];
          const dx = q.x - p.x, dy = q.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d > maxDist) continue;
          let a = 0.25 * (1 - d / maxDist); // base alpha
          // Boost near active ripples
          for (const r of ripples) {
            const age = (t - r.t0) / r.life;
            if (age < 0 || age > 1) continue;
            const rad = (r.big ? 260 : 160) * easeOutCubic(age) * dpr * levelScale();
            const midx = (p.x + q.x) / 2, midy = (p.y + q.y) / 2;
            const dd = Math.hypot(midx - r.x, midy - r.y);
            if (dd < rad) { a += spideyWebConfig.brightnessBoost * (1 - dd / rad); }
          }
          ctx.strokeStyle = alpha(base.trim() || 'rgba(150,160,170,1)', Math.min(1, Math.max(0.04, a)));
          ctx.lineWidth = Math.max(1, 1.2 * dpr * (a + 0.1));
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }

      // Draw nodes
      for (const p of nodes) {
        ctx.fillStyle = alpha(nodeColor.trim() || '#e5e7eb', 0.9);
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4 * dpr, 0, Math.PI * 2); ctx.fill();
      }

      // Ripples visuals: ring
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (t - r.t0) / r.life;
        if (age >= 1) { ripples.splice(i, 1); continue; }
        const rad = (r.big ? 260 : 160) * easeOutCubic(age) * dpr * levelScale();
        ctx.strokeStyle = alpha(primary.trim() || '#5bb6ff', 0.18 * (1 - age));
        ctx.lineWidth = Math.max(1, 1.5 * dpr);
        ctx.beginPath(); ctx.arc(r.x, r.y, rad, 0, Math.PI * 2); ctx.stroke();
      }
    }

    function loop(t: number) {
      step(t);
      rafRef.current = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) { addRipple(e.clientX, e.clientY, false); }
    function onDown(e: PointerEvent) { addRipple(e.clientX, e.clientY, true); }
    function onVis() { paused = document.visibilityState === 'hidden'; }

    if (!reduce) {
      resize();
      window.addEventListener('resize', resize);
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      document.addEventListener('visibilitychange', onVis);
      rafRef.current = requestAnimationFrame(loop);
    } else {
      // Reduced motion: draw static dotted pattern once
      resize();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = alpha(nodeColor.trim() || '#e5e7eb', 0.6);
      for (const p of nodes) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.2 * dpr, 0, Math.PI * 2); ctx.fill(); }
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="spidey-web-layer" aria-hidden role="presentation" tabIndex={-1}>
      <canvas ref={canvasRef} />
      {spideyWebConfig.halftone && <div className="spidey-web-halftone" aria-hidden />}
    </div>
  );
}

function alpha(rgbOrHex: string, a: number) {
  // crude conversion: if already rgba, replace alpha; if hex, convert; else fall back
  if (rgbOrHex.startsWith('rgba')) return rgbOrHex.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, (_, r, g, b) => `rgba(${r},${g},${b},${a})`);
  if (rgbOrHex.startsWith('rgb')) return rgbOrHex.replace(/rgb\(([^,]+),([^,]+),([^\)]+)\)/, (_, r, g, b) => `rgba(${r},${g},${b},${a})`);
  // hex #rrggbb
  const m = rgbOrHex.trim().match(/#?([\da-f]{2})([\da-f]{2})([\da-f]{2})/i);
  if (m) { const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16); return `rgba(${r},${g},${b},${a})`; }
  return rgbOrHex;
}
