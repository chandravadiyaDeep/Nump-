# Codex Execution Prompt — NUMPA Commercial V1, Phase 6 Only

Copy this complete prompt into Codex only after Phase 5 has been implemented, reviewed and accepted. Phase 6 is the commercial-readiness and integrations phase. It is deliberately approval-gated because it may involve authentication, database, payment, secrets, external providers and production infrastructure.

---

You are working in the existing NUMPA repository. Your task is to implement **NUMPA Commercial V1 — Phase 6: Integrations and Commercial Launch Readiness**.

Build on the accepted Phase 1–5 workspaces. Preserve the existing working production application, privacy-first data lifecycle and protected services. Do not treat this prompt as blanket permission to modify production infrastructure, Supabase schema/auth, Render configuration, Vercel settings, payment accounts or secrets.

## Read these files first, completely

1. `PRODUCTION_SAFETY.md`
2. `docs/commercial-v1/README.md`
3. `docs/commercial-v1/PRODUCT_REQUIREMENTS.md`
4. `docs/commercial-v1/WORKSPACE_UX.md`
5. `docs/commercial-v1/WORKFLOW_AND_DATA_LIFECYCLE.md`
6. `docs/commercial-v1/SAFETY_AND_ARCHITECTURE.md`
7. `docs/commercial-v1/IMPLEMENTATION_ROADMAP.md`
8. `docs/commercial-v1/VERIFICATION_PLAN.md`
9. `docs/commercial-v1/INTEGRATIONS.md`
10. `docs/commercial-v1/CODEX_PHASE_1_PROMPT.md`
11. `docs/commercial-v1/CODEX_PHASE_2_PROMPT.md`
12. `docs/commercial-v1/CODEX_PHASE_3_PROMPT.md`
13. `docs/commercial-v1/CODEX_PHASE_4_PROMPT.md`
14. `docs/commercial-v1/CODEX_PHASE_5_PROMPT.md`

## Phase 5 prerequisite gate — mandatory

Before coding:

1. Inspect Git branch, working tree, recent commits and pull requests.
2. Identify the accepted Phase 5 implementation commit and review its diff and test results.
3. Confirm Phase 1–5 are present and working, including auth, History/Settings states, data workflows and ML workspaces.
4. Confirm any implemented history behaviour respects the approved metadata-only persistence and RLS boundaries.
5. Run baseline lint, type-check, tests and production build before changes.
6. If Phase 5 is not merged/accepted, any earlier phase is incomplete, or baseline checks fail, STOP and report. Do not begin Phase 6.
7. Do not discard, overwrite or reset uncommitted user work.

Create a focused feature branch from the latest accepted `main`, for example `feature/commercial-v1-phase-6-commercial-launch`. Inspect any existing branch before reuse. Never work directly on `main`, force-push or merge automatically.

## Mission

Prepare NUMPA for a secure, supportable commercial launch through these capability areas:

1. Public NUMPA API access.
2. API key lifecycle, scopes, quotas and server-side usage metering.
3. Webhooks for supported workflow events.
4. Automation connectors such as Zapier, Make and n8n, built on the public API.
5. Google Drive and GitHub file integrations where justified.
6. Billing, subscriptions and plan entitlements.
7. Privacy, legal, onboarding, support, documentation and release readiness.

**Important:** These are target capabilities, not permission to invent unfinished infrastructure or connect real customer accounts. First perform a feasibility and security audit. Implement only components that can be safely completed with existing approved infrastructure and credentials. For any protected-resource change, stop and request a separate, specific approval before implementation.

## Phase 6 execution model — mandatory staged gates

### Gate 0 — audit and implementation proposal

Before changing code:

- Inspect the existing frontend, FastAPI routes, auth/session handling, Supabase schema/RLS, Render and Vercel configuration references, existing usage/history models, environment variable names (never print secret values), test coverage and deployment workflows.
- Inspect the actual current API behaviour and identify which operations are safe to expose externally.
- Inspect the current integration catalogue and any existing billing/payment code.
- Produce a capability matrix: existing and verified, partially implemented, absent, unsafe or blocked.
- Produce a threat model covering authentication, authorization, tenant isolation, secrets, rate limiting, abuse, SSRF, webhook replay, payment spoofing, privacy and data retention.
- Produce a dependency map and rollback plan.
- Separate work into independently reviewable sub-stages: API foundation, API keys/usage, webhooks, automation/third-party file connectors, billing/entitlements, launch readiness.
- Identify exact files, endpoints, schema objects, environment variables, external accounts and services that each sub-stage would affect.

