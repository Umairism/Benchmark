import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Get environment variables - no fallbacks to localhost
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.\n' +
    'Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Utility function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Database mode detection
export const getDatabaseMode = (): 'supabase' | 'localStorage' => {
  return isSupabaseConfigured() ? 'supabase' : 'localStorage';
};

// Database mode configuration
export const isDatabaseOnline = isSupabaseConfigured();
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
console.log(`🔗 Supabase URL: ${supabaseUrl}`);

export default supabase;
