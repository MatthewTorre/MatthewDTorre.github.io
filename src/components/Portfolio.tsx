import React, { useEffect, useMemo, useRef, useState } from 'react';
import Typewriter from './Typewriter';
import { useInView } from '../hooks/useInView';
import { projects } from '../data/projects';
import { resolveCoverCandidates } from '../utils/images';
import MultiverseThreads from './MultiverseThreads';
import '../styles/multiverse-threads.css';

const Portfolio: React.FC = () => {
  const { ref, inView } = useInView();
  const [openId, setOpenId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  // Deep-link open on load (#project=<id>)
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const m = hash.match(/project=([^&]+)/);
    if (m && m[1]) {
      const id = decodeURIComponent(m[1]);
      const exists = projects.some(p => p.id === id);
      if (exists) setOpenId(id);
    }
  }, []);

  // Update URL hash when opening/closing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const base = window.location.href.replace(/#.*$/, '');
    if (openId) {
      const url = `${base}#project=${encodeURIComponent(openId)}`;
      window.history.replaceState(null, '', url);
    } else {
      // Keep page hash clean (back to section if present)
      const url = `${base}#projects`;
      window.history.replaceState(null, '', url);
    }
  }, [openId]);

  const sectionRef = ref as any;
  return (
    <section id="projects" ref={sectionRef} className="verse-section-alt">
      <div className="verse-container">
        <h2 className="verse-heading"><Typewriter text="Projects" trigger={inView} /></h2>
        <p className="projects-graffiti-sub" style={{marginTop: 0}}>
          if you want to jump down some rabit holes...
        </p>
        <div className="projects-section">
          <div className="card-grid" aria-live="polite">
            {/* Removed demo flip-card per request */}
            {projects.map((p, idx) => (
              <ProjectCard
                key={p.id}
                idx={idx}
                inView={inView}
                project={p}
                expanded={openId === p.id}
                setExpanded={(val) => setOpenId(val ? p.id : null)}
                registerRef={(el) => { cardRefs.current[p.id] = el; }}
              />
            ))}
          </div>
          {/* Overlay threads behind cards */}
          <MultiverseThreads cardSelector=".project-card" hoverAttract={0.28} k={2} />
        </div>
      </div>
    </section>
  );
};

type CardProps = {
  idx: number;
  inView: boolean;
  project: (typeof projects)[number];
  expanded: boolean;
  setExpanded: (open: boolean) => void;
  registerRef: (el: HTMLElement | null) => void;
};

const PROJECT_LINKS: Record<string, string> = {
  'qaoa-tsp': 'https://github.com/MatthewTorre/Quantum-Approximate-Optimization-Algorithm-As-Applied-to-Traveling-Salesman-Problem/blob/main/physics_14n_qaoa_demo_for_solving_tsp.py',
  'world-football-ml': 'https://github.com/MatthewTorre/Selecting-the-Best-Players-in-the-World-Football/blob/main/cs109_final_project.py',
  'ezrecruit': 'https://docs.google.com/presentation/d/1vw-bSd_MeicdB-DcdcqvNBCdJaU1Mp7Sae0AFPi74Sk/edit?usp=sharing',
  'ufc-outcomes': 'https://github.com/austin-salcedo/CS221-UFC-Project/blob/main/project.py',
};

