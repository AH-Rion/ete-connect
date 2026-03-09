import { createClient } from '@supabase/supabase-js';

// Lovable Cloud client for site_settings (stored in the Cloud database)
const cloudUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'fhzsksqfvkviwhwndhdw'}.supabase.co`;
const cloudKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoenNrc3Fmdmt2aXdod25kaGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NzI3ODUsImV4cCI6MjA4ODU0ODc4NX0.APBcxgbc1veGEuIywN8d_EO9XuymxbCsZy4QuKbkUs0';

export const cloudSupabase = createClient(cloudUrl, cloudKey);
