"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

// Small account navigation that gracefully falls back when Supabase isn't configured.
export default function AuthNav() {
  const [email, setEmail] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return;
    setConfigured(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!configured) return <Link className="auth-link" href="/login">Sign in</Link>;

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
  }

  return email ? (
    <div className="auth-nav">
      <span className="auth-email">{email}</span>
      <button className="auth-link" onClick={signOut} type="button">Sign out</button>
    </div>
  ) : <Link className="auth-link" href="/login">Sign in</Link>;
}