If a sub-stage requires a protected resource change or an external account/secret not already approved and configured, STOP that sub-stage and prepare a clear approval request. You may continue with unrelated, low-risk documentation or UI work that does not imply the blocked feature is live.

Do not implement all sub-stages in one unreviewed change.

### Gate 1 — public API foundation

Only proceed if a stable, secure API design is supported by the current architecture and required approvals have been granted.

- Publish versioned API documentation for endpoints that actually exist and are approved for public use.
- Document request/response schemas, file limits, supported file types, errors, authentication, quotas, timeouts and data retention.
- Reuse existing endpoints where safe; do not expose internal routes simply because they exist.
- Keep existing frontend API contracts backward compatible.
- Enforce authorization and ownership server-side on every request.
- Validate file type, content, size, row/column limits and request shape on the server.
- Apply request IDs, safe structured logs and bounded timeouts.
- Never log raw dataset contents, credentials, API keys or sensitive column values.
- Avoid promising uptime, latency or service-level guarantees without monitoring and operational evidence.
- Keep interactive browser app authentication separate from programmatic API authentication where appropriate.

If new API routes, middleware, rate limiting infrastructure, database schema, secrets or Render configuration are required, do not make them without separate explicit approval.

### Gate 2 — API key lifecycle and usage metering

If explicitly approved and supported, implement a secure API key system:

- Generate keys using a cryptographically secure random source on the server.
- Show the full secret only once at creation.
- Store only a secure hash or keyed hash of the secret; never store plaintext API keys.
- Never return stored hashes or secrets after creation.
- Support named keys, scopes, creation time, last-used time, optional expiry, rotation and revocation.
- Make revocation effective promptly and enforce it server-side.
- Use least-privilege scopes mapped to specific approved operations.
- Never trust a user ID, role, plan, quota or scope supplied by the client.
- Bind each key to its authenticated owner/tenant and verify authorization on every request.
- Implement server-side rate limits and quotas with clear 429 responses and retry guidance.
- Meter usage server-side using successful/defined billable events, not client-reported counts.
- Define idempotency and retry behaviour to avoid duplicate usage charges.
- Protect against brute force, key enumeration, replay and timing leaks.
- Do not expose API keys in URLs, query strings, frontend logs, analytics or error traces.

If secure hashing, key storage, tenant ownership, rate limiting or usage metering cannot be safely implemented with the approved architecture, stop and report the required infrastructure/schema design.

### Gate 3 — webhooks

Only enable webhooks after an approved event and delivery architecture exists.

- Define versioned event names and minimal payload schemas.
- Include unique event and delivery IDs, creation timestamps and schema versions.
- Sign each delivery using a strong HMAC scheme and document exact signature verification.
- Include timestamp-based replay protection and constant-time signature comparison.
- Support bounded retries with exponential backoff and jitter.
- Make delivery idempotent and prevent duplicate side effects.
- Provide bounded delivery history and safe redaction.
- Support endpoint verification, secret rotation and immediate revocation.
- Validate destination URLs and revalidate on delivery to prevent SSRF, private-network access, DNS rebinding and redirect-based bypasses.
- Restrict protocols and ports; block localhost, link-local, private, reserved and cloud metadata ranges.
- Do not allow arbitrary internal URLs or user-controlled fetches from the backend.
- Do not include raw dataset rows or sensitive content in webhook payloads.
- Do not claim guaranteed delivery; document retry limits and failure behaviour.

If background workers, queues, new tables, network egress controls, secrets or Render configuration changes are required, stop and request approval.

### Gate 4 — automation and file integrations

Build third-party automation connectors on the stable public API, not by exposing internal Python functions.

#### Zapier, Make and n8n

- Expose only approved, documented API actions and event triggers.
- Use least-privilege OAuth or API-key scopes.
- Define connection, disconnection, revocation and credential rotation.
- Respect rate limits, retries and idempotency.
- Provide clear user consent and account ownership.
- Never expose one user's data to another user's automation.
- Do not claim an official marketplace integration exists unless it has been built, tested and published.

#### Google Drive and GitHub

- Use official OAuth authorization-code flows with state and PKCE where supported.
- Request minimum necessary scopes.
- Let users explicitly choose files or repositories; never scan all content by default.
- Keep access/refresh tokens server-side and encrypted at rest.
- Support disconnect and token revocation.
- Validate file sizes/types and process imports through the existing safe pipeline.
- Do not persist imported raw data beyond the existing approved data lifecycle.
- Do not expose tokens to the browser, logs or client telemetry.
- Treat imported files and repository contents as untrusted input.
- Do not execute code, scripts, notebooks, macros or repository workflows from imported content.

