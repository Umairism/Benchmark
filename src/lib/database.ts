import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured } from './supabase';

// Hybrid database service that can work with both Supabase and localStorage

interface User {
  id: string;
  email: string;
  password: string;
  full_name?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

interface Article {
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

interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Confession {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Helper functions for localStorage
const getStorageData = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setStorageData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

// Simple password hashing (for demo purposes - use proper hashing in production)
const hashPassword = (password: string): string => {
  return btoa(password + 'benchmark_salt');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

class HybridDatabase {
  private readonly STORAGE_KEYS = {
    USERS: 'benchmark_users',
    ARTICLES: 'benchmark_articles',
    COMMENTS: 'benchmark_comments',
    CONFESSIONS: 'benchmark_confessions',
    CURRENT_USER: 'benchmark_current_user'
  };

  private isSupabaseAvailable = false;

  constructor() {
    this.initializeDatabase();
    // Don't await this - let it run in the background
    this.checkSupabaseConnection().catch(() => {
      // Silently fail - we'll use localStorage
      this.isSupabaseAvailable = false;
    });
  }

  private async checkSupabaseConnection() {
    try {
      // Only check if we have the required environment variables
      if (!isSupabaseConfigured()) {
        this.isSupabaseAvailable = false;
        console.log('Database mode: localStorage (No Supabase credentials)');
        return;
      }

      const { data } = await supabase.from('users').select('count').limit(1);
      this.isSupabaseAvailable = data !== null;
      console.log(`Database mode: ${this.isSupabaseAvailable ? 'Supabase (Online)' : 'localStorage (Offline)'}`);
    } catch {
      this.isSupabaseAvailable = false;
      console.log('Database mode: localStorage (Offline)');
    }
  }

  getConnectionStatus(): boolean {
    return this.isSupabaseAvailable;
  }

  private initializeDatabase() {
    // Create default admin user if no users exist
    const users = this.getAllUsers();
    if (users.length === 0) {
      this.createUser('admin@benchmark.com', 'admin123', 'BENCHMARK2025', 'Administrator', 'admin');
    }
  }

  // Authentication and session management
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
    }
  }

  // User operations
  createUser(email: string, password: string, inviteCode: string, fullName?: string, role: 'user' | 'admin' = 'user'): User {
    const validInviteCode = 'BENCHMARK2025';
    if (inviteCode !== validInviteCode) {
      throw new Error('Invalid invite code');
    }

    const users = getStorageData<User>(this.STORAGE_KEYS.USERS);
    
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const hashedPassword = hashPassword(password);
    const user: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      full_name: fullName,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(user);
    setStorageData(this.STORAGE_KEYS.USERS, users);

    // Automatically log in the newly created user
    this.setCurrentUser(user);
    
    return user;
  }

  authenticateUser(email: string, password: string): User {
    const users = getStorageData<User>(this.STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('User not found');
    }

    if (!verifyPassword(password, user.password)) {
      throw new Error('Invalid password');
    }

    this.setCurrentUser(user);
    return user;
  }

  getUserById(id: string): User | null {
    const users = getStorageData<User>(this.STORAGE_KEYS.USERS);
    return users.find(u => u.id === id) || null;
  }

  getAllUsers(): User[] {
    return getStorageData<User>(this.STORAGE_KEYS.USERS);
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  // Article operations
  createArticle(articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Article {
    const articles = getStorageData<Article>(this.STORAGE_KEYS.ARTICLES);
    const newArticle: Article = {
      id: uuidv4(),
      ...articleData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    articles.push(newArticle);
    setStorageData(this.STORAGE_KEYS.ARTICLES, articles);
    return newArticle;
  }

  getAllArticles(): Article[] {
    return getStorageData<Article>(this.STORAGE_KEYS.ARTICLES);
  }

  getPublishedArticles(): Article[] {
    return this.getAllArticles()
      .filter(article => article.published)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getFeaturedArticles(): Article[] {
    return this.getPublishedArticles().filter(article => article.featured);
  }

  getArticleById(id: string): Article | null {
    const articles = getStorageData<Article>(this.STORAGE_KEYS.ARTICLES);
    return articles.find(a => a.id === id) || null;
  }

  updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'created_at'>>): Article {
    const articles = getStorageData<Article>(this.STORAGE_KEYS.ARTICLES);
    const articleIndex = articles.findIndex(a => a.id === id);

    if (articleIndex === -1) {
      throw new Error('Article not found');
    }

    articles[articleIndex] = {
      ...articles[articleIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    setStorageData(this.STORAGE_KEYS.ARTICLES, articles);
    return articles[articleIndex];
  }

  deleteArticle(id: string): void {
    const articles = getStorageData<Article>(this.STORAGE_KEYS.ARTICLES);
    const filteredArticles = articles.filter(a => a.id !== id);
    setStorageData(this.STORAGE_KEYS.ARTICLES, filteredArticles);

    // Also delete related comments
    const comments = getStorageData<Comment>(this.STORAGE_KEYS.COMMENTS);
    const filteredComments = comments.filter(c => c.article_id !== id);
    setStorageData(this.STORAGE_KEYS.COMMENTS, filteredComments);
  }

  // Comment operations
  createComment(commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Comment {
    const comments = getStorageData<Comment>(this.STORAGE_KEYS.COMMENTS);
    const newComment: Comment = {
      id: uuidv4(),
      ...commentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    comments.push(newComment);
    setStorageData(this.STORAGE_KEYS.COMMENTS, comments);
    return newComment;
  }

  getCommentsByArticle(articleId: string): Comment[] {
    return getStorageData<Comment>(this.STORAGE_KEYS.COMMENTS)
      .filter(comment => comment.article_id === articleId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getAllComments(): Comment[] {
    return getStorageData<Comment>(this.STORAGE_KEYS.COMMENTS);
  }

  deleteComment(id: string): void {
    const comments = getStorageData<Comment>(this.STORAGE_KEYS.COMMENTS);
    const filteredComments = comments.filter(c => c.id !== id);
    setStorageData(this.STORAGE_KEYS.COMMENTS, filteredComments);
  }

  // Confession operations
  createConfession(confessionData: Omit<Confession, 'id' | 'created_at' | 'updated_at'>): Confession {
    const confessions = getStorageData<Confession>(this.STORAGE_KEYS.CONFESSIONS);
    const newConfession: Confession = {
      id: uuidv4(),
      ...confessionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    confessions.push(newConfession);
    setStorageData(this.STORAGE_KEYS.CONFESSIONS, confessions);
    return newConfession;
  }

  getConfessionsByUser(userId: string): Confession[] {
    return getStorageData<Confession>(this.STORAGE_KEYS.CONFESSIONS)
      .filter(confession => confession.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getAllConfessions(): Confession[] {
    return getStorageData<Confession>(this.STORAGE_KEYS.CONFESSIONS);
  }

  updateConfession(id: string, updates: Partial<Omit<Confession, 'id' | 'created_at' | 'user_id'>>): Confession {
    const confessions = getStorageData<Confession>(this.STORAGE_KEYS.CONFESSIONS);
    const confessionIndex = confessions.findIndex(c => c.id === id);

    if (confessionIndex === -1) {
      throw new Error('Confession not found');
    }

    confessions[confessionIndex] = {
      ...confessions[confessionIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    setStorageData(this.STORAGE_KEYS.CONFESSIONS, confessions);
    return confessions[confessionIndex];
  }

  deleteConfession(confessionId: string): void {
    const confessions = getStorageData<Confession>(this.STORAGE_KEYS.CONFESSIONS);
    const filteredConfessions = confessions.filter(c => c.id !== confessionId);
    setStorageData(this.STORAGE_KEYS.CONFESSIONS, filteredConfessions);
  }

  // Utility methods
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initializeDatabase();
  }
}

// Create and export a singleton instance
export const db = new HybridDatabase();
