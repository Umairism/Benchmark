import { supabase } from './supabase';

// Database service that works with Supabase and handles missing tables gracefully

import type { Database } from '../types/supabase';
type User = Database['public']['Tables']['users']['Row'];
type Article = Database['public']['Tables']['articles']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];
type Confession = Database['public']['Tables']['confessions']['Row'];

// Helper function to check if a table exists and is accessible
const isTableAccessible = async (tableName: 'users' | 'articles' | 'comments' | 'confessions'): Promise<boolean> => {
  try {
    const { error } = await supabase.from(tableName).select('*').limit(1);
    return !error || (!error.message.includes('does not exist') && !error.message.includes('relation') && !error.code?.includes('42P01'));
  } catch (error) {
    console.warn(`Table ${tableName} not accessible:`, error);
    return false;
  }
};

export const db = {
  // User operations
  async getAllUsers(): Promise<User[]> {
    try {
      if (!(await isTableAccessible('users'))) {
        console.warn('Users table not accessible, returning empty array');
        return [];
      }
      
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
      if (!(await isTableAccessible('users'))) {
        console.warn('Users table not accessible, returning null');
        return null;
      }
      
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
    if (!(await isTableAccessible('articles'))) {
      throw new Error('Articles table not accessible. Please set up the database first.');
    }
    
    const { data, error } = await supabase.from('articles').insert([articleData]).select().single();
    if (error) throw error;
    return data;
  },

  async getAllArticles(): Promise<Article[]> {
    try {
      if (!(await isTableAccessible('articles'))) {
        console.warn('Articles table not accessible, returning empty array');
        return [];
      }
      
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
      if (!(await isTableAccessible('articles'))) {
        console.warn('Articles table not accessible, returning empty array');
        return [];
      }
      
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
      if (!(await isTableAccessible('articles'))) {
        console.warn('Articles table not accessible, returning empty array');
        return [];
      }
      
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
      if (!(await isTableAccessible('articles'))) {
        console.warn('Articles table not accessible, returning null');
        return null;
      }
      
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
    if (!(await isTableAccessible('articles'))) {
      throw new Error('Articles table not accessible. Please set up the database first.');
    }
    
    const { data, error } = await supabase.from('articles').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteArticle(id: string): Promise<void> {
    if (!(await isTableAccessible('articles'))) {
      throw new Error('Articles table not accessible. Please set up the database first.');
    }
    
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
  },

  // Comment operations
  async createComment(commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment> {
    if (!(await isTableAccessible('comments'))) {
      throw new Error('Comments table not accessible. Please set up the database first.');
    }
    
    const { data, error } = await supabase.from('comments').insert([commentData]).select().single();
    if (error) throw error;
    return data;
  },

  async getCommentsByArticle(articleId: string): Promise<Comment[]> {
    try {
      if (!(await isTableAccessible('comments'))) {
        console.warn('Comments table not accessible, returning empty array');
        return [];
      }
      
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
      if (!(await isTableAccessible('comments'))) {
        console.warn('Comments table not accessible, returning empty array');
        return [];
      }
      
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
    if (!(await isTableAccessible('comments'))) {
      throw new Error('Comments table not accessible. Please set up the database first.');
    }
    
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
  },

  // Confession operations
  async createConfession(confessionData: Omit<Confession, 'id' | 'created_at' | 'updated_at'>): Promise<Confession> {
    if (!(await isTableAccessible('confessions'))) {
      throw new Error('Confessions table not accessible. Please set up the database first.');
    }
    
    const { data, error } = await supabase.from('confessions').insert([confessionData]).select().single();
    if (error) throw error;
    return data;
  },

  async getConfessionsByUser(userId: string): Promise<Confession[]> {
    try {
      if (!(await isTableAccessible('confessions'))) {
        console.warn('Confessions table not accessible, returning empty array');
        return [];
      }
      
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
      if (!(await isTableAccessible('confessions'))) {
        console.warn('Confessions table not accessible, returning empty array');
        return [];
      }
      
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
    if (!(await isTableAccessible('confessions'))) {
      throw new Error('Confessions table not accessible. Please set up the database first.');
    }
    
    const { data, error } = await supabase.from('confessions').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteConfession(id: string): Promise<void> {
    if (!(await isTableAccessible('confessions'))) {
      throw new Error('Confessions table not accessible. Please set up the database first.');
    }
    
    const { error } = await supabase.from('confessions').delete().eq('id', id);
    if (error) throw error;
  },
};
