# NUMPA Commercial Billing & Subscription Infrastructure Design

**Status:** Technical Evaluation & Architecture Specification (Awaiting Provider Setup)  
**Document Version:** 1.0.0  
**Phase:** Commercial V1 — Phase 6  
**Audience:** Repository Owner, Executive Leadership, Full-Stack Engineer  

---

## 1. Executive Summary & Provider Strategy

To support commercialization, NUMPA requires a secure, automated billing and subscription infrastructure.

Because NUMPA targets both Indian developers/teams (domestic transactions) and international enterprises (cross-border payments), a clear comparison between **Razorpay** and **Stripe** is required to select the optimal merchant gateway.

---

## 2. Gateway Comparison: Razorpay vs. Stripe

| Dimension | Razorpay (India Focus) | Stripe (Global Standard) | Evaluation for NUMPA |
|---|---|---|---|
| **Primary Markets** | India (Domestic INR dominance) | Global (135+ currencies, US, EU, UK, APAC) | Stripe offers immediate worldwide coverage; Razorpay excels in domestic Indian UPI. |
| **Payment Methods** | UPI, RuPay, Indian Debit/Credit cards, Netbanking, Wallets | Global Visa, Mastercard, Amex, Apple Pay, Google Pay, SEPA, Klarna | Stripe provides higher acceptance rates for international cardholders. |
| **Recurring Subscriptions** | Supported via Razorpay Subscriptions (Subject to RBI e-mandate rules) | Stripe Billing (Native recurring, smart retries, dunning management) | Stripe Billing offers significantly smoother SaaS subscription automation without recurring card registration friction. |
| **Hosted Checkout** | Razorpay Standard Checkout (Modal or redirect) | Stripe Checkout (Fully responsive, PCI DSS Service Provider Level 1) | Stripe Checkout requires zero custom card form handling. |
| **Customer Portal** | Limited native self-serve portal | Stripe Customer Portal (Self-serve plan upgrades, cancels, invoice downloads) | Stripe saves substantial frontend engineering by providing a turnkey billing portal. |
| **Webhooks & Idempotency** | Webhooks with HMAC-SHA256 signature; manual idempotency handling | Robust webhook event signatures (`Stripe-Signature`) with built-in idempotency keys | Stripe has superior developer tooling, SDK support, and test CLI (`stripe listen`). |
| **Tax & Invoicing** | GST invoicing supported for Indian businesses | Stripe Tax automated calculation across international jurisdictions | Stripe Tax handles VAT/GST compliance internationally. |
| **Standard Transaction Fees** | ~2% for Indian cards/UPI; ~3% for international | 2.9% + 30¢ per successful card charge (US standard); ~2% for domestic | Comparable cost structures. |

### Recommended Phased Rollout
1. **Primary Launch Provider:** **Stripe** is recommended as the default gateway for NUMPA Commercial V1 due to global acceptance, seamless Stripe Checkout, and the out-of-the-box Stripe Customer Portal.
2. **Indian Market Extension (Phase 6.1):** Add **Razorpay** for Indian domestic users who require native UPI and domestic RuPay support.

---

## 3. Strict Payment Security Architecture

```text
                        NUMPA Web App (Pricing Page)
                                     |
                                     | 1. User clicks "Upgrade to Starter"
                                     v
                        FastAPI / Next.js Server Route
                                     |
                                     | 2. Create Checkout Session via Server SDK
                                     v
                             Stripe API Engine
                                     |
                                     | 3. Returns session.url
                                     v
                       Redirect to Hosted Checkout (stripe.com)
                                     |
                                     | 4. User completes payment securely
                                     v
                      +-----------------------------+
                      |                             |
                      v                             v
           Browser Redirect                 Stripe Webhook Event
      (e.g., /settings?success=true)        (checkout.session.completed)
                      |                             |
             Pure UI Acknowledgement                | 5. POST to /api/v1/billing/webhook
         (DOES NOT GRANT SUBSCRIPTION)              | (Carries Stripe-Signature)
                                                    v
                                         NUMPA Webhook Handler
                                                    |
                                                    | 6. Verify HMAC-SHA256 signature
                                                    | 7. Check idempotency (prevent replay)
                                                    v
                                         Supabase PostgreSQL
                                         Update `user_subscriptions`
                                         Set plan_tier = 'starter'
```

### Security Guardrails
1. **Zero Cardholder Data Storage:** NUMPA servers, databases, and logs never touch, transmit, or store credit card numbers, CVVs, or expiration dates. All card handling occurs directly within the gateway's PCI-certified iframe or hosted page.
2. **Never Trust Redirect Parameters:** A user navigating to `https://numpa.online/settings?session_id=cs_test_123` or manipulating query parameters must **never** be granted access. Subscription entitlements are activated **only** when the cryptographically verified server-to-server webhook event is received.
3. **Idempotency & Replay Resistance:** Webhook handlers record processed event IDs in an `events_log` table. Duplicate webhook deliveries for the same event ID return `200 OK` immediately without re-executing business logic or altering quotas.
4. **Environment Isolation:** Sandbox keys (`sk_test_...`, `whsec_test_...`) and production keys (`sk_live_...`, `whsec_live_...`) are strictly separated. Test transactions must never touch live accounts.

---

## 4. Webhook Event Handling Matrix

| Gateway Event | Action in NUMPA Backend |
|---|---|
| `checkout.session.completed` | Query customer ID and subscription ID; upsert `user_subscriptions` record; activate paid plan tier. |
| `invoice.payment_succeeded` | Extend `current_period_end` by 30 days; reset monthly quota allowance in `usage_ledger`. |
| `invoice.payment_failed` | Mark status as `past_due`; trigger dunning email; retain grace period (3 days) before downgrade. |
| `customer.subscription.updated` | Update `plan_tier` if user changed plans; handle scheduled cancellation flags. |
| `customer.subscription.deleted` | Downgrade account to `free` tier; notify user via email. |

---

## 5. Current Implementation State

- **Current Repository Status:** `Awaiting Provider Setup & Approval`.
- No payment gateway keys, SDK dependencies, or billing tables have been deployed.
- The web application displays honest unmetered/free status with zero fake checkout buttons.
- Next steps upon owner authorization:
  1. Register Stripe merchant account for NUMPA.
  2. Configure Supabase `user_subscriptions` table.
  3. Deploy webhook listener on FastAPI.
