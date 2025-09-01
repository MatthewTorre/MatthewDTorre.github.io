import React, { useEffect, useMemo, useRef, useState } from 'react';
import ResumePDF from '../assets/images/Matthew_Torre_Resume_UPDATED.pdf';
import { Experience, XpCategory } from '../data/experience';
import { resolveLogoPath } from '../utils/logos';
import { useInView } from '../hooks/useInView';

type SpideyFX = {
  level?: 'low' | 'medium' | 'high';
  showOnomatopoeia?: boolean;
  parallaxTilt?: boolean;
};

type Props = {
  items: Experience[];
  groupByYear?: boolean;
  defaultOpenId?: string;
  fx?: SpideyFX;
};

export const ExperienceTimeline: React.FC<Props> = ({ items, groupByYear = true, defaultOpenId, fx }) => {
  const [activeCat, setActiveCat] = useState<XpCategory | 'All'>('All');
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const spideyFX: Required<SpideyFX> = {
    level: 'medium',
    showOnomatopoeia: false,
    parallaxTilt: true,
    ...(fx || {}),
  };

  // Deep-link open on load (#exp=<id>)
  useEffect(() => {
    if (defaultOpenId) return; // already set
    const m = window.location.hash.match(/exp=([^&]+)/);
    if (m?.[1]) setOpenId(decodeURIComponent(m[1]));
  }, [defaultOpenId]);

  // Update hash on change
  useEffect(() => {
    const base = window.location.href.replace(/#.*$/, '');
    if (openId) {
      window.history.replaceState(null, '', `${base}#exp=${encodeURIComponent(openId)}`);
      // Scroll into view with slight offset (header)
      const el = itemRefs.current[openId];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.history.replaceState(null, '', `${base}#about`);
    }
  }, [openId]);

  const filtered = useMemo(() => {
    if (activeCat === 'All') return items;
    return items.filter((it) => (it.cats || []).includes(activeCat));
  }, [items, activeCat]);

  const groups = useMemo(() => {
    if (!groupByYear) {
      const r: Record<string, Experience[]> = { all: filtered };
      return r;
    }
    const g: Record<string, Experience[]> = {};
    for (const it of filtered) {
      const y = (it.start || it.datesLabel || '').slice(0, 4) || 'Other';
      g[y] = g[y] || [];
      g[y].push(it);
    }
    return g;
  }, [filtered, groupByYear]);

  const years = groupByYear ? Object.keys(groups).sort((a,b) => Number(b)-Number(a)) : ['all'];

  return (
    <section id="experience" className="verse-section" aria-labelledby="xp-heading">
      <div className="verse-container xp-legend-hdr">
        <div className="xp-legend-inner">
          <div className="xp-legend-title">
            <h2 id="xp-heading" className="verse-heading" style={{marginBottom: 0}}>Experience Map</h2>
          </div>
          <div className="xp-legend" role="tablist" aria-label="Filter experience">
            {(['All','Internship','Fellowship','Research','Leadership','Product','AI/ML','Data','Systems'] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={activeCat === k}
                className={`xp-legend-chip ${activeCat === k ? 'is-active' : ''}`}
                onClick={() => setActiveCat(k as any)}
              >
                <span className="dot" data-cat={k}></span>
                <span className="label">{k}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="verse-container xp-wrap" role="list">
        <div className="xp-spine timeline-spine" aria-hidden />
        {years.map((year) => (
          <React.Fragment key={year}>
            {groupByYear && (
              <div className="xp-year" aria-hidden>{year}</div>
            )}
            {(groupByYear ? groups[year] : (groups as Record<string, Experience[]> )['all']).map((it: Experience, idx: number) => (
              <ExperienceItem
                key={it.id}
                item={it}
                align={(idx % 2) ? 'left' : 'right'}
                expanded={openId === it.id}
                index={idx}
                onToggle={(v) => setOpenId(v ? it.id : null)}
                registerRef={(el) => { itemRefs.current[it.id] = el; }}
                fx={spideyFX}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="verse-container" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <a
          className="neon-btn neon-btn--lg"
          href={ResumePDF}
          download="Matthew_Torre_Resume.pdf"
          aria-label="Download Matthew Torre résumé as PDF"
        >
          Download Résumé
        </a>
      </div>
    </section>
  );
};

type ItemProps = {
  item: Experience;
  align: 'left' | 'right';
  expanded: boolean;
  index: number;
  onToggle: (open: boolean) => void;
  registerRef: (el: HTMLDivElement | null) => void;
  fx: Required<SpideyFX>;
};

let webSeqCounter = 0;

export const ExperienceItem: React.FC<ItemProps> = ({ item, align, expanded, index, onToggle, registerRef, fx }) => {
  const id = `xp-${item.id}`;
  const descId = `xp-desc-${item.id}`;
  // Dates and duration removed per request (no months or time worked shown)
  const [logoSrcIdx, setLogoSrcIdx] = useState(0);
  const [burstShown, setBurstShown] = useState(false);
  const candidates = useMemo(() => {
    const base = resolveLogoPath(item.logoKey);
    if (!base) return [] as string[];
    const root = base.replace(/\.(webp|png|jpg|jpeg)$/i, '');
    return [`${root}.webp`, `${root}.png`, `${root}.jpg`, `${root}.jpeg`];
  }, [item.logoKey]);
  const logoSrc = candidates[logoSrcIdx];

  // Reveal on in-view
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  const [revealed, setRevealed] = useState(false);
  const [webDelay, setWebDelay] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (inView && !revealed) {
      setRevealed(true);
      // Assign a sequential delay so webs draw one-by-one as items reveal
      const delayMs = (webSeqCounter++) * 160; // 160ms between connections
      setWebDelay(`${delayMs}ms`);
    }
  }, [inView, revealed]);

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(!expanded); }
    if (e.key === 'Escape' && expanded) { e.preventDefault(); onToggle(false); }
  };

  const itemStyle: any = {
    '--reveal-delay': `${Math.min(index * (fx.level === 'high' ? 110 : fx.level === 'low' ? 60 : 90), 800)}ms`,
    '--web-delay': webDelay ?? undefined,
  };
  const cardTiltStyle: any = { '--tilt': `${fx.parallaxTilt ? (align === 'left' ? -0.4 : 0.4) : 0}deg` };

  return (
    <div ref={(el) => { registerRef(el); (ref as any).current = el; }}
         className={`xp-item ${align} ${revealed ? 'reveal' : ''}`}
         role="listitem"
         style={itemStyle}>
      <div className="xp-node timeline-node" aria-hidden>
        {logoSrc ? (
          <img src={logoSrc} alt="" onError={() => setLogoSrcIdx(i => Math.min(i + 1, Math.max(0, candidates.length - 1)))} />
        ) : (
          <div className="xp-node-fallback" aria-hidden>{abbr(item.org)}</div>
        )}
      </div>
      {/* Web strand connecting node to card */}
      <svg className={`xp-web ${align}`} viewBox="0 0 120 60" aria-hidden>
        <path d={align === 'left' ? 'M110,30 C75,10 60,10 10,30' : 'M10,30 C45,10 60,10 110,30'}
              vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Starburst behind card on first open or reveal */}
      {(revealed || expanded) && (
        <img
          src={(process.env.PUBLIC_URL || '') + '/svg/starburst.svg'}
          className={`xp-burst ${burstShown ? 'settled' : ''}`}
          alt=""
          aria-hidden
          onAnimationEnd={() => setBurstShown(true)}
        />
      )}

      <div className={`xp-card verse-card exp-card graffiti ${expanded ? 'is-open' : ''}`} style={cardTiltStyle}>
        {/* FX layers under content */}
        <div className="xp-card__fx fx-halftone" aria-hidden />
        <div className="xp-card__fx fx-splatter" aria-hidden>
          <img src={(process.env.PUBLIC_URL || '') + '/svg/splatter-1.svg'} className="fx-splatter-img s1" alt="" />
          <img src={(process.env.PUBLIC_URL || '') + '/svg/splatter-2.svg'} className="fx-splatter-img s2" alt="" />
        </div>
        <img className="xp-card__tape tape--lt" aria-hidden alt="" src={(process.env.PUBLIC_URL || '') + '/svg/tape-corner-left.svg'} />
        <img className="xp-card__tape tape--rb" aria-hidden alt="" src={(process.env.PUBLIC_URL || '') + '/svg/tape-corner-right.svg'} />
        <button
          id={id}
          className="xp-card-header"
          onClick={() => onToggle(!expanded)}
          onKeyDown={onKeyDown}
          aria-expanded={expanded}
          aria-controls={descId}
        >
          <div className="xp-card-heading">
            <div className="xp-title graffiti-tag">{item.title}</div>
            <div className="xp-org">{item.org}</div>
          </div>
          {/* Removed org chip per request */}
        </button>
        <div
          id={descId}
          role="region"
          aria-label={`Details for ${item.title} at ${item.org}`}
          className={`xp-details ${expanded ? 'open' : ''}`}
        >
          {item.summary && <p className="card-desc" style={{marginTop: 0}}>{item.summary}</p>}
          {item.details?.length && (
            <ul className="xp-bullets">
              {item.details.map((d) => (<li key={d}>{d}</li>))}
            </ul>
          )}
          {(item.skills?.length || item.links?.length) && (
            <div className="xp-footer">
              {item.skills?.length ? (
                <ul className="badge-cloud">
                  {item.skills.map(s => (<li key={s} className="badge-chip">{s}</li>))}
                </ul>
              ) : null}
              {item.links?.length ? (
                <div className="project-links">
                  {item.links.map(l => (
                    <a key={l.href} className="neon-btn" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      {/* Date chip removed per request */}
      {fx.showOnomatopoeia && revealed && (
        <div className={`xp-onom ${align}`} aria-hidden>{index % 3 === 0 ? 'THWIP!' : index % 3 === 1 ? 'BAM!' : 'ZAP!'}</div>
      )}
    </div>
  );
};

function abbr(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map(s => s[0]!.toUpperCase()).join('');
  return letters || '•';
}

export default ExperienceTimeline;
