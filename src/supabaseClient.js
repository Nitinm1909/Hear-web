import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://wsvhmpngjhppuyiihrqz.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdmhtcG5namhwcHV5aWlocnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzY3MDAsImV4cCI6MjA5NDk1MjcwMH0.lP2AbwuZTyN6DVRWqMUljWACcJAV8I_n3k1DXroLOn0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
