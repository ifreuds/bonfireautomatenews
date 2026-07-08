import { createClient } from '@supabase/supabase-js';

// Public (read-only) client — uses the publishable/anon key.
// RLS restricts reads to published issues only.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anonKey);
