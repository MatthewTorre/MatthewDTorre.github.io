import React, { useEffect, useRef, useState } from "react";

type TabKey =
  | "All"
  | "Deep Learning"
  | "Classical ML"
  | "Reinforcement Learning"
  | "Hyperparameter Tuning"
  | "Product"
  | "Agile"
  | "Compliance";

const ROUTE: Record<TabKey, { bullet: string; bg: string; fg: string }> = {
  All:                      { bullet: "L", bg: "#A7A9AC", fg: "#111" }, // L (gray)
  "Deep Learning":          { bullet: "D", bg: "#0039A6", fg: "#fff" }, // A (blue)
  "Classical ML":           { bullet: "C", bg: "#B933AD", fg: "#fff" }, // purple
  "Reinforcement Learning": { bullet: "R", bg: "#EE352E", fg: "#fff" }, // red
  "Hyperparameter Tuning":  { bullet: "H", bg: "#00A65C", fg: "#fff" }, // green
  Product:                   { bullet: "N", bg: "#FCCC0A", fg: "#111" }, // N (yellow)
  Agile:                     { bullet: "F", bg: "#FF6319", fg: "#fff" }, // F (orange)
  Compliance:                { bullet: "6", bg: "#00933C", fg: "#fff" }, // 6 (green)
};

export default function SubwayTabs({
  value = "All",
  onChange,
}: {
  value?: TabKey;
  onChange?: (v: TabKey) => void;
}) {
  const tabs: TabKey[] = [
    "All",
    "Deep Learning",
    "Classical ML",
    "Reinforcement Learning",
    "Hyperparameter Tuning",
    "Product",
    "Agile",
    "Compliance",
  ];
  const [current, setCurrent] = useState<TabKey>(value);
  const railRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => setCurrent(value), [value]);

  const set = (k: TabKey) => { setCurrent(k); onChange?.(k); };

  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.indexOf(current);
    if (e.key === "ArrowRight") set(tabs[(i + 1) % tabs.length]);
    if (e.key === "ArrowLeft")  set(tabs[(i - 1 + tabs.length) % tabs.length]);
  };

  return (
    <div className="mta-tabs" role="tablist" aria-label="Filter certifications">
      <div className="mta-rail" ref={railRef} onKeyDown={onKey} tabIndex={0}>
        {/* route line behind buttons */}
        <div className="mta-route-line" aria-hidden />
        {tabs.map((k) => {
          const r = ROUTE[k];
          return (
            <button
              key={k}
              ref={(el) => (btnRefs.current[k] = el)}
              type="button"
              role="tab"
              aria-selected={current === k}
              className={`mta-tab ${current === k ? "is-active" : ""}`}
              onClick={() => set(k)}
            >
              <span
                className="mta-bullet"
                style={{ background: r.bg, color: r.fg }}
                aria-hidden="true"
              >
                {r.bullet}
              </span>
              <span className="mta-label">{k}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
