import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Client Components (Browser).
 */
export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://qcyhectrkzurykfxdwdh.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeWhlY3Rya3p1cnlrZnhkd2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDAzOTQsImV4cCI6MjEwNTkxNjM5NH0.RqjsQBUgQZmpfoC-aZLqdfOmimyS4_w7dy-B7p4FfoY";

  return createBrowserClient(supabaseUrl, supabaseKey);
}
