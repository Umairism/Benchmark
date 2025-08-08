import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Falling back to local storage.');
}

// Create Supabase client (will be null if credentials are missing)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

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
