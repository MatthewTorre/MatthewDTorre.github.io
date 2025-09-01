import React, { useMemo, useState } from "react";
import { visibleCertifications as items, type CertTag, type Certification } from "../data/certifications";
import "../styles/certs-graffiti.css";
import SubwayTabs from "./SubwayTabs";
import "../styles/mta-tabs.css";

const TAGS: CertTag[] = [
  "Deep Learning",
  "Classical ML",
  "Reinforcement Learning",
  "Hyperparameter Tuning",
  "Product",
  "Agile",
  "Compliance",
];

export default function CertificationsSection() {
  const [filter, setFilter] = useState<CertTag | "All">("All");

  const data = useMemo(() => {
    const sorted = [...items].sort((a, b) => (b.issued > a.issued ? 1 : -1));
    if (filter === "All") return sorted;
    return sorted.filter((c) => c.tags.includes(filter as CertTag));
  }, [filter]);

  return (
    <section id="certs" className="certs certs--graffiti" aria-labelledby="certs-heading">
      {/* Graffiti tab heading (visual). Keep semantic h2 for a11y. */}
      <div className="certs__tab" aria-hidden>CERTIFICATIONS</div>
      <header className="certs__hdr">
        <h2 id="certs-heading" className="sr-only">Certifications</h2>
        <SubwayTabs value={filter as any} onChange={(k) => setFilter(k as any)} />
      </header>

      <ul className="certs__grid">
        {data.map((c) => (
          <CertCard key={c.id} c={c} />
        ))}
      </ul>
    </section>
  );
}

function fmt(ym?: string) {
  if (!ym) return "";
  const [y, m] = ym.split("-").map((n) => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, 1).toLocaleString(undefined, { month: "short", year: "numeric" });
}

function fmtText(s: string) {
  // Replace spaced hyphens with en-dash; single hyphens in words left intact
  return s.replace(/\s-\s/g, " – ").replace(/\s--\s/g, " — ");
}

// Static certification card (no flip) with balanced layout
function CertCard({ c }: { c: Certification }) {
  const text = (c.long || c.context || '').trim();
  // Extract skills from trailing "Key Skills Built:" line(s)
  const m = text.match(/Key\s*Skills\s*Built:\s*([\s\S]*)$/i);
  const skills = m ? m[1].replace(/\n/g, ' ').split(',').map(s => s.trim()).filter(Boolean) : [];
  const body = (m ? text.replace(m[0], '').trim() : text).trim();
  // Take the first sentence for the front summary
  const front = body.split(/(?<=\.)\s/)[0] || body;
  return (
    <li className={`cert tag-${(c.tags[0] || 'misc').toLowerCase().replace(/[^a-z]/g, '')}`}>
      <div className="cert__body">
        <h3 className="cert__title">{fmtText(c.title)}</h3>
        <p className="cert__context">{fmtText(front)}</p>
        {skills.length ? (
          <ul className="skills-row" aria-label="Key skills built">
            {skills.slice(0, 5).map(s => {
              const label = s.replace(/\)\s*$/, '').trim();
              return (
                <li key={label} className="skill-chip" title={label}>{label}</li>
              );
            })}
            {skills.length > 5 ? <li className="skill-chip more">+{skills.length - 5}</li> : null}
          </ul>
        ) : null}
      </div>
    </li>
  );
}
