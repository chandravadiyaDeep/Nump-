import { createBrowserClient } from "@supabase/ssr";

// Browser client for sign-in, sign-up, and client-side session actions.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase is not configured. Set the public Supabase URL and publishable key.");
  }

  return createBrowserClient(url, publishableKey);
}
