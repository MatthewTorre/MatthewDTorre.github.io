import React from 'react';
import { BlogPost } from './types';

export default function PostCard({ p }: { p: BlogPost }) {
  return (
    <article className="verse-card" role="article">
      {p.coverImage && (
        <img src={p.coverImage} alt="" className="cover-image" loading="lazy" />
      )}
      <h3 className="card-title"><a href={p.url}>{p.title}</a></h3>
      <p className="project-sub">{new Date(p.date).toLocaleDateString()} • {p.author}</p>
      <p className="card-desc line-clamp-3">{p.description}</p>
      <div className="project-links">
        <a className="badge-chip" href={`#/blog/category/${slugify(p.category)}`}>{p.category}</a>
        {p.tags?.slice(0,4).map(t => (
          <a key={t} className="badge-chip" href={`#/blog/tag/${slugify(t)}`}>{t}</a>
        ))}
      </div>
    </article>
  );
}

function slugify(s: string){
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');
}
