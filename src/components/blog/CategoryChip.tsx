import React from 'react';
export default function CategoryChip({ label, href }: { label: string; href: string }){
  return <a className="badge-chip" href={href} role="button" aria-pressed="false">{label}</a>;
}
