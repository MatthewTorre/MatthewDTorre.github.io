export type SkillNode = {
  id: string;
  label: string;
  group?: 'AI' | 'Product' | 'Agile' | 'Data' | 'Systems' | 'Other';
};

export const skills: SkillNode[] = [
  { id: 'lean-thinking', label: 'Lean Thinking', group: 'Agile' },
  { id: 'agile-principles', label: 'Agile Principles', group: 'Agile' },
  { id: 'safe-scrum', label: 'SAFe Scrum Master', group: 'Agile' },
  { id: 'product-sense', label: 'Product Sense', group: 'Product' },
  { id: 'product-strategy', label: 'Product Strategy', group: 'Product' },
  { id: 'product-design', label: 'Product Design', group: 'Product' },
  { id: 'deep-learning', label: 'Deep Learning', group: 'AI' },
  { id: 'computer-vision', label: 'Computer Vision', group: 'AI' },
  { id: 'nlp', label: 'Natural Language Processing', group: 'AI' },
  { id: 'convex-opt', label: 'Convex Optimization', group: 'AI' },
  { id: 'data-analysis', label: 'Data Analysis', group: 'Data' },
  { id: 'algorithms', label: 'Algorithms', group: 'Systems' },
  { id: 'python', label: 'Python', group: 'Systems' },
];
