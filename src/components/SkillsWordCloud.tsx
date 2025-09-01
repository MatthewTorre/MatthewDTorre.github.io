import React, { useEffect, useMemo, useRef } from 'react';
import { cloudSkills, palette } from '../data/skills-cloud';
import MultiverseThreads from './MultiverseThreads';
import '../styles/skills-cloud.css';

type Props = { items?: typeof cloudSkills };

export default function SkillsWordCloud({ items = cloudSkills }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const skills = useMemo(() => items.slice().sort(() => Math.random() - 0.5), [items]);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const bounds = wrap.getBoundingClientRect();
    const placed: DOMRect[] = [];

    function fits(r: DOMRect){
      return !placed.some(p => !(r.right < p.left || r.left > p.right || r.bottom < p.top || r.top > p.bottom));
    }

    // Place each tag randomly with simple rejection sampling
    const nodes = Array.from(wrap.querySelectorAll('.skill-node')) as HTMLElement[];
    nodes.forEach((el) => {
      const weight = Number(el.dataset.weight || '6');
      const w = Math.min(220, 60 + weight * 8);
      el.style.fontSize = `${Math.max(10, 6 + weight * 1.2)}px`;
      el.style.width = 'auto';
      // try up to N times to find non-overlapping spot
      for (let t = 0; t < 40; t++) {
        const x = Math.random() * (bounds.width - w - 20) + 10;
        const y = Math.random() * (bounds.height - 120) + 40;
        el.style.left = `${x}px`; el.style.top = `${y}px`;
        const r = el.getBoundingClientRect();
        const local = new DOMRect(r.left - bounds.left, r.top - bounds.top, r.width, r.height);
        if (!fits(local)) continue; placed.push(local); break;
      }
    });
  }, [skills]);

  return (
    <div ref={wrapRef} className="skills-cloud-wrap">
      {skills.map(s => (
        <span key={s.label} className="skill-node" data-weight={s.weight} style={{ color: palette[s.category] }}>
          <span className="prism" aria-hidden />
          <span className="label">{s.label}</span>
        </span>
      ))}
      {/* static multiversal threads connecting words (reduced density for perf) */}
      <MultiverseThreads cardSelector=".skill-node" hoverAttract={0} k={1} chainStride={2} staticMode />
    </div>
  );
}
