export type SkillNode = {
  id: string;
  label: string;
  group?: 'AI' | 'Product' | 'Agile' | 'Data' | 'Systems' | 'Other';
};

export const skills: SkillNode[] = [
  { id: 'ai-systems', label: 'AI Systems', group: 'AI' },
  { id: 'ml-fundamentals', label: 'Machine Learning Fundamentals', group: 'AI' },
  { id: 'nlp', label: 'Natural Language Processing', group: 'AI' },
  { id: 'vision', label: 'Computer Vision', group: 'AI' },
  { id: 'data-strategy', label: 'Data Strategy', group: 'Data' },
  { id: 'experimentation', label: 'Experimentation & A/B Testing', group: 'Data' },
  { id: 'analytics', label: 'Product Analytics', group: 'Data' },
  { id: 'systems', label: 'Systems Thinking', group: 'Systems' },
  { id: 'architecture', label: 'Architecture & Scale', group: 'Systems' },
  { id: 'product-sense', label: 'Product Sense', group: 'Product' },
  { id: 'user-research', label: 'User Research', group: 'Product' },
  { id: 'leadership', label: 'Team Leadership', group: 'Other' },
];