const ProjectCard: React.FC<CardProps> = ({ idx, inView, project: p, expanded, setExpanded, registerRef }) => {
  const show = inView;
  const delay = `${Math.min(idx * 120, 800)}ms`;
  const candidates = useMemo(() => {
    if ((p as any).cover) {
      return [(p as any).cover as string];
    }
    return resolveCoverCandidates(p.coverKey || p.id);
  }, [p.coverKey, p.id, (p as any).cover]);
  const [srcIndex, setSrcIndex] = useState(0);
  const imgSrc = useMemo(() => {
    const src = candidates[srcIndex];
    // Only prefix PUBLIC_URL for public assets under /images; imported assets should be used as-is
    if (src.startsWith('/images/')) return (process.env.PUBLIC_URL || '') + src;
    return src;
  }, [candidates, srcIndex]);
  const descId = `project-desc-${p.id}`;
  // Prefer the first attachment link if present; fall back to hardcoded map
  const href = (p.attachments && p.attachments[0]?.href) || PROJECT_LINKS[p.id];
  const onToggle = () => setExpanded(!expanded);
  // Parse key skills from description
  const full = String(((p as any).description || (p as any).details || '')).trim();
  const m = full.match(/Key\s*Skills\s*Built:\s*([\s\S]*)$/i);
  const skills = m ? m[1].replace(/\n/g, ' ').split(',').map(s => s.trim()).filter(Boolean) : [];
  const body = (m ? full.replace(m[0], '').trim() : full).trim();
  const onKey: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
    if (e.key === 'Escape' && expanded) { e.preventDefault(); setExpanded(false); }
  };
  return (
    <article
      ref={registerRef}
      className={`verse-card cover-card project-card ${show ? 'reveal' : ''} ${expanded ? 'expanded' : ''}`}
      style={{ transitionDelay: delay }}
      onClick={onToggle}
      onKeyDown={onKey}
      tabIndex={0}
      role={'button'}
      aria-expanded={expanded}
      aria-controls={descId}
    >
      <img
        src={imgSrc}
        alt={p.title}
        className={`cover-image ${p.id === 'synced-in' ? 'cover-contain' : ''}`}
        loading="lazy"
        onError={() => setSrcIndex(i => Math.min(i + 1, candidates.length - 1))}
      />
      <div className="project-meta">
        <h3 className="card-title">{p.title}</h3>
        <p className="project-sub">{p.org}{p.org && (p.dates || p.date) ? ' • ' : ''}{p.dates || p.date}</p>
        {/* Show rich front-side description derived from full body (first paragraph) */}
        <p className="card-desc line-clamp-4">{(body.split(/\n\n/)[0] || p.snippet || p.summary)}</p>
        {skills.length ? (
          <ul className="skills-row" aria-label="Key skills built">
            {skills.slice(0, 5).map(s => (<li key={s} className="skill-chip" title={s}>{s}</li>))}
            {skills.length > 5 ? <li className="skill-chip more">+{skills.length - 5}</li> : null}
          </ul>
        ) : null}
        {((p as any).attachments?.length || (p as any).links?.length) ? (
          <div className="project-links-inline" onClick={(e) => e.stopPropagation()}>
            {(((p as any).attachments as any[]) ?? (p as any).links ?? []).map((l: any) => (
              <a key={l.href} className="neon-btn" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
        {/* Details toggle to reveal full description without leaving page */}
        <div>
          <button
            type="button"
            className="neon-btn"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            aria-expanded={expanded}
            aria-controls={descId}
          >
            {expanded ? 'Hide Details' : 'Details →'}
          </button>
        </div>
      </div>
      <div
        id={descId}
        role="region"
        aria-label={`Details for ${p.title}`}
        className={`project-details-wrap ${expanded ? 'open' : ''}`}
      >
        {body && (
          <p className="card-desc" style={{marginTop: '0.4rem'}}>
            {body}
          </p>
        )}
        {skills.length ? (
          <div style={{marginTop: '.6rem'}}>
            <strong>Key Skills Built</strong>
            <ul className="skills-row" aria-label="Key skills built">
              {skills.map(s => (<li key={s} className="skill-chip" title={s}>{s}</li>))}
            </ul>
          </div>
        ) : null}
        {((p as any).attachments?.length || (p as any).links?.length) ? (
          <div className="project-links">
            {(((p as any).attachments as any[]) ?? (p as any).links ?? []).map((l: any) => (
              <a key={l.href} className="neon-btn" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default Portfolio;
