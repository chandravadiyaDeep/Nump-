# NUMPA Supabase setup

## Current web authentication integration

The web app uses `@supabase/ssr` and `@supabase/supabase-js` for browser/server session handling. It includes email/password sign-up, sign-in, password-reset requests, a callback route, and a sign-out control. The dataset workflow remains accessible without an account for now; account authentication does not imply that uploaded datasets are saved.

## Required environment variables

Set these in the hosting provider for the web app (Vercel) and in `apps/web/.env.local` for local development:

- `NEXT_PUBLIC_SUPABASE_URL`: Project URL from Supabase Project Settings -> API.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Publishable key from the same page. This key is designed for public/client use; database security must be enforced by RLS.
- `NEXT_PUBLIC_NUMPA_API_URL`: Public origin of the FastAPI service, without a trailing slash.

Never set a database password or service-role/secret key as a `NEXT_PUBLIC_*` variable. Do not commit real credentials.

## Supabase dashboard

1. Authentication -> Sign In / Providers: enable Email.
2. Keep email confirmation enabled for production.
3. Authentication -> URL Configuration:
   - During local development, Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/**`
   - After deployment, set Site URL to the production web origin and add its exact callback URL pattern, for example `https://your-domain.example/**`.
4. Confirmation emails should redirect to `/auth/callback`. The callback exchanges the one-time code for a session.
5. Password reset emails redirect through `/auth/callback?next=/reset-password`.

Do not add the production URL until the actual Vercel domain is known.

## Database notes

The initial schema contains `public.profiles` and `public.feedback`, with RLS enabled. Profile creation on sign-up is not automatic yet; a database trigger can be added in a subsequent migration if the product needs profile rows. Never disable RLS to make the UI work.

## Smoke tests

- Sign up with an email you control and confirm the email.
- Confirm the callback returns to the NUMPA site.
- Sign in and sign out.
- Request a password reset and set a new password.
- Confirm the public dataset workflow still works without signing in.
- Check browser console and Vercel logs for configuration errors.
