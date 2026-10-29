"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

// Supports password sign-in, email sign-up, and password-reset email requests.
export default function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/` },
        });
        if (authError) throw authError;
        setMessage(data.session
          ? "Account created. You are signed in."
          : "Account created. Check your email for the confirmation link before signing in.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        window.location.assign("/");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function sendPasswordReset() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (!email.trim()) throw new Error("Enter your email address first.");
      const supabase = createClient();
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (authError) throw authError;
      setMessage("If an account exists for that address, a password-reset email will arrive shortly.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not request a password reset.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-tabs" role="group" aria-label="Account action">
        <button type="button" className={mode === "signin" ? "selected" : ""} onClick={() => setMode("signin")}>Sign in</button>
        <button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => setMode("signup")}>Create account</button>
      </div>
      <label className="auth-field">Email address
        <input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
      </label>
      <label className="auth-field">Password
        <input autoComplete={mode === "signup" ? "new-password" : "current-password"} type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
      </label>
      {mode === "signin" && <button className="auth-reset" type="button" disabled={busy} onClick={sendPasswordReset}>Send password reset email</button>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      {message && <p className="auth-message" role="status">{message}</p>}
      <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in to NUMPA" : "Create account"}</button>
      <p className="auth-small">By continuing, you agree to use NUMPA responsibly and only upload data you are authorized to process.</p>
      <p className="auth-small"><Link href="/">Continue without signing in</Link></p>
    </form>
  );
}
