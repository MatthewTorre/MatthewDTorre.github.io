import React, { useEffect, useRef } from 'react';

/** Spider‑Verse style ambient background for the Skills section. */
export default function SkillsVerse({ density = 0.8 }: { density?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const reduce = typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    wrap.style.position = 'absolute';
    wrap.style.inset = '0';
    wrap.style.pointerEvents = 'none';
    wrap.style.zIndex = '0';

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap.parentElement || wrap);

    function dpr() { return Math.max(1, Math.min(2, window.devicePixelRatio || 1)); }

    type Pt = { x: number; y: number; vx: number; vy: number; ph: number };
    let pts: Pt[] = [];
    type B = { x: number; w: number; h: number; depth: number; skew: number; seed: number; winCols: number; winRows: number };
    let buildings: B[] = [];

    function rebuild() {
      const rect = (wrap.parentElement || wrap).getBoundingClientRect();
      const count = Math.floor((rect.width * rect.height) / 26000 * density);
      pts = new Array(Math.max(10, count)).fill(0).map(() => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        ph: Math.random() * 1000,
      }));
      // Remove skyline buildings for performance/visual simplicity
      buildings = [];
    }

    function resize() {
      const rect = (wrap.parentElement || wrap).getBoundingClientRect();
      const DPR = dpr();
      canvas.width = Math.max(1, Math.floor(rect.width * DPR));
      canvas.height = Math.max(1, Math.floor(rect.height * DPR));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      rebuild();
      draw(0);
    }

    function draw(ts: number) {
      const DPR = dpr();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Neon thread web
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        // drift
        a.x += a.vx; a.y += a.vy;
        const W = canvas.width / DPR, H = canvas.height / DPR;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        // connect to nearest few
        const d = [] as { j: number; d2: number }[];
        for (let j = 0; j < pts.length; j++) if (j !== i) {
          const b = pts[j];
          const dx = b.x - a.x, dy = b.y - a.y; const d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160) d.push({ j, d2 });
        }
        d.sort((p, q) => p.d2 - q.d2);
        const hue = (a.ph * 137.5 + ts * 0.02) % 360;
        for (let k = 0; k < Math.min(1, d.length); k++) {
          const b = pts[d[k].j];
          ctx.beginPath();
          ctx.moveTo(a.x * DPR, a.y * DPR);
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const wob = Math.sin((ts * 0.001) + a.ph) * 12;
          ctx.quadraticCurveTo((mx + wob) * DPR, (my - wob) * DPR, b.x * DPR, b.y * DPR);
          ctx.lineWidth = 3 * DPR; ctx.strokeStyle = `hsla(${(hue + 220) % 360},100%,65%,0.28)`; ctx.shadowBlur = 10; ctx.shadowColor = ctx.strokeStyle; ctx.globalCompositeOperation = 'lighter'; ctx.stroke();
          ctx.lineWidth = 1.2 * DPR; ctx.strokeStyle = `hsla(${hue},100%,95%,0.9)`; ctx.shadowBlur = 0; ctx.stroke();
        }
        // node glow
        const g = ctx.createRadialGradient(a.x * DPR, a.y * DPR, 0, a.x * DPR, a.y * DPR, 10 * DPR);
        g.addColorStop(0, 'rgba(220,240,255,0.8)'); g.addColorStop(1, 'rgba(220,240,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(a.x * DPR, a.y * DPR, 10 * DPR, 0, Math.PI * 2); ctx.fill();
      }

      // Glitchy 3D skyline at bottom corners only
      const H = canvas.height / DPR; const baseY = H - 10;
      for (const b of buildings) {
        const t = ts * 0.008 + b.seed; // slower for perf
        const jx = reduce ? 0 : Math.sin(t) * 2; // horizontal jitter
        const depth = b.depth;
        const x = (b.x + jx), y = baseY - b.h, w = b.w, h = b.h;

        // Colors
        const hue = (b.seed * 137.5 + ts * 0.04) % 360;
        const face = ctx.createLinearGradient(x * DPR, y * DPR, x * DPR, (y + h) * DPR);
        // Lean into Spider‑Verse palette (magenta/indigo blend)
        face.addColorStop(0, `hsla(${(hue+310)%360}, 70%, 26%, 0.95)`);
        face.addColorStop(1, `hsla(${(hue+230)%360}, 65%, 12%, 0.95)`);
        const sideCol = `hsla(${(hue+270)%360}, 75%, 14%, 0.95)`;

        // Front face
        ctx.fillStyle = face;
        ctx.fillRect(x * DPR, y * DPR, w * DPR, h * DPR);

        // Right side face (parallelogram for faux 3D)
        const dx = depth * b.skew, dy = depth;
        ctx.fillStyle = sideCol;
        ctx.beginPath();
        ctx.moveTo((x + w) * DPR, y * DPR);
        ctx.lineTo((x + w + dx) * DPR, (y + dy) * DPR);
        ctx.lineTo((x + w + dx) * DPR, (y + h + dy) * DPR);
        ctx.lineTo((x + w) * DPR, (y + h) * DPR);
        ctx.closePath(); ctx.fill();

        // Chromatic aberration glitch edges
        const outlines = [
          { off: 0.0, col: `hsla(${(hue+300)%360},100%,55%,0.35)` },
          { off: 1.2, col: `hsla(${(hue+60)%360},100%,55%,0.25)` },
          { off: -1.2, col: `hsla(${(hue+180)%360},100%,55%,0.25)` },
        ];
        for (const o of outlines) {
          ctx.strokeStyle = o.col; ctx.lineWidth = 1 * DPR;
          ctx.strokeRect((x + o.off) * DPR + 0.5, (y + o.off) * DPR + 0.5, w * DPR, h * DPR);
        }

        // Windows grid with neon flicker
        const cW = w / b.winCols, cH = h / b.winRows;
        for (let r = 0; r < b.winRows; r++) {
          for (let c = 0; c < b.winCols; c++) {
            const wx = x + c * cW + 2, wy = y + r * cH + 2;
            const ww = Math.max(2, cW - 4), wh = Math.max(3, cH - 4);
            const flick = Math.sin(t * 0.5 + r * 0.7 + c * 1.3) * 0.5 + 0.5;
            const on = flick > 0.55;
            if (!on) continue;
            const winHue = (hue + r * 7 + c * 13) % 360;
            ctx.fillStyle = `hsla(${winHue}, 100%, ${60 + flick * 20}%, ${0.85})`;
            ctx.fillRect(wx * DPR, wy * DPR, ww * DPR, wh * DPR);
          }
        }

        // Glitch shards (triangles)
        if (!reduce) {
          const shardCount = 2 + ((b.seed * 100) % 3);
          for (let s = 0; s < shardCount; s++) {
            const ang = (t * 0.05 + s) % (Math.PI * 2);
            const sx = x + w * 0.5 + Math.cos(ang) * (8 + s * 6);
            const sy = y + h * 0.3 + Math.sin(ang * 1.3) * (6 + s * 5);
            const size = 6 + (s * 3);
            ctx.fillStyle = `hsla(${(hue + s * 90) % 360}, 100%, 60%, 0.42)`;
            ctx.beginPath();
            ctx.moveTo((sx) * DPR, (sy - size) * DPR);
            ctx.lineTo((sx - size) * DPR, (sy + size) * DPR);
            ctx.lineTo((sx + size) * DPR, (sy + size * 0.6) * DPR);
            ctx.closePath(); ctx.fill();
          }
        }
      }

      // Central burst of colorful shards (inspired by reference)
      if (!reduce) {
        const cx = (canvas.width / DPR) * 0.5;
        const cy = (canvas.height / DPR) * 0.6; // slightly below center
        const rings = 2;
        for (let r = 0; r < rings; r++) {
          const pieces = 14 + r * 8;
          for (let i = 0; i < pieces; i++) {
            const baseAng = (i / pieces) * Math.PI * 2 + Math.sin(ts * 0.0006 + r) * 0.1;
            const rad = 40 + r * 26 + (i % 3) * 6;
            const x1 = cx + Math.cos(baseAng) * rad;
            const y1 = cy + Math.sin(baseAng) * rad;
            const x2 = cx + Math.cos(baseAng + 0.18) * (rad + 12);
            const y2 = cy + Math.sin(baseAng + 0.18) * (rad + 6);
            const x3 = cx + Math.cos(baseAng - 0.12) * (rad + 18);
            const y3 = cy + Math.sin(baseAng - 0.12) * (rad + 10);
            const hue = (ts * 0.06 + i * 27 + r * 60) % 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 62%, 0.35)`;
            ctx.beginPath(); ctx.moveTo(x1 * DPR, y1 * DPR); ctx.lineTo(x2 * DPR, y2 * DPR); ctx.lineTo(x3 * DPR, y3 * DPR); ctx.closePath(); ctx.fill();
          }
        }
      }

      if (!reduce) rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    if (!reduce) rafRef.current = requestAnimationFrame(draw);

    return () => { ro.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [density]);

  return (
    <div ref={wrapRef} className="skills-verse-wrap">
      <canvas ref={canvasRef} className="skills-verse-canvas" />
    </div>
  );
}
