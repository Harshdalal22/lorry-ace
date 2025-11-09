import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check if environment variables are available
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Supabase environment variables not loaded. Please refresh the page.');
  console.error('VITE_SUPABASE_URL:', SUPABASE_URL);
  console.error('VITE_SUPABASE_PUBLISHABLE_KEY:', SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Not set');
}

// Create a safe client that won't crash if env vars aren't loaded yet
export const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

export const isSupabaseReady = () => supabase !== null;
