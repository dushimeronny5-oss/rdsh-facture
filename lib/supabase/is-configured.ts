/**
 * Checks if real Supabase credentials are configured in the environment.
 * Returns true if valid Supabase Cloud URL or non-dummy local keys are provided.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (key.includes("dummy-anon-key")) return false;

  // Supabase Cloud URL pattern: https://<project-ref>.supabase.co
  if (url.startsWith("https://") && url.includes(".supabase.co")) {
    return true;
  }

  // Local instance with actual custom key
  if ((url.includes("127.0.0.1") || url.includes("localhost")) && !key.includes("dummy")) {
    return true;
  }

  return false;
}
