import React, { useEffect, useMemo, useRef, useState } from 'react';
import { skills as DEFAULT_SKILLS, type SkillNode } from '../data/skills';

type Props = { items?: SkillNode[]; size?: number; k?: number };

export default function SkillsPrisms({ items = DEFAULT_SKILLS, size = 150, k = 2 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
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
      for (const e of edges.current) {
        const a = nodes.current[e.a], b = nodes.current[e.b]; if (!a || !b) continue;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const wob = 18 + 22 * Math.sin(0.0008 * e.seed + ts * 0.0017);
        const ox = wob * nx, oy = wob * ny;
        const c1x = mx + ox, c1y = my + oy; const c2x = mx - ox, c2y = my - oy;

        ctx.beginPath(); ctx.moveTo(a.x * dpr, a.y * dpr); ctx.bezierCurveTo(c1x * dpr, c1y * dpr, c2x * dpr, c2y * dpr, b.x * dpr, b.y * dpr);
        const hue = (e.seed * 0.5 + ts * 0.02) % 360;
        glowStroke(6 * dpr, `hsla(${(hue + 260) % 360},100%,65%,.45)`); ctx.stroke();
        glowStroke(4 * dpr, `hsla(${(hue + 160) % 360},100%,60%,.34)`); ctx.stroke();
        glowStroke(3 * dpr, `hsla(${(hue + 40) % 360},100%,64%,.28)`); ctx.stroke();
        coreStroke(1.4 * dpr, `hsla(${hue},100%,95%,.95)`); ctx.stroke();

        const phase = (ts * 0.00025 + (e.seed % 1)) % 1; const pcount = 2;
        for (let i = 0; i < pcount; i++) { const t = (phase + i / pcount) % 1; const x = cubicAt(a.x, c1x, c2x, b.x, t); const y = cubicAt(a.y, c1y, c2y, b.y, t); const g = ctx.createRadialGradient(x * dpr, y * dpr, 0, x * dpr, y * dpr, 20 * dpr); g.addColorStop(0, `hsla(${hue},100%,85%,.95)`); g.addColorStop(1, `hsla(${hue},100%,85%,0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x * dpr, y * dpr, 20 * dpr, 0, Math.PI * 2); ctx.fill(); }
      }
    }

    function drawPrism(n: (typeof nodes.current)[number], ts: number) {
      const dpr = DPR(); const cx = n.x * dpr, cy = n.y * dpr, rad = n.r * dpr; const sides = 6; const depth = rad * 0.26; const tilt = Math.sin(ts * 0.001 + n.spin * 3000) * 0.15;
      const pts: Array<[number, number]> = []; for (let i = 0; i < sides; i++) { const a = (i / sides) * Math.PI * 2 + tilt; pts.push([cx + Math.cos(a) * rad * 0.55, cy + Math.sin(a) * rad * 0.55]); }
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad * 0.9); halo.addColorStop(0, 'rgba(255,180,80,.16)'); halo.addColorStop(1, 'rgba(255,180,80,0)'); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, rad * 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < sides; i++) { const a = pts[i], b = pts[(i + 1) % sides]; const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + depth]; const grad = ctx.createLinearGradient(a[0], a[1], mid[0], mid[1]); grad.addColorStop(0, 'rgba(255,255,255,.05)'); grad.addColorStop(1, 'rgba(255,120,0,.12)'); ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(mid[0], mid[1]); ctx.closePath(); ctx.fill(); }
      const topFill = ctx.createLinearGradient(cx, cy - rad * 0.4, cx, cy + rad * 0.4); topFill.addColorStop(0, 'rgba(255,255,255,.08)'); topFill.addColorStop(1, 'rgba(255,120,0,.08)'); ctx.fillStyle = topFill; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 18 * dpr; ctx.lineWidth = 2.5 * dpr; ctx.strokeStyle = 'rgba(255,190,80,.9)'; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.stroke(); ctx.shadowBlur = 28 * dpr; ctx.lineWidth = 1.6 * dpr; ctx.strokeStyle = 'rgba(255,220,130,.8)'; ctx.beginPath(); for (let i = 0; i < sides; i++) { const a = pts[i], b = pts[(i + 1) % sides]; const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + depth]; ctx.moveTo(a[0], a[1]); ctx.lineTo(mid[0], mid[1]); } ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'source-over'; ctx.font = `${Math.max(14, n.r * 0.16)}px Bangers, system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(n.label, cx, cy); ctx.fillStyle = '#fff'; ctx.fillText(n.label, cx, cy);
      if (hoverId === n.id) { ctx.globalCompositeOperation = 'lighter'; ctx.shadowBlur = 36 * dpr; ctx.lineWidth = 2.4 * dpr; ctx.strokeStyle = 'rgba(255,160,60,1)'; ctx.beginPath(); ctx.arc(cx, cy, rad * 0.62, 0, Math.PI * 2); ctx.stroke(); }
    }

    function step(ts: number) {
      if (!parentEl || !c) return;
      const dpr = DPR(); ctx.clearRect(0, 0, c.width, c.height);
      const rect = parentEl.getBoundingClientRect(); const W = rect.width; const H = rect.height;
      for (const n of nodes.current) { if (!reduced) { n.x += n.vx; n.y += n.vy; if (n.x < n.r * 0.55 || n.x > W - n.r * 0.55) n.vx *= -1; if (n.y < n.r * 0.55 || n.y > H - n.r * 0.55) n.vy *= -1; if (hoverId === n.id) { n.x -= n.vx * 0.6; n.y -= n.vy * 0.6; } } }
      drawThreads(ts); for (const n of nodes.current) drawPrism(n, ts);
      if (!reduced) rafRef.current = requestAnimationFrame(step);
    }

  function onMove(ev: PointerEvent) { if (!wrap) return; const rect = wrap.getBoundingClientRect(); const mx = ev.clientX - rect.left, my = ev.clientY - rect.top; let hit: string | null = null; for (const n of nodes.current) { if (Math.hypot(mx - n.x, my - n.y) < n.r * 0.55) { hit = n.id; break; } } setHoverId(hit); }
    function onLeave() { setHoverId(null); }

    wrap.addEventListener('pointermove', onMove); wrap.addEventListener('pointerleave', onLeave);
    resize(); if (!reduced) rafRef.current = requestAnimationFrame(step); else step(0);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); wrap.removeEventListener('pointermove', onMove); wrap.removeEventListener('pointerleave', onLeave); ro.disconnect(); };
  }, [data, size, k, reduced, hoverId]);

  return <div ref={wrapRef} className="skills-prisms"><canvas ref={canvasRef} /></div>;
}
