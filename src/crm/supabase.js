import { createClient } from '@supabase/supabase-js';

// La URL y la clave publicable están pensadas para ir en el frontend: la seguridad real
// la dan el login y las políticas RLS de cada tabla. Se pueden sobrescribir con variables VITE_.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ugemygtznaunradnbuit.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Byuykn7j7rqZN7vcAWWc4A_qOs7e1g9';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
});
