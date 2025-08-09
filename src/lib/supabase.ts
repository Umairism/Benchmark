import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key';

// Create Supabase client (will use dummy values if not configured)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Utility function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

// Database mode detection
export const getDatabaseMode = (): 'supabase' | 'localStorage' => {
  const mode = import.meta.env.VITE_APP_MODE;
  
  if (mode === 'development') {
    return 'localStorage';
  }
  
  return isSupabaseConfigured() ? 'supabase' : 'localStorage';
};

// Database mode configuration
export const isDatabaseOnline = Boolean(supabase);
export const databaseMode = isDatabaseOnline ? 'supabase' : 'local';

// Configuration object
export const dbConfig = {
  mode: databaseMode,
  isOnline: isDatabaseOnline,
  client: supabase,
  localStoragePrefix: 'benchmark_',
  inviteCode: 'BENCHMARK2025'
};

console.log(`🗄️ Database mode: ${databaseMode.toUpperCase()}`);

export default supabase;
