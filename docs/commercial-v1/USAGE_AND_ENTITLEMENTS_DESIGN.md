# NUMPA Usage Tracking & Plan Entitlements Design

**Status:** Technical Architecture Proposal (Awaiting Commercial Activation)  
**Document Version:** 1.0.0  
**Phase:** Commercial V1 — Phase 6  
**Audience:** Product Management, Engineering, Operations  

---

## 1. Principles of Authoritative Usage & Entitlements

In a commercial SaaS platform, usage tracking and entitlement enforcement must be **strictly authoritative and server-side**:
1. **Never Trust Client Counters:** Frontend state, `localStorage`, session cookies, or client-reported usage numbers must never be used for billing or quota enforcement.
2. **Atomic & Idempotent Metering:** Deducting quota or recording billable actions occurs only upon successful execution of the billable operation. Client retries with identical request IDs must not double-count usage.
3. **Graceful Quota Handling:** When a user reaches their plan limit, the system returns clear `402 Payment Required` or `429 Too Many Requests` responses with upgrade links, rather than failing silently.
4. **Separation of Concerns:** Billing logic (Stripe/Razorpay) is decoupled from operational business logic via an asynchronous event ledger.

---

## 2. Commercial Plan Matrix

| Feature / Quota | Free (Evaluation) | Starter | Professional | Enterprise |
|---|---|---|---|---|
| **Target Audience** | Individual Explorers | Data Analysts & Students | Data Scientists & Teams | Organizations |
| **Price (Estimated)** | \$0 / month | \$19 / month | \$79 / month | Custom / Invoiced |
| **Web Workspace Access** | Full 7-stage workspace | Full 7-stage workspace | Full 7-stage workspace | Dedicated tenant |
| **Max Upload File Size** | 10 MB | 25 MB | 50 MB | 250 MB+ |
| **Dataset Inspections** | 20 / month | 250 / month | Unlimited (fair use) | Unlimited |
| **Cleaning Operations** | 10 / month | 100 / month | Unlimited (fair use) | Unlimited |
| **ML Readiness Assessments** | 10 / month | 100 / month | Unlimited (fair use) | Unlimited |
| **ML Model Comparisons** | 5 / month | 50 / month | 500 / month | Unlimited |
| **API Keys** | 0 (Web only) | 1 key | 5 keys | Custom keys & IP whitelist |
| **API Rate Limit** | N/A | 30 req / min | 120 req / min | Custom (1000+ req/min) |
| **Analysis History** | In-memory session | 30 days metadata | 1 year metadata | Unlimited metadata audit |
| **Support** | Community / Discord | Email (48h SLA) | Priority Email (12h SLA) | Dedicated Slack & SLA |

---

## 3. Server-Side Usage Ledger Architecture

Usage is recorded as an immutable append-only ledger in PostgreSQL:

```text
FastAPI / Web Route
       |
[Execute Billable Action: e.g. Inspect or Clean]
       |
Action Succeeded?
       |
       +---> No (4xx / 5xx) ----> Discard. No usage billed.
       |
       +---> Yes (200 OK)
                 |
         Append Usage Record to `usage_ledger`
         (user_id, action_type, units, bytes_processed, timestamp)
```

### Proposed Schema (Supabase PostgreSQL)

```sql
-- Table: public.user_subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_tier VARCHAR(32) NOT NULL DEFAULT 'free', -- 'free', 'starter', 'professional', 'enterprise'
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'past_due', 'canceled', 'trialing'
    billing_provider VARCHAR(32), -- 'stripe', 'razorpay'
    customer_id VARCHAR(128),
    subscription_id VARCHAR(128),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (timezone('utc'::text, now()) + interval '30 days'),
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: public.usage_ledger
CREATE TABLE IF NOT EXISTS public.usage_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(64) NOT NULL, -- 'dataset_inspect', 'cleaning_execute', 'ml_readiness', 'ml_compare', 'api_request'
    units INT NOT NULL DEFAULT 1,
    bytes_processed BIGINT NOT NULL DEFAULT 0,
    request_id VARCHAR(64),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_usage_ledger_user_period ON public.usage_ledger (user_id, recorded_at);
```

---

## 4. Current Implementation Status vs Planned

- **Currently Implemented:** Neither the web application nor the FastAPI backend enforces usage restrictions or billing plans. The application is completely open for evaluation up to the technical ceiling (50 MB upload limit).
- **Settings UX State:** The Settings page displays `Usage and plan details are not available; no metering or billing source is configured.` This state is accurate and honest.
- **Rollout Roadmap:**
  1. Complete owner review of commercial pricing tiers.
  2. Implement Supabase `user_subscriptions` and `usage_ledger` tables.
  3. Deploy webhook listeners for Stripe / Razorpay lifecycle events.
  4. Enable server-side entitlement checks in `apps/api`.