If OAuth callback configuration, secrets, token storage, database schema, encryption keys or Vercel/Render settings need changes, stop and request exact approval.

### Gate 5 — billing and plan entitlements

Do not choose or activate a payment provider based on assumptions. First inspect existing payment setup and produce a provider comparison for the owner's target markets and business requirements. If no provider is already approved, request a decision before integrating one.

When explicitly approved:

- Use the provider's official server-side SDK and hosted checkout/customer portal where possible.
- Never collect or store raw card details in NUMPA.
- Verify webhook signatures server-side.
- Treat provider webhook events as authoritative for subscription state; never trust frontend success redirects.
- Make webhook handling idempotent and safe under retries/out-of-order events.
- Model trial, active, past-due, cancelled, expired, refunded and disputed states as appropriate to the provider.
- Define grace periods and downgrade behaviour explicitly.
- Enforce entitlements server-side on every protected operation.
- Never trust client-side plan labels, price IDs, usage totals or entitlement flags.
- Keep test and live credentials strictly separate.
- Never commit secrets or paste them into source code.
- Document tax, invoicing, refund, cancellation and customer-support assumptions for owner review; do not present legal/tax advice as settled compliance.
- Do not activate live payments or change production billing settings without explicit approval.

If billing requires new Supabase schema, Render environment variables, webhook endpoints, provider account configuration or production changes, stop until each exact change is approved.

### Gate 6 — launch readiness

Create a launch checklist and only mark items complete when evidence exists:

- Product capability matrix and known limitations.
- API documentation and versioning policy.
- Authentication/authorization and tenant-isolation tests.
- API key storage, rotation and revocation tests.
- Rate-limit and quota tests.
- Webhook signature, replay, retry and SSRF tests.
- Third-party OAuth scope and disconnect tests.
- Billing webhook and entitlement tests, if billing is implemented.
- Privacy policy, terms, retention and deletion process reviewed by the owner and qualified advisors where needed.
- Support channel and incident response process verified.
- Monitoring, error reporting and alerting verified without raw dataset logging.
- Backup/recovery and rollback procedures documented.
- Accessibility and responsive QA.
- Preview/staging end-to-end verification.
- Production release approval explicitly obtained.

Do not claim legal compliance, security certification, SOC 2, GDPR compliance, uptime guarantees or production readiness without independent evidence and required reviews.

## D. Settings and product UX

- Keep Integrations inside Settings, not as an eighth primary navigation item.
- Show only real connection and billing states backed by server responses.
- Clearly label planned, unavailable, disconnected, pending and connected states.
- For each integration, explain what data is accessed, requested permissions and how to disconnect.
- Show API key secrets only once and provide copy/revoke flows only when genuinely implemented.
- Never display full stored API keys or OAuth tokens.
- Show usage and plan information only from authoritative server-side sources.
- Clearly communicate limits, reset windows and what happens when a quota is reached.
- Avoid fake buttons, fake integrations, fake usage, fake pricing status or misleading success states.
- Keep the experience responsive, keyboard accessible and functional in both themes.

## E. Privacy and data lifecycle

- Preserve raw dataset temporary processing by default.
- Do not include raw rows, file contents, credentials or sensitive values in API logs, webhooks, usage events or analytics.
- Minimize metadata collected for metering and audit.
- Define retention and deletion rules for API keys, usage events, webhook deliveries and integration tokens.
- Provide user-facing explanations of third-party data flows.
- Ensure disconnect/revoke operations invalidate future access and remove stored tokens according to the approved retention policy.
- Do not introduce dataset storage or cloud object storage as a shortcut for integrations.
- Treat all external files, API payloads, webhook destinations and imported repository contents as untrusted.

## Protected services and explicit approval

The following remain read-only unless the owner separately approves a specific change:

### Supabase
No project URL/key/auth provider/callback/redirect/client initialization/schema/table/RLS/policy/function/trigger/migration/storage change without separate explicit approval. Never expose service-role keys.

### Render
No service settings, environment variables, CORS, health check, build/start command, runtime, deployment setting, API URL or production API contract change without separate explicit approval.

### Vercel
No project settings, domain, production branch, build settings or environment variable changes without separate explicit approval.

### External providers
No live payment provider activation, OAuth app creation, webhook secret creation, marketplace publication or production account change without explicit owner approval.

### Existing API
Preserve current endpoints and contracts unless a separately reviewed backward-compatible API change is explicitly approved. Existing frontend must continue using configured `NEXT_PUBLIC_NUMPA_API_URL`.

## Technical constraints

