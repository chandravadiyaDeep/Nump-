# API and Integration Evolution Plan

## Current API
The initial API includes health, dataset inspection, cleaning preview/execution, readiness scoring and classification/regression comparison. Treat routes as an MVP contract until schemas and versioning are formalized.

## Contract requirements
- Keep public routes versioned under /api/v1.
- Define request/response schemas, validation and stable error formats.
- Add contract tests and examples.
- Plan breaking changes and deprecation.
- Add idempotency for retried operations that create jobs or side effects.
- Enforce file, payload, runtime and concurrency limits.

## Before public API launch, decide
Authentication (session/API key), key hashing/rotation/revocation, per-plan quotas, server-side metering, synchronous/asynchronous thresholds, job status/cancellation/expiry, retry policy, webhook signing/retries, tenant isolation and API version support.

## Automation integrations
Potential later integrations: Zapier, Make and n8n. Build them on stable API contracts, not internal module details. Credentials must be scoped and revocable.

## Billing and entitlements
Verify payment webhooks, handle duplicates and out-of-order events, enforce entitlements server-side and audit plan changes. Client-reported usage is never authoritative.

## Embeddable and white-label
Define tenant boundaries, allowed origins, per-tenant settings, branding, data access and rate limits. Test isolation before enterprise release.
