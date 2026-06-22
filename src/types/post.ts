export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  readingTime?: string;
  content: string;
}

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
}
