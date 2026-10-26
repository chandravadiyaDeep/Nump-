# NUMPA Release Checklist

Do not release based only on a successful build or green unit-test job.

## Product
- [ ] Upload → inspect → assess → preview cleaning → apply → reassess → export works end to end.
- [ ] Unsupported formats and size limits are clear.
- [ ] Original data remains unchanged.
- [ ] Cleaning changes and assumptions are auditable.
- [ ] Score caveats and dimension explanations are visible.
- [ ] Before/after comparison uses identified score versions.
- [ ] Reports match the actual processed dataset.

## Engineering
- [ ] CI passes on the exact release commit.
- [ ] Unit, API and end-to-end tests pass.
- [ ] Dependency strategy is documented.
- [ ] Upload limits, timeouts and resource limits are configured.
- [ ] No secrets or sensitive samples are committed.
- [ ] Errors are actionable and do not expose internals.
- [ ] Performance is measured at documented limits.

## Security and privacy
- [ ] Authentication and authorization are enforced where required.
- [ ] User resources are isolated.
- [ ] CORS and production origins are correct.
- [ ] Logs exclude raw data and credentials.
- [ ] Retention and deletion disclosures are accurate.
- [ ] Third-party data flows are documented.

## Deployment
- [ ] Health checks and smoke tests pass.
- [ ] Production secrets are configured.
- [ ] Rollback procedure is known.
- [ ] Known limitations and release notes are published.
- [ ] Feedback route is available.
- [ ] Public URL is tested in a clean browser session.

## Release record
Version/tag; commit SHA; CI run; deployment URL; test summary; known limitations; rollback plan; release date.
