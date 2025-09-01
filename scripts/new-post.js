#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const blogDir = path.join(root, 'public', 'blog');
const manifestPath = path.join(blogDir, 'manifest.json');

const title = process.argv.slice(2).join(' ') || 'My New Post';
const now = new Date();
const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
const file = `${ym}-${title.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-')}.md`;
const out = path.join(blogDir, file);

const template = `---\n` +
`title: "${title}"\n` +
`description: ""\n` +
`date: "${now.toISOString().slice(0,10)}"\n` +
`author: "Matthew Darshan Torre"\n` +
`category: "" # one of: AI & Machine Learning, Product & Strategy, Data Science & Analytics, Quantum Computing, Software & Systems, Research & Academia, Career & Learning, Society & Tech\n` +
`tags: []\n` +
`coverImage: "/assets/blog/cover-sample.jpg"\n` +
`draft: true\n` +
`---\n\nWrite your post here...\n`;

fs.writeFileSync(out, template, 'utf8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if(!manifest.posts.includes(file)) manifest.posts.unshift(file);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Created', path.relative(root, out));
console.log('Updated manifest');
