import { createClient } from '@supabase/supabase-js';

// Create a separate Supabase client for admin operations
// This will use the service role key to bypass RLS
const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export class AdminService {
  // Get all users (admin only)
  static async getAllUsers() {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Update user role (admin only)
  static async updateUserRole(userId: string, role: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
    return data;
  }

  // Get all articles (admin only)
  static async getAllArticles() {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Update article status (admin only)
  static async updateArticleStatus(articleId: string, published: boolean) {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .update({ published })
      .eq('id', articleId);

    if (error) throw error;
    return data;
  }

  // Delete article (admin only)
  static async deleteArticle(articleId: string) {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (error) throw error;
    return data;
  }

  // Get all comments (admin only)
  static async getAllComments() {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Delete comment (admin only)
  static async deleteComment(commentId: string) {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return data;
  }
}
