import React, { useEffect, useRef } from "react";

type Props = {
  cardSelector?: string; // default .project-card
  hoverAttract?: number; // 0..1
  k?: number;            // nearest neighbors per node
  staticMode?: boolean;  // draw once, no animation
  chainStride?: number;  // connect every Nth sequential pair (1 = all)
};

export default function MultiverseThreads({ cardSelector = ".project-card", hoverAttract = 0.25, k = 1, staticMode = false, chainStride = 1 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouse = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const nodesRef = useRef<{ x: number; y: number; el: Element }[]>([]);
  const edgesRef = useRef<{ a: number; b: number; seed: number }[]>([]);
  const reduceMotion = (typeof window !== "undefined" && !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) || staticMode;

  useEffect(() => {
  const wrap = wrapRef.current;
  const canvas = canvasRef.current;
  if (!wrap || !canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;
  // local non-null aliases for closures
  const parentEl = wrap.parentElement ?? wrap;
  const c = canvas;
  const ctx2 = ctx;

    // Behind cards
    wrap.style.position = "absolute";
    wrap.style.inset = "0";
    wrap.style.pointerEvents = "none";
    wrap.style.zIndex = "0";

  const ro = new ResizeObserver(() => resize());
  ro.observe(parentEl);

    const cardsRO = new ResizeObserver(() => rebuildGraph());
    document.querySelectorAll(cardSelector).forEach(el => cardsRO.observe(el));

    function DPR() { return Math.max(1, Math.min(2, window.devicePixelRatio || 1)); }

    function resize() {
      const rect = parentEl.getBoundingClientRect();
      const dpr = DPR();
      c.width = Math.max(1, Math.floor(rect.width * dpr));
      c.height = Math.max(1, Math.floor(rect.height * dpr));
      c.style.width = rect.width + "px";
      c.style.height = rect.height + "px";
      rebuildGraph();
      draw(0);
    }

    function getCards(): Element[] {
      const parent = parentEl || document;
      return Array.from(parent.querySelectorAll(cardSelector));
    }

    function centerOf(el: Element) {
      const parentRect = parentEl.getBoundingClientRect();
      const r = (el as HTMLElement).getBoundingClientRect();
      return { x: r.left - parentRect.left + r.width / 2, y: r.top - parentRect.top + Math.min(r.height / 2, 160) };
    }

    function rebuildGraph() {
      const els = getCards();
      nodesRef.current = els.map(el => ({ ...centerOf(el), el }));
      const n = nodesRef.current.length;
      const edges: { a: number; b: number; seed: number }[] = [];
      if (n <= 1) { edgesRef.current = []; return; }
      const stride = Math.max(1, Math.floor(chainStride));
      for (let i = 0; i < n - 1; i++) {
        if (i % stride === 0) edges.push({ a: i, b: i + 1, seed: Math.random() * 1000 });
      }
      for (let i = 0; i < n; i++) {
        const pi = nodesRef.current[i];
        const dists = nodesRef.current.map((p, j) => ({ j, d: i === j ? Infinity : (p.x - pi.x) ** 2 + (p.y - pi.y) ** 2 }));
        dists.sort((a, b) => a.d - b.d);
        for (let t = 0; t < k; t++) {
          const j = dists[t]?.j;
          if (j != null && j > i) edges.push({ a: i, b: j, seed: Math.random() * 1000 });
        }
      }
      edgesRef.current = edges;
    }

    function glowStroke(w: number, color: string) {
      ctx2.lineWidth = w; ctx2.strokeStyle = color; ctx2.shadowBlur = w * 1.25; ctx2.shadowColor = color; ctx2.globalCompositeOperation = "lighter";
    }
    function lineCore(w: number, color: string) {
      ctx2.lineWidth = w; ctx2.strokeStyle = color; ctx2.shadowBlur = 0; ctx2.globalCompositeOperation = "lighter";
    }

    function bezierFrom(a: { x: number; y: number }, b: { x: number; y: number }, t: number, seed: number) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const wobble = 18 + 22 * Math.sin(0.0008 * seed + t * 0.0017);
      const attract = mouse.current.active ? hoverAttract * Math.exp(-Math.hypot(mx - mouse.current.x, my - mouse.current.y) / 380) : 0;
      const ox = (wobble * (0.5 + 0.5 * Math.sin(seed + t * 0.001)) + attract * (mouse.current.x - mx)) * nx;
      const oy = (wobble * (0.5 + 0.5 * Math.cos(seed * 1.7 + t * 0.0013)) + attract * (mouse.current.y - my)) * ny;
      return { c1x: mx + ox, c1y: my + oy, c2x: mx - ox, c2y: my - oy };
    }

    function draw(ts: number) {
      const dpr = DPR();
      ctx2.clearRect(0, 0, c.width, c.height);
      const nodes = nodesRef.current; const edges = edgesRef.current;

      // node glows
      ctx2.globalCompositeOperation = "lighter";
      for (const p of nodes) {
        const r = 12 * dpr;
        const g = ctx2.createRadialGradient(p.x * dpr, p.y * dpr, 0, p.x * dpr, p.y * dpr, r);
        g.addColorStop(0, "rgba(160,200,255,0.75)");
        g.addColorStop(1, "rgba(160,200,255,0)");
        ctx2.fillStyle = g;
        ctx2.beginPath(); ctx2.arc(p.x * dpr, p.y * dpr, r, 0, Math.PI * 2); ctx2.fill();
      }

      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b]; if (!a || !b) continue;
        const { c1x, c1y, c2x, c2y } = bezierFrom(a, b, ts, e.seed);
        // Animated hue per edge
        const hue = (e.seed * 137.5 + ts * 0.02) % 360;
  ctx2.beginPath();
  ctx2.moveTo(a.x * dpr, a.y * dpr);
  ctx2.bezierCurveTo(c1x * dpr, c1y * dpr, c2x * dpr, c2y * dpr, b.x * dpr, b.y * dpr);
        // layered glow with triadic hues
  glowStroke(6 * dpr, `hsla(${(hue + 260) % 360}, 100%, 65%, 0.42)`); ctx2.stroke();
  glowStroke(4 * dpr, `hsla(${(hue + 160) % 360}, 100%, 60%, 0.32)`); ctx2.stroke();
  glowStroke(3 * dpr, `hsla(${(hue + 40) % 360}, 100%, 64%, 0.28)`); ctx2.stroke();
  // core
  lineCore(1.4 * dpr, `hsla(${hue}, 100%, 95%, 0.95)`); ctx2.stroke();

        // pulse orbs in edge hue
        const phase = (ts * 0.00025 + (e.seed % 1)) % 1;
        const pcount = 2;
        for (let i = 0; i < pcount; i++) {
          const t = (phase + i / pcount) % 1;
          const x = cubicAt(a.x, c1x, c2x, b.x, t);
          const y = cubicAt(a.y, c1y, c2y, b.y, t);
          const grad = ctx2.createRadialGradient(x * dpr, y * dpr, 0, x * dpr, y * dpr, 20 * dpr);
          grad.addColorStop(0, `hsla(${hue}, 100%, 80%, 0.95)`);
          grad.addColorStop(1, `hsla(${hue}, 100%, 80%, 0)`);
          ctx2.fillStyle = grad; ctx2.beginPath(); ctx2.arc(x * dpr, y * dpr, 20 * dpr, 0, Math.PI * 2); ctx2.fill();
        }
      }

    if (!reduceMotion) rafRef.current = requestAnimationFrame(draw);
    }

    function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number) {
      const it = 1 - t; return it * it * it * p0 + 3 * it * it * t * p1 + 3 * it * t * t * p2 + t * t * t * p3;
    }

    function onMove(ev: MouseEvent) {
      const parent = parentEl.getBoundingClientRect();
      mouse.current.x = ev.clientX - parent.left; mouse.current.y = ev.clientY - parent.top; mouse.current.active = true;
    }
    function onLeave() { mouse.current.active = false; }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    resize();
    if (!reduceMotion) rafRef.current = requestAnimationFrame(draw); else draw(0);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      ro.disconnect(); cardsRO.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cardSelector, hoverAttract, k, chainStride]);

  return (
    <div ref={wrapRef} className="mv-threads-wrap"><canvas ref={canvasRef} className="mv-threads-canvas" /></div>
  );
}
