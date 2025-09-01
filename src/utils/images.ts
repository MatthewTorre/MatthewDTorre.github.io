// Helper to resolve cover image candidates for a given key
// Usage: provide a base filename without extension; we will try common extensions.
// We return an ordered list so callers can attempt fallbacks on <img onError>.
export function resolveCoverCandidates(coverKey?: string): string[] {
  if (!coverKey) return [placeholderCover()];
  const base = `/images/projects/${coverKey}`;
  return [
    `${base}.webp`,
    `${base}.jpg`,
    `${base}.jpeg`,
    `${base}.png`,
    placeholderCover(),
  ];
}

export function placeholderCover(): string {
  // Use the existing SVG placeholder shipped in public/images/projects
  return `/images/projects/placeholder.svg`;
}
