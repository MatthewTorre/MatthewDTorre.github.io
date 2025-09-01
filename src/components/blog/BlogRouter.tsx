import React, { useEffect, useMemo, useState } from 'react';
import { BlogPost } from './types';
import { loadAllPosts, readTime } from './utils';
import PostCard from './PostCard';
import CategoryNav from './CategoryNav';
import SearchBar from './SearchBar';
import EmptyState from './EmptyState';

const slug = (s:string)=>s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');

export default function BlogRouter(){
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [hash, setHash] = useState<string>(typeof window !== 'undefined' ? window.location.hash : '#/blog');
  const [q, setQ] = useState('');

  useEffect(()=>{ loadAllPosts().then(setPosts); },[]);
  useEffect(()=>{
    const fn = ()=>setHash(window.location.hash || '#/blog');
    window.addEventListener('hashchange', fn); return ()=>window.removeEventListener('hashchange', fn);
  },[]);

  const route = useMemo(()=>parse(hash),[hash]);

  if (route.type === 'post') return <PostPage post={posts.find(p=>p.url===hash)} posts={posts} />;
  if (route.type === 'category') return <ListPage title={route.label} posts={posts.filter(p=>slug(p.category)===route.slug)} q={q} setQ={setQ} />;
  if (route.type === 'tag') return <ListPage title={`#${route.label}`} posts={posts.filter(p=>p.tags?.some(t=>slug(t)===route.slug))} q={q} setQ={setQ} />;
  return <ListPage title="Blog" posts={posts} q={q} setQ={setQ} />;
}

function parse(h: string): any {
  const m = h.replace(/^#/, '');
  if (/^\/blog\/[0-9]{4}\/[0-9]{2}\//.test(m)) return { type:'post' };
  const cat = m.match(/^\/blog\/category\/([^/]+)$/); if (cat) return { type:'category', slug: cat[1], label: unslug(cat[1]) };
  const tag = m.match(/^\/blog\/tag\/([^/]+)$/); if (tag) return { type:'tag', slug: tag[1], label: unslug(tag[1]) };
  return { type:'index' };
}
function unslug(s:string){ return s.replace(/-/g,' '); }

function ListPage({ title, posts, q, setQ }: { title:string; posts:BlogPost[]; q:string; setQ:(v:string)=>void }){
  const filtered = useMemo(()=>{
    const t = q.toLowerCase().trim();
    if (!t) return posts;
    return posts.filter(p =>
      p.title.toLowerCase().includes(t) ||
      p.description.toLowerCase().includes(t) ||
      p.tags?.some(tag=>tag.toLowerCase().includes(t))
    );
  },[posts,q]);

  // Pagination
  const pageSize = 9;
  const params = new URLSearchParams((typeof window!=='undefined' ? window.location.hash : '').split('?')[1] || '');
  const page = Math.max(1, parseInt(params.get('page') || '1', 10));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize);

  const setPage = (p:number)=>{
    const base = (window.location.hash.split('?')[0]) || '#/blog';
    const qp = new URLSearchParams(params); qp.set('page', String(p));
    window.location.hash = `${base}?${qp.toString()}`;
  };

  return (
    <section id="blog" className="verse-section-alt">
      <div className="verse-container">
        <h2 className="verse-heading">{title}</h2>
        <CategoryNav />
        <SearchBar value={q} onChange={setQ} />
        <div className="card-grid" style={{marginTop:'1rem'}}>
          {pageItems.length ? pageItems.map(p => (<PostCard key={p.url} p={p} />)) : <EmptyState message="No posts match your search." />}
        </div>
        {totalPages > 1 && (
          <div style={{display:'flex',gap:'.5rem',justifyContent:'center',marginTop:'1rem'}}>
            <button className="neon-btn" onClick={()=>setPage(Math.max(1,page-1))} disabled={page<=1}>Prev</button>
            <span style={{alignSelf:'center',color:'#c9cfda'}}>Page {page} / {totalPages}</span>
            <button className="neon-btn" onClick={()=>setPage(Math.min(totalPages,page+1))} disabled={page>=totalPages}>Next</button>
          </div>
        )}
      </div>
    </section>
  );
}

function PostPage({ post, posts }: { post: BlogPost | undefined; posts: BlogPost[] }){
  if (!post) return <section className="verse-section-alt"><div className="verse-container"><EmptyState message="Post not found." /></div></section>;
  const rt = readTime(post.content);
  const related = posts.filter(p => p !== post && (p.category===post.category || p.tags?.some(t=>post.tags?.includes(t)))).slice(0,3);
  return (
    <section className="verse-section-alt">
      <div className="verse-container">
        <h1 className="verse-heading">{post.title}</h1>
        <p className="project-sub">{new Date(post.date).toLocaleDateString()} • {post.author} • {rt} min read</p>
        <div className="project-links" style={{margin:'0.6rem 0 1rem'}}>
          <a className="badge-chip" href={`#/blog/category/${slug(post.category)}`}>{post.category}</a>
          {post.tags?.map(t => (<a key={t} className="badge-chip" href={`#/blog/tag/${slug(t)}`}>#{t}</a>))}
        </div>
        {post.coverImage && <img className="cover-image" src={post.coverImage} alt="" />}
        <article className="card-desc" style={{whiteSpace:'pre-wrap', marginTop:'1rem'}}>{post.content}</article>
        <hr style={{margin:'1.25rem 0', borderColor:'#2a3140'}} />
        <h2 className="verse-heading" style={{fontSize:'1.4rem'}}>Related</h2>
        <div className="card-grid">
          {related.map(p => (<PostCard key={p.url} p={p} />))}
        </div>
      </div>
    </section>
  );
}
