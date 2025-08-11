import { supabase } from './supabase';

// Database service that works with Supabase only

import type { Database } from '../types/supabase';
type User = Database['public']['Tables']['users']['Row'];
type Article = Database['public']['Tables']['articles']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];
type Confession = Database['public']['Tables']['confessions']['Row'];




export const db = {
  // User operations
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  },
  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      if (error) {
        console.error('Error fetching user by id:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  },
  // Article operations
  async createArticle(articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> {
    const { data, error } = await supabase.from('articles').insert([articleData]).select().single();
    if (error) throw error;
    return data;
  },
  async getAllArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching articles:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getAllArticles:', error);
      return [];
    }
  },
  async getPublishedArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('published', true).order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching published articles:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getPublishedArticles:', error);
      return [];
    }
  },
  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('published', true).eq('featured', true).order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching featured articles:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedArticles:', error);
      return [];
    }
  },
  async getArticleById(id: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
      if (error) {
        console.error('Error fetching article by id:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error in getArticleById:', error);
      return null;
    }
  },
  async updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'created_at'>>): Promise<Article> {
    const { data, error } = await supabase.from('articles').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async deleteArticle(id: string): Promise<void> {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
  },
  // Comment operations
  async createComment(commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment> {
    const { data, error } = await supabase.from('comments').insert([commentData]).select().single();
    if (error) throw error;
    return data;
  },
  async getCommentsByArticle(articleId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase.from('comments').select('*').eq('article_id', articleId).order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getCommentsByArticle:', error);
      return [];
    }
  },
  async getAllComments(): Promise<Comment[]> {
    try {
      const { data, error } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching all comments:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getAllComments:', error);
      return [];
    }
  },
  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
  },
  // Confession operations
  async createConfession(confessionData: Omit<Confession, 'id' | 'created_at' | 'updated_at'>): Promise<Confession> {
    const { data, error } = await supabase.from('confessions').insert([confessionData]).select().single();
    if (error) throw error;
    return data;
  },
  async getConfessionsByUser(userId: string): Promise<Confession[]> {
    try {
      const { data, error } = await supabase.from('confessions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching user confessions:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getConfessionsByUser:', error);
      return [];
    }
  },
  async getAllConfessions(): Promise<Confession[]> {
    try {
      const { data, error } = await supabase.from('confessions').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching all confessions:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getAllConfessions:', error);
      return [];
    }
  },
  async updateConfession(id: string, updates: Partial<Omit<Confession, 'id' | 'created_at' | 'user_id'>>): Promise<Confession> {
    const { data, error } = await supabase.from('confessions').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async deleteConfession(id: string): Promise<void> {
    const { error } = await supabase.from('confessions').delete().eq('id', id);
    if (error) throw error;
  },
};
