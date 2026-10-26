# Security, Privacy and Data Handling

## Status
This document defines required controls; it is not a certification or a claim that every control is already implemented.

## Data-handling defaults
- Treat uploads as confidential and untrusted.
- Process in memory where practical; do not persist raw datasets by default.
- Do not send datasets to AI services unless the product explains the purpose and obtains required consent.
- Use Supabase for auth and necessary account/feedback/configuration metadata unless a separate decision approves dataset storage.
- Ensure privacy statements match real processing, logging, hosting and third-party data flows.

## Upload and parser controls
- Enforce request byte limits before parsing and configure proxy limits too.
- Validate file content and parser compatibility; do not trust MIME type alone.
- Reject unsupported formats clearly.
- Add expanded-size limits and safe archive extraction before archive support.
- Set row, column, runtime, memory and concurrency limits.
- Never execute macros or embedded scripts from uploaded files.
- Use safe temporary paths and cleanup if disk-backed processing is introduced.

## Authorization and secrets
- Authenticate protected endpoints and authorize each resource on the server.
- Enable and test Supabase Row Level Security for user-owned records.
- Keep service-role keys and payment secrets server-side only.
- Use least privilege and separate dev/test/prod credentials.
- Never commit real keys, tokens, passwords or production environment files.
- Rotate exposed credentials immediately.

## Logs and retention
- Log request IDs, status, duration and resource usage only where useful.
- Never log raw rows, credentials, tokens or sensitive column values.
- Document retention and deletion before enabling persistence.
- If cloud storage is introduced, specify encryption, retention, deletion, access control and tenant isolation first.

## Release checklist
- [ ] Dependency and secret scans reviewed.
- [ ] Upload/parser limits tested.
- [ ] Unauthorized and cross-user access tests pass.
- [ ] CORS allows only required origins.
- [ ] Production secrets are outside Git.
- [ ] Logs exclude raw data and credentials.
- [ ] Privacy claims match observed data flows.
- [ ] Errors do not expose stack traces or internal paths.
