export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  draft?: boolean;
};

export type BlogPost = BlogFrontmatter & {
  slug: string; // kebab from title
  year: string;
  month: string;
  url: string; // #/blog/YYYY/MM/slug
  content: string;
};

export type BlogIndex = {
  posts: string[]; // filenames in public/blog
};
