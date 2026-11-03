# NUMPA API Access & API Key Architecture Design

**Status:** Technical Design & Approval Request (Awaiting Owner Review)  
**Document Version:** 1.0.0  
**Phase:** Commercial V1 — Phase 6  
**Audience:** System Architect, Security Reviewer, Repository Owner  

---

## 1. Objective & Security Principles

This document defines the production-grade architecture for programmatic API access to NUMPA.

### Fundamental Security Rules
1. **Never Store Plaintext Keys:** The server generates a high-entropy key, displays it to the user exactly once, and permanently stores only a cryptographic hash (SHA-256 with salt / PBKDF2 / Argon2id).
2. **Never Expose Hashes:** API key hashes must never be exposed via the frontend, logs, or error responses.
3. **No Client-Asserted Authority:** The client must never pass `user_id`, `plan`, `scopes`, or `quota` as trusted parameters. Authorization is strictly resolved server-side from the verified key.
4. **Header-Only Authentication:** Keys are accepted strictly via the standard `Authorization: Bearer <token>` header. Keys must never be accepted via URL query parameters, cookies, or request bodies.
5. **Immediate Revocation:** Key revocation must be atomic and take effect immediately across all endpoints.

---

## 2. API Key Specification & Token Format

Keys will follow a structured, human-readable, and machine-detectable format:

```text
numpa_live_4b8f19e2c6d7a1e09f5a3b2c1d0e4f5a6b7c8d9e0f1a2b3c
[ prefix ] [                        32-byte secure random hex                      ]
```

- **Prefix:** `numpa_live_` (Production) or `numpa_test_` (Sandbox/Test). This allows secret scanners (e.g., GitHub Secret Scanning, GitGuardian) to immediately detect leaked tokens.
- **Entropy:** 32 bytes (256 bits) generated via a cryptographically secure pseudo-random number generator (CSPRNG, `secrets.token_hex(32)` in Python or `crypto.randomBytes(32)` in Node.js).
- **Display Prefix:** The first 12 characters (`numpa_live_4b8f...`) are stored in plaintext as `key_prefix` for user identification in the Settings dashboard.

---

## 3. Database Schema Proposal (Supabase PostgreSQL)

> [!IMPORTANT]
> This schema is a **design proposal** requiring explicit owner approval before deployment. No tables or migrations have been created.

```sql
-- Table: public.api_keys
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    key_prefix VARCHAR(16) NOT NULL, -- e.g. "numpa_live_4b8f"
    key_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hex digest of raw token
    scopes TEXT[] NOT NULL DEFAULT ARRAY['read:datasets', 'write:cleaning', 'read:ml'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    is_active BOOLEAN GENERATED ALWAYS AS (revoked_at IS NULL AND (expires_at IS NULL OR expires_at > timezone('utc'::text, now()))) STORED
);

-- Index for high-speed constant-time key lookup
CREATE INDEX IF NOT EXISTS idx_api_keys_lookup ON public.api_keys (key_hash) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON public.api_keys (user_id);

-- Row Level Security (RLS)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only view their own active/revoked key metadata (never the hash)
CREATE POLICY "Users can view own api keys metadata"
    ON public.api_keys
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can create a key entry for themselves
CREATE POLICY "Users can create own api keys"
    ON public.api_keys
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can revoke (update revoked_at) their own keys
CREATE POLICY "Users can revoke own api keys"
    ON public.api_keys
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

---

## 4. Key Verification & FastAPI Authentication Middleware

When an external request arrives at the FastAPI backend:

```text
Inbound HTTP Request
       |
       v
Check 'Authorization: Bearer <token>'
       |
       +---> Missing or invalid format ----> 401 Unauthorized
       |
Compute SHA-256 hash of token
       |
Query `api_keys` by `key_hash`
       |
       +---> Key not found / revoked / expired ----> 401 Unauthorized
       |
Check Rate Limits & Quota
       |
       +---> Limit exceeded -----------------------> 429 Too Many Requests
       |
Verify Required Scope for Endpoint
       |
       +---> Insufficient scope -------------------> 403 Forbidden
       |
Inject Verified `APIUser(user_id, plan, scopes)` into Endpoint Context
       |
Execute Request & Asynchronously Update `last_used_at`
```

### Supported Scopes
- `datasets:inspect` — Run tabular quality profiling and inspection.
- `cleaning:execute` — Execute preprocessing transformations and download cleaned CSVs.
- `ml:readiness` — Calculate ML readiness scores and recommendation heuristics.
- `ml:compare` — Run baseline ML estimator benchmarking.

---

## 5. Rate Limiting & Abuse Prevention Strategy

To protect the Render backend from Out-Of-Memory (OOM) crashes and DoS:

| Plan Tier | Rate Limit (Requests / Min) | Concurrency Limit | Max File Size |
|---|---|---|---|
| **Free / Sandbox** | 10 req / min | 1 concurrent request | 10 MB |
| **Starter** | 60 req / min | 2 concurrent requests | 25 MB |
| **Professional** | 300 req / min | 5 concurrent requests | 50 MB |
| **Enterprise** | Custom (1000+ req / min) | Dedicated concurrency | 100 MB+ |

### Rate Limit Response Headers
Compliant with RFC 6585 / IETF standard rate limiting headers:
- `RateLimit-Limit: 60`
- `RateLimit-Remaining: 59`
- `RateLimit-Reset: 42` (seconds remaining until window reset)
- If exceeded, returns `HTTP 429 Too Many Requests` with a JSON payload specifying `retry_after_seconds`.

---

## 6. Formal Approval Request

Before implementing the API key infrastructure, the following production changes require explicit owner sign-off:

1. **Supabase Schema Change:** Run the migration script creating `public.api_keys` with RLS.
2. **Backend Authentication Dependency:** Introduce Supabase service-role verification in `apps/api` (or a dedicated auth verification RPC function).
3. **Render Environment Variable:** Add `SUPABASE_SERVICE_ROLE_KEY` to Render environment variables to allow `apps/api` to query verified key hashes without exposing credentials.
4. **Rate Limiting Store:** Choose between an in-memory sliding window limiter (suitable for single-instance Render) or managed Redis (Upstash Redis) for distributed multi-instance deployments.
