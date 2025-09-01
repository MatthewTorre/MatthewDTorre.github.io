import React from "react";

type Variant = "product" | "ai" | "se"; // software engineering

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant: Variant;
  pressed?: boolean;
}

export default function GraffitiCallout({
  label,
  variant,
  pressed = false,
  className = "",
  onMouseMove,
  ...rest
}: Props) {
  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    onMouseMove?.(e);
  };

  return (
    <button
      type="button"
      data-variant={variant}
      aria-pressed={pressed}
      className={`graffiti-callout ${pressed ? "is-pressed" : ""} ${className}`}
      onMouseMove={handleMove}
      {...rest}
    >
      <span className="gc__label">{label}</span>
    </button>
  );
}

