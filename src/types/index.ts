export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author_id: string;
  author_name: string;
  published: boolean;
  featured: boolean;
  image_url?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Confession {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}