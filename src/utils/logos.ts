export function resolveLogoPath(key?: string): string | undefined {
  if (!key) return undefined;
  // Use PUBLIC_URL for correct base path in production (e.g., GitHub Pages)
  const base = `${(process.env.PUBLIC_URL || '')}/images/logos/${key}`;
  // Return root without extension so callers can try common formats.
  return base;
}
