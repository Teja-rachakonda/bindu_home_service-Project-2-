import { createClient } from "@supabase/supabase-js";

// The anon/public key is designed to be shipped in the browser — the database
// is protected by Row Level Security policies, not by hiding this key. Values
// can be overridden with Vite env vars (VITE_SUPABASE_URL / _ANON_KEY).
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://hkswrtvogmvivlgvnvwl.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrc3dydHZvZ212aXZsZ3ZudndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMTE5NTYsImV4cCI6MjA5ODg4Nzk1Nn0.VEHxvB9XftOcZzZmBAX3Weyrn5y3KXPHWd0wqb7AyIk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
