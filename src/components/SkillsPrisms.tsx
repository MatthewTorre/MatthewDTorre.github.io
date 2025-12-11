import React, { useEffect, useMemo, useRef, useState } from 'react';
import { skills as DEFAULT_SKILLS, type SkillNode } from '../data/skills';

type Props = { items?: SkillNode[]; size?: number; k?: number };

export default function SkillsPrisms({ items = DEFAULT_SKILLS, size = 150, k = 2 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const nodes = useRef<Array<{ id: string; label: string; group?: string; x: number; y: number; r: number; vx: number; vy: number; spin: number; hue: number }>>([]);
  const edges = useRef<Array<{ a: number; b: number; seed: number }>>([]);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const reduced = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false : false;

  const data = useMemo(() => items, [items]);

  useEffect(() => {
  const wrap = wrapRef.current;
  const canvas = canvasRef.current;
  if (!wrap || !canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D;
  const c = canvas;
  const parentEl = wrap;

  wrap.style.position = 'relative';
  c.style.position = 'absolute';
  c.style.inset = '0';
  c.style.pointerEvents = 'none';
  c.style.zIndex = '0';

  const DPR = () => window.devicePixelRatio || 1;

    const resize = () => {
      const rect = parentEl.getBoundingClientRect();
      const dpr = DPR();
      c.width = Math.max(1, Math.floor(rect.width * dpr));
      c.height = Math.max(1, Math.floor(rect.height * dpr));
      c.style.width = rect.width + 'px';
      c.style.height = rect.height + 'px';
      seed(rect.width, rect.height);
      computeEdges();
      step(0);
    };

  const ro = new ResizeObserver(resize); ro.observe(parentEl);
  const io = new IntersectionObserver(
    ([entry]) => {
      activeRef.current = entry.isIntersecting;
      if (activeRef.current && !reduced && !rafRef.current) {
        rafRef.current = requestAnimationFrame(step);
      } else if (!activeRef.current && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    },
    { threshold: 0.15 }
  );
  io.observe(parentEl);

    function rand(min: number, max: number) { return min + Math.random() * (max - min); }

    function seed(W: number, H: number) {
      const margin = 90;
      nodes.current = data.map((d, i) => ({ id: d.id, label: d.label, group: d.group, x: rand(margin, W - margin), y: rand(margin, H - margin), r: size * (0.75 + Math.random() * 0.35), vx: rand(-0.22, 0.22), vy: rand(-0.18, 0.18), spin: rand(-0.002, 0.002), hue: (i * 23 + 40) % 360 }));
    }

    function computeEdges() {
      const pts = nodes.current; const out: Array<{ a: number; b: number; seed: number }> = [];
      for (let i = 0; i < pts.length; i++) {
        const base = pts[i];
        const sorted = pts.map((p, j) => ({ j, d: (p.x - base.x) ** 2 + (p.y - base.y) ** 2 }))
          .sort((a, b) => a.d - b.d)
          .filter(x => x.j !== i)
          .slice(0, k);
        for (const s of sorted) if (s.j > i) out.push({ a: i, b: s.j, seed: Math.random() * 1000 });
      }
      edges.current = out;
    }

    function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number) { const it = 1 - t; return it * it * it * p0 + 3 * it * it * t * p1 + 3 * it * t * t * p2 + t * t * t * p3; }
    function glowStroke(w: number, color: string) { ctx.lineWidth = w; ctx.strokeStyle = color; ctx.shadowBlur = w * 1.25; ctx.shadowColor = color; ctx.globalCompositeOperation = 'lighter'; }
    function coreStroke(w: number, color: string) { ctx.lineWidth = w; ctx.strokeStyle = color; ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'lighter'; }

    function drawThreads(ts: number) {
      const dpr = DPR();
      ctx.globalCompositeOperation = 'lighter';
      for (const e of edges.current) {
        const a = nodes.current[e.a], b = nodes.current[e.b]; if (!a || !b) continue;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const wob = 8 + 10 * Math.sin(0.0006 * e.seed + ts * 0.001);
        const ox = wob * nx, oy = wob * ny;
        const c1x = mx + ox, c1y = my + oy; const c2x = mx - ox, c2y = my - oy;

        ctx.beginPath(); ctx.moveTo(a.x * dpr, a.y * dpr); ctx.bezierCurveTo(c1x * dpr, c1y * dpr, c2x * dpr, c2y * dpr, b.x * dpr, b.y * dpr);
        const hue = (e.seed * 0.4 + ts * 0.015) % 360;
        ctx.lineWidth = 2.2 * dpr; ctx.strokeStyle = `hsla(${hue},100%,75%,0.4)`; ctx.shadowBlur = 6 * dpr; ctx.shadowColor = ctx.strokeStyle; ctx.stroke();
        ctx.lineWidth = 1.1 * dpr; ctx.strokeStyle = `hsla(${hue},100%,95%,0.9)`; ctx.shadowBlur = 0; ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    function drawPrism(n: (typeof nodes.current)[number], ts: number) {
      const dpr = DPR();
      const baseRadius = Math.max(0, n.r * 0.7);
      if (!baseRadius) return;
      const cx = n.x * dpr, cy = n.y * dpr;
      const padX = baseRadius * dpr * 0.9;
      const padY = baseRadius * dpr * 0.45;
      const color = n.group === 'Product' ? '#f9a825' : n.group === 'Data' ? '#38bdf8' : n.group === 'Systems' ? '#a855f7' : '#22d3ee';

      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      ctx.moveTo(-padX, -padY);
      ctx.lineTo(padX, -padY);
      ctx.lineTo(padX, padY);
      ctx.lineTo(-padX, padY);
      ctx.closePath();
      ctx.fillStyle = `${color}1a`;
      ctx.fill();
      ctx.lineWidth = 2 * dpr;
      ctx.strokeStyle = `${color}cc`;
      ctx.shadowBlur = 8 * dpr;
      ctx.shadowColor = `${color}88`;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#e5e7eb';
      ctx.font = `${Math.max(14, baseRadius * 0.14)}px Bangers, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, 0, 0);

      if (hoverId === n.id) {
        ctx.lineWidth = 2.5 * dpr;
        ctx.strokeStyle = '#ffffffcc';
        ctx.strokeRect(-padX - 6, -padY - 6, padX * 2 + 12, padY * 2 + 12);
      }
      ctx.restore();
    }

    function step(ts: number) {
      if (!parentEl || !c) return;
      const dpr = DPR(); ctx.clearRect(0, 0, c.width, c.height);
      const rect = parentEl.getBoundingClientRect(); const W = rect.width; const H = rect.height;
      for (const n of nodes.current) { if (!reduced) { n.x += n.vx; n.y += n.vy; if (n.x < n.r * 0.55 || n.x > W - n.r * 0.55) n.vx *= -1; if (n.y < n.r * 0.55 || n.y > H - n.r * 0.55) n.vy *= -1; if (hoverId === n.id) { n.x -= n.vx * 0.6; n.y -= n.vy * 0.6; } } }
      drawThreads(ts); for (const n of nodes.current) drawPrism(n, ts);
      if (!reduced && activeRef.current) rafRef.current = requestAnimationFrame(step);
    }

  function onMove(ev: PointerEvent) { if (!wrap) return; const rect = wrap.getBoundingClientRect(); const mx = ev.clientX - rect.left, my = ev.clientY - rect.top; let hit: string | null = null; for (const n of nodes.current) { if (Math.hypot(mx - n.x, my - n.y) < n.r * 0.55) { hit = n.id; break; } } setHoverId(hit); }
    function onLeave() { setHoverId(null); }

    wrap.addEventListener('pointermove', onMove); wrap.addEventListener('pointerleave', onLeave);
    resize(); if (!reduced && activeRef.current) rafRef.current = requestAnimationFrame(step); else step(0);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); wrap.removeEventListener('pointermove', onMove); wrap.removeEventListener('pointerleave', onLeave); ro.disconnect(); io.disconnect(); };
  }, [data, size, k, reduced, hoverId]);

  return <div ref={wrapRef} className="skills-prisms"><canvas ref={canvasRef} /></div>;
}
