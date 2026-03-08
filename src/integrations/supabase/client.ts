import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wproesbyazmuzfzwqgtg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwcm9lc2J5YXptdXpmendxZ3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjQ4ODYsImV4cCI6MjA4ODU0MDg4Nn0.AlxNx1yy_2PP_RZN5PX6cNjpSRxq4cjlIXohqA96Ryc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
