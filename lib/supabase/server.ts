import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for Server Components, Server Actions and Route Handlers.
 */
export async function createClient() {
  let cookieStore: any = null;
  try {
    cookieStore = cookies();
  } catch {
    // Outside request scope (scripts, background tasks, tests)
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://qcyhectrkzurykfxdwdh.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeWhlY3Rya3p1cnlrZnhkd2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDAzOTQsImV4cCI6MjEwNTkxNjM5NH0.RqjsQBUgQZmpfoC-aZLqdfOmimyS4_w7dy-B7p4FfoY";

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore?.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore?.set({ name, value, ...options });
        } catch {
          // Handled if invoked from a Server Component
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore?.set({ name, value: "", ...options });
        } catch {
          // Handled if invoked from a Server Component
        }
      },
    },
  });
}

/**
 * Creates an admin Supabase client (using SERVICE_ROLE_KEY) for privileged background tasks.
 */
export function createAdminClient() {
  const { createClient: createSupabaseJsClient } = require("@supabase/supabase-js");
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://qcyhectrkzurykfxdwdh.supabase.co";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  return createSupabaseJsClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
