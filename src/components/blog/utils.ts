import { BlogFrontmatter, BlogIndex, BlogPost } from './types';

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function parseFrontmatter(md: string): { meta: BlogFrontmatter; body: string } {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('Missing frontmatter');
  const yaml = m[1];
  const body = m[2] || '';
  const meta: any = {};
  yaml.split(/\r?\n/).forEach((line) => {
    const mm = line.match(/^([a-zA-Z][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    if (!mm) return;
    const k = mm[1];
    let v: any = mm[2];
    if (v === 'false') v = false; else if (v === 'true') v = true;
    else if (v.startsWith('[')) {
      try { v = JSON.parse(v.replace(/'(.*?)'/g, '"$1"')); } catch {}
    } else if (/^".*"$/.test(v) || /^'.*'$/.test(v)) {
      v = v.slice(1, -1);
    }
    meta[k] = v;
  });
  return { meta: meta as BlogFrontmatter, body };
}

export async function loadManifest(): Promise<BlogIndex> {
  const res = await fetch('/blog/manifest.json');
  return res.json();
}

export async function loadPostFromFile(filename: string): Promise<BlogPost> {
  const text = await fetch(`/blog/${filename}`).then((r) => r.text());
  const { meta, body } = parseFrontmatter(text);
  const d = new Date(meta.date);
  const year = String(d.getFullYear());
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const slug = slugify(meta.title || filename.replace(/\.mdx?$/, ''));
  return {
    ...(meta as BlogFrontmatter),
    slug,
    year,
    month,
    url: `#/blog/${year}/${month}/${slug}`,
    content: body,
  };
}

export async function loadAllPosts(): Promise<BlogPost[]> {
  const manifest = await loadManifest();
  const posts = await Promise.all(manifest.posts.map(loadPostFromFile));
  const isProd = process.env.NODE_ENV === 'production';
  return posts
    .filter((p) => !(isProd && p.draft))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function readTime(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
