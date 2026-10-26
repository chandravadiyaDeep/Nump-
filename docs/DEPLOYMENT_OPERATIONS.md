# Deployment and Operations Plan

## Current status
The repository has an initial FastAPI backend and a GitHub Actions test workflow. A complete web application and production deployment are separate tasks. A repository URL or passing CI job is not a live product URL.

## Environments
Maintain development, preview/test and production environments with distinct credentials. Never copy production user data into development.

## Deployment sequence
1. Confirm CI is green on the exact commit.
2. Deploy frontend and backend as separate units if the architecture requires it.
3. Configure exact production CORS origins and TLS.
4. Configure request size limits, timeouts and health checks.
5. Verify environment secrets are in the hosting secret store.
6. Smoke-test health, upload, cleaning, readiness and downloads with synthetic data.
7. Inspect sanitized logs and resource use.
8. Record rollback instructions and the last known-good release.

## Monitoring
Track aggregate request count, errors, endpoint latency, upload sizes, processing duration, CPU/memory, worker saturation and job failures. Avoid raw dataset values and credentials in logs.

## Scaling triggers
Do not add queues, distributed workers, object storage or a dataset database until measurements and requirements justify them. When background jobs are needed, define job IDs, status, cancellation, expiry, retry rules and idempotency.

## Incident response
Identify the release and impact, roll back or disable the failing feature, protect user data, rotate exposed credentials, retain sanitized diagnostics, and add a regression test.

## Release record
Version/tag, commit SHA, CI result, migration notes, environment changes, known limitations and rollback procedure.
