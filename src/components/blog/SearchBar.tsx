import React from 'react';

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string)=>void }){
  return (
    <input
      aria-label="Search posts"
      placeholder="Search posts..."
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      style={{
        background:'#0e131b', color:'#e5e7eb', border:'1px solid #2a3140',
        padding:'.6rem .8rem', borderRadius:'10px', width:'100%', maxWidth:'420px'
      }}
    />
  );
}
