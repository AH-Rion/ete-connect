import { createClient } from '@supabase/supabase-js';

// Lovable Cloud client for site_settings (stored in the Cloud database)
const cloudUrl = import.meta.env.VITE_SUPABASE_URL;
const cloudKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!cloudUrl || !cloudKey) {
  throw new Error('Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
}

export const cloudSupabase = createClient(cloudUrl, cloudKey);
