import React from 'react';
import CategoryChip from './CategoryChip';

const CATS = [
  'AI & Machine Learning',
  'Product & Strategy',
  'Data Science & Analytics',
  'Quantum Computing',
  'Software & Systems',
  'Research & Academia',
  'Career & Learning',
  'Society & Tech',
];

const slug = (s:string)=>s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');

export default function CategoryNav(){
  return (
    <nav aria-label="Blog categories" style={{display:'flex',flexWrap:'wrap',gap:'.5rem',margin:'0.5rem 0 1rem'}}>
      {CATS.map(c => (
        <CategoryChip key={c} label={c} href={`#/blog/category/${slug(c)}`} />
      ))}
    </nav>
  );
}
