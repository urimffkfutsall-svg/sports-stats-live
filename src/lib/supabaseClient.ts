import { createClient } from '@supabase/supabase-js';

const url = (import.meta as any).env?.VITE_SUPABASE_URL;
const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn('VITE_SUPABASE_URL ose VITE_SUPABASE_ANON_KEY mungon.');
}

export const supabaseClient = createClient(url || '', anonKey || '');
