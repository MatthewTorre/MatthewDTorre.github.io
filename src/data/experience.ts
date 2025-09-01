export type LinkRef = { label: string; href: string };
export type XpCategory =
  | 'Internship'
  | 'Fellowship'
  | 'Research'
  | 'Leadership'
  | 'Product'
  | 'AI/ML'
  | 'Data'
  | 'Systems';
export type Experience = {
  id: string;
  title: string;
  org: string;
  start?: string; // YYYY-MM
  end?: string | 'Present';
  datesLabel?: string;
  location?: string;
  mode?: 'On-site' | 'Remote' | 'Hybrid' | 'Seasonal' | 'Part-time' | 'Self-employed';
  summary: string;
  details?: string[];
  skills?: string[];
  links?: LinkRef[];
  logoKey?: string; // base filename in /public/images/logos
  cats?: XpCategory[]; // categories for filtering
};

// To add an experience:
// - Insert an item below with a unique `id` (slug)
// - Drop a logo at public/images/logos/<logoKey>.webp|png|jpg|jpeg
export const experience: Experience[] = [
  {
    id: 'synchrony-intern',
    title: 'Technology Intern (BLP)',
    org: 'Synchrony',
    start: '2025-06',
    end: 'Present',
    location: 'Stamford, CT',
    mode: 'On-site',
    summary: 'Enterprise Architecture · Incubation | Product.',
    details: ['Enterprise Architecture initiatives; incubation/product workstream.'],
    logoKey: 'synchrony',
    cats: ['Internship', 'Systems', 'Product'],
  },
  {
    id: 'stvp-xfund',
    title: 'XFund Ethics Fellow (formerly PEAK Fellows)',
    org: 'Stanford Technology Ventures Program (STVP)',
    start: '2024-09',
    end: 'Present',
    location: 'Stanford, CA',
    mode: 'Seasonal',
    summary: '2024 STVP XFund Ethics Fellow.',
    links: [{ label: 'Program Page', href: 'Xfund Ethics Fellows | Stanford Technology Ventures Program' }],
    logoKey: 'stvp',
    cats: ['Fellowship', 'Leadership', 'Product'],
  },
  {
    id: 'journalismera-cofounder',
    title: 'Co-Founder',
    org: 'Journalismera',
    start: '2022-06',
    end: 'Present',
    location: 'Santa Monica, CA',
    mode: 'Self-employed',
    summary: 'Lead content strategy, production, and audience growth.',
    details: [
      'Scaled to 300k+ views across YouTube/TikTok/Instagram.',
      'Built monetization pathways.',
    ],
    logoKey: 'journalismera',
    cats: ['Leadership', 'Product'],
  },
  {
    id: 'mlt-fellow',
    title: 'MLT Fellow',
    org: 'Management Leadership for Tomorrow',
    start: '2024-12',
    end: 'Present',
    summary: 'Leadership & career acceleration program.',
    logoKey: 'mlt',
    cats: ['Fellowship', 'Leadership'],
  },
  {
    id: 'curious-cardinals-mentor',
    title: 'Mentor',
    org: 'Curious Cardinals',
    start: '2025-03',
    end: 'Present',
    mode: 'Part-time',
    summary: 'Personalized learning in product strategy & tech skills.',
    details: ['Guided MVP development with structured pathways.'],
    logoKey: 'curious-cardinals',
    cats: ['Leadership', 'Product'],
  },
  {
    id: 'sddl-ra',
    title: 'Research Assistant (Meta Project)',
    org: 'Stanford Deliberative Democracy Lab',
    start: '2023-06',
    end: '2025-08',
    location: 'Stanford, CA',
    summary: 'Data analysis for Meta project.',
    skills: ['IBM SPSS Statistics', 'Data Analysis'],
    logoKey: 'stanford-ddl',
    cats: ['Research', 'Data'],
  },
  {
    id: 'moss-lab-ra',
    title: 'Research Assistant',
    org: 'Stanford Medicine — Moss Lab',
    start: '2024-08',
    end: '2025-04',
    mode: 'Hybrid',
    summary: 'Automated diagnosis of strabismus using deep learning.',
    skills: ['Python', 'Deep Learning'],
    logoKey: 'stanford-medicine',
    cats: ['Research', 'AI/ML', 'Data'],
  },
  {
    id: 'stanford-management-consultant',
    title: 'Senior Consultant',
    org: 'Stanford Management',
    start: '2024-01',
    end: '2025-03',
    summary: 'Client projects in product/marketing strategy.',
    logoKey: 'stanford-marketing',
    cats: ['Product', 'Leadership'],
  },
  {
    id: 'google-pixel-studio',
    title: 'Senior Consultant',
    org: 'Google Pixel Studio',
    start: '2024-04',
    end: '2024-06',
    summary: 'Short-term PM engagement.',
    logoKey: 'google',
    cats: ['Product'],
  },
  {
    id: 'lumiere-microsoft-consultant',
    title: 'Consultant (Product Marketing)',
    org: 'Microsoft (Imagine Cup)',
    start: '2024-01',
    end: '2024-04',
    summary: 'Consulted on Imagine Cup product marketing and GTM.',
    skills: ['Product Marketing'],
    logoKey: 'microsoft',
    cats: ['Product'],
  },
  {
    id: 'lumiere-consultant',
    title: 'Project Manager',
    org: 'Lumiere Education',
    summary: 'Consulted on student product strategy and go-to-market.',
    skills: ['Product Strategy', 'GTM'],
    logoKey: 'lumiere',
    cats: ['Product'],
  },
  {
    id: 'demystifyd-pm-intern',
    title: 'Founding Product Manager',
    org: 'Demystifyd',
    start: '2024-02',
    end: '2024-09',
    location: 'Dallas, TX (Remote)',
    summary: 'Built platform for foreign nationals (launched Jun 2024).',
    skills: ['Python', 'Product Management'],
    links: [{ label: 'Website', href: 'https://demystifyd.com' }],
    logoKey: 'demystifyd',
    cats: ['Internship', 'Product'],
  },
  {
    id: 'sura-src-codirector',
    title: 'Stanford Research Conference Co-Director',
    org: 'Stanford Undergraduate Research Association',
    start: '2023-10',
    end: '2024-09',
    location: 'Stanford, CA',
    mode: 'Seasonal',
    summary: 'Directed Stanford’s largest undergrad research conference.',
    details: ['Programmed Nobel Laureate Thomas Südhof.'],
    links: [{ label: '2024 Booklet (PDF)', href: '2024 Stanford Research Conference Booklet.pdf' }],
    logoKey: 'sura',
    cats: ['Leadership'],
  },
  {
    id: 'stanford-health-pm',
    title: 'Project Manager',
    org: 'Stanford Healthcare Consulting Group',
    start: '2024-01',
    end: '2024-03',
    location: 'Palo Alto, CA',
    summary: 'CAUTI strategy project.',
    logoKey: 'stanford-health',
    cats: ['Product', 'Systems'],
  },
  {
    id: 'joby-congress-associate',
    title: 'Campaign Associate (CA-16)',
    org: 'Joby For Congress',
    start: '2023-12',
    end: '2024-03',
    summary: 'Field and comms support.',
    logoKey: 'joby',
    cats: ['Leadership'],
  },
  {
    id: 'adams-street-intern',
    title: 'Growth Equity Investments Intern',
    org: 'Adams Street Partners',
    start: '2023-06',
    end: '2023-07',
    location: 'Menlo Park, CA',
    mode: 'Hybrid',
    summary: 'Generative AI software research.',
    skills: ['Financial Analysis', 'Data Analysis'],
    // Use the specific asset provided by user
    logoKey: 'adams_street_partners_logo',
    cats: ['Internship', 'Data'],
  },
];
