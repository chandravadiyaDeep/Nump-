# NUMPA Commercial V1 — Integrations Specification

## 1. Purpose

Provide a clear place for users to discover and manage future connections from within NUMPA. The Integrations experience belongs under Settings. It is not a separate primary sidebar destination.

## 2. Planned integration catalogue

| Integration | User value | Planned stage |
|---|---|---|
| NUMPA API | Programmatic access to supported analysis and cleaning workflows | Commercial API phase |
| Webhooks | Notify external systems when jobs complete | After async/job architecture |
| Zapier | No-code automation | After stable public API |
| Make.com | Visual automation scenarios | After stable public API |
| n8n | Self-hosted automation workflows | After stable public API |
| Google Drive | Import/export selected files | Separate connector phase |
| GitHub | Import selected repository datasets/artifacts | Separate connector phase |

This is a roadmap, not a claim that any integration is currently connected.

## 3. Phase 1 requirements

- Create the Settings information architecture and an Integrations destination/section only if it fits naturally into the shell.
- It may display a clearly marked "Coming later" catalogue.
- Do not implement OAuth flows, API key creation, webhook delivery, connector credentials or external account linking.
- Do not display fake "Connected" states.
- Do not add integration secrets or tables to Supabase.

## 4. Secure public API prerequisites

Before enabling public API access:
- Define stable versioned schemas and documented endpoints.
- Decide session authentication versus API keys.
- Store API keys hashed where feasible; show secrets only once.
- Support key scopes, expiry, rotation and revocation.
- Enforce rate limits and quotas server-side.
- Meter usage server-side, not from client-reported values.
- Add request IDs, idempotency where appropriate and audit events.
- Separate user/tenant data and test authorization boundaries.
- Avoid raw data in logs.
- Define support and incident procedures.

## 5. Webhooks prerequisites

- Define event names and versioned payload schemas.
- Sign payloads and document signature verification.
- Support retries with bounded backoff.
- Include event IDs and delivery IDs.
- Provide replay protection and delivery logs.
- Ensure webhook destinations cannot be used for SSRF or internal network access.
- Let users rotate and revoke webhook secrets.

## 6. Automation connector prerequisites

Build connectors on the stable public API rather than directly exposing internal Python functions. Define:
- Authentication and connection lifecycle.
- Supported actions/triggers.
- Rate limits and retry behaviour.
- User consent and scope.
- Disconnect/revoke behaviour.
- Error handling and audit visibility.

## 7. Google Drive and GitHub prerequisites

- Use official OAuth flows and minimal scopes.
- Let users select files/repositories explicitly.
- Never scan or ingest all user content by default.
- Keep tokens server-side and encrypted at rest.
- Support disconnect and token revocation.
- Document third-party processing and retention.
- Preserve existing NUMPA privacy defaults.

## 8. Commercial/billing relationship

Integrations may eventually be subject to plan entitlements and usage quotas. Billing is a separate phase. Never trust frontend-only plan flags or usage totals. Do not add payment code in Phase 1.
