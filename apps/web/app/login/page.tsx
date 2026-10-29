import Link from "next/link";
import LoginForm from "./login-form";

// Public account entry point for NUMPA.
export default function LoginPage() {
  return (
    <main className="auth-shell">
      <Link className="auth-brand" href="/"><span className="brand-mark">N</span> NUMPA</Link>
      <section className="auth-card">
        <p className="eyebrow">NUMPA ACCOUNT</p>
        <h1>Welcome to your data workspace.</h1>
        <p className="auth-intro">Sign in or create an account to get started. Your uploaded datasets are processed by the NUMPA API and are not stored in your Supabase account by this authentication flow.</p>
        <LoginForm />
      </section>
      <Link className="auth-back" href="/">← Back to dataset workspace</Link>
    </main>
  );
}