- Inspect actual code, dependency versions, tests and architecture before editing.
- Use official provider documentation and maintained SDKs; do not guess API parameters or security behaviour.
- Do not add dependencies or external services without documenting need, maintenance status, security impact and approval.
- Never put privileged secrets in browser code or source control.
- Validate all untrusted input at the server boundary.
- Use least privilege, secure defaults and fail-closed authorization.
- Avoid `any` unless narrowly justified at an external boundary and validated immediately.
- Add comments for non-obvious security, idempotency, retry, metering and entitlement logic.
- Add automated tests for security boundaries, not just happy-path UI.
- Preserve all accepted Phase 1–5 functionality.
- Do not perform broad refactors or dependency upgrades.

## Explicitly out of scope

Do NOT:

- Make protected production changes without exact separate approval.
- Create or modify Supabase schema/RLS/migrations without explicit approval.
- Change production Render/Vercel settings without explicit approval.
- Activate live payment processing without explicit approval.
- Store raw datasets by default.
- Expose privileged credentials or API keys to the client.
- Claim official Zapier/Make/n8n/Drive/GitHub integration status without actual verified implementation.
- Promise legal compliance, certification, uptime or delivery guarantees without evidence.
- Auto-merge, auto-deploy or change the production branch.
- Remove existing endpoints or break current frontend API contracts.

## Required verification

Follow `docs/commercial-v1/VERIFICATION_PLAN.md` and add tests for every implemented Phase 6 capability.

At minimum, as applicable:

1. Run frontend lint, type-check and production build.
2. Run backend unit, integration and security tests.
3. Verify every public endpoint has server-side authentication and authorization.
4. Verify tenant isolation and cross-user access denial.
5. Verify API key secrets are shown once, stored only as hashes, and cannot be recovered from storage.
6. Verify key rotation/revocation and scope enforcement.
7. Verify rate limits, quota boundaries and 429 behaviour.
8. Verify usage metering is server-authoritative and idempotent under retries.
9. Verify webhook signatures, timestamp/replay protection, retry bounds and idempotency.
10. Verify SSRF protections against localhost, private, link-local, metadata and redirect/DNS-rebinding cases.
11. Verify OAuth state/PKCE, minimum scopes, token secrecy, disconnect and revocation for each implemented connector.
12. Verify billing webhook signatures, duplicate/out-of-order events and server-side entitlement enforcement if billing is implemented.
13. Verify no card data or secrets are logged or stored in source control.
14. Verify no raw dataset content appears in logs, webhooks, metering or telemetry.
15. Verify all existing Phase 1–5 workflows remain intact.
16. Verify Supabase auth, RLS, Render API health/CORS and Vercel preview behaviour if any approved change touches them.
17. Verify rollback procedures and test environment separation.
18. Inspect the full diff for secrets, unapproved infrastructure changes and unrelated modifications.
19. Report all tests not run and why. Never claim security, legal, deployment or production success without evidence.

Use synthetic accounts and non-sensitive test datasets only. Use provider sandbox/test mode only until live activation is separately approved.

## Definition of done

- A documented capability/security audit exists.
- Only approved and safely implementable sub-stages are delivered.
- Public API access, API keys, webhooks, connectors and billing are exposed only when the underlying server-side capability is genuinely implemented and verified.
- Authentication, authorization, tenant isolation, secrets, rate limits, metering and privacy safeguards have relevant tests.
- No fake connection, billing, quota or integration states are displayed.
- Existing Phase 1–5 functionality remains intact.
- Protected changes have separate explicit approval and are documented.
- Work is on a focused feature branch and ready for owner review in a PR.
- No automatic merge or production deployment occurs.

## Final report format

Report:

1. Phase 5 prerequisite evidence and accepted base commit.
2. Capability matrix: existing, implemented, deferred, blocked.
3. Threat model and security review findings.
4. Feature branch and commit SHA(s).
5. Files created/changed.
6. Each sub-stage implemented and exact provider/API capabilities.
7. Protected resources or external accounts that would need separate approval.
8. API key, scopes, quotas and usage metering design/status.
9. Webhook design/status and SSRF/replay protections.
10. OAuth connector design/status and scopes.
11. Billing provider decision, sandbox status and entitlement behaviour, if applicable.
12. Tests/checks run with exact results.
13. Tests not run and why.
14. Confirmation of Supabase, Render, Vercel, API contract and production settings changed/not changed.
15. Preview/PR URL if one exists.
16. Known limitations and remaining approval requests.
17. Rollback instructions.

For every blocked change, provide a separate approval request with: exact resource, proposed change, reason, risks, data affected, backup/recovery requirement, rollback plan, environment (preview/staging/production) and verification steps. Do not proceed until approval is explicit.

---

End of Codex prompt.
