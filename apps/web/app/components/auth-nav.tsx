"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export type AuthAccountState = {
  status: "loading" | "unconfigured" | "signed-in" | "signed-out" | "unavailable";
  email: string | null;
};
type AuthNavProps = { onAccountStateChange?: (state: AuthAccountState) => void };

// Reuses the existing session to expose only the email needed by Settings.
export default function AuthNav({ onAccountStateChange }: AuthNavProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      onAccountStateChange?.({ status: "unconfigured", email: null });
      return;
    }
    setConfigured(true);
    onAccountStateChange?.({ status: "loading", email: null });
    const supabase = createClient();
    let active = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error) { onAccountStateChange?.({ status: "unavailable", email: null }); return; }
      const nextEmail = data.user?.email ?? null;
      setEmail(nextEmail);
      onAccountStateChange?.({ status: nextEmail ? "signed-in" : "signed-out", email: nextEmail });
    }).catch(() => { if (active) onAccountStateChange?.({ status: "unavailable", email: null }); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextEmail = session?.user?.email ?? null;
      setEmail(nextEmail);
      onAccountStateChange?.({ status: nextEmail ? "signed-in" : "signed-out", email: nextEmail });
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [onAccountStateChange]);
  if (!configured) return <Link className="auth-link" href="/login">Sign in</Link>;
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    onAccountStateChange?.({ status: "signed-out", email: null });
  }
  return email ? <div className="auth-nav"><span className="auth-email">{email}</span><button className="auth-link" onClick={signOut} type="button">Sign out</button></div> : <Link className="auth-link" href="/login">Sign in</Link>;
}
