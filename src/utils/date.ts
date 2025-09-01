export function formatMonthYear(iso?: string): string | undefined {
  if (!iso) return undefined;
  const [y, m] = iso.split('-').map(Number);
  if (!y || !m) return undefined;
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
}

export function computeDuration(start?: string, end?: string | 'Present'): string | undefined {
  if (!start) return undefined;
  const s = parseYM(start);
  const e = end && end !== 'Present' ? parseYM(end as string) : new Date();
  if (!s || !e) return undefined;
  let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const yr = years ? `${years} yr${years > 1 ? 's' : ''}` : '';
  const mo = rem ? `${rem} mo${rem > 1 ? 's' : ''}` : '';
  return [yr, mo].filter(Boolean).join(' ').trim() || '0 mos';
}

function parseYM(ym: string): Date | undefined {
  const [y, m] = ym.split('-').map(Number);
  if (!y || !m) return undefined;
  return new Date(y, m - 1, 1);
}

