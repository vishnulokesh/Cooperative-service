import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Throw a more informative error that the UI can catch and display
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('MISSING_SUPABASE_ENV_VARS');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
