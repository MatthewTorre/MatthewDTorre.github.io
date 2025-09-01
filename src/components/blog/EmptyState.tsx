import React from 'react';
export default function EmptyState({ message = 'No posts found.' }: { message?: string }){
  return <p style={{color:'#9aa0a6', margin:'1rem 0'}}>{message}</p>;
}
