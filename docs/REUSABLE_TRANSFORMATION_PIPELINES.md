# NUMPA Reusable Transformation Pipelines — Phase 2C

**Status:** Implemented on a feature branch; CI and review pending.
**Format version:** 1
**Scope:** Reusable operation definitions for the existing safe transformation API.

## User workflow

1. Inspect a source dataset.
2. Build an ordered list of supported transformations in the Transformation Studio.
3. Name and save the operation list for the current browser session.
4. Export a versioned JSON definition to reuse it in a later session or share it.
5. Import a JSON definition and review its operations.
6. Preview the imported pipeline against the currently selected source dataset.
7. Explicitly approve execution to download a separate transformed CSV.

## Pipeline format

A version 1 pipeline is a JSON object with:
- `name`: descriptive pipeline name.
- `version`: integer `1`.
- `operations`: ordered list of 1–25 allow-listed transformation operations.

Supported operation types and fields are defined by `docs/TRANSFORMATION_ENGINE_SPEC.md`. No arbitrary expressions, scripts, SQL, shell commands, or user-supplied code are supported.

## Data and privacy boundaries

- Session-saved pipeline definitions are held in component memory only.
- JSON export contains transformation instructions, never dataset rows, source files, credentials, or API tokens.
- Import is limited to 64 KB and validates version, operation count, operation type, column names, rename names, filter operators and value types before loading.
- A successful import does not mean the pipeline is valid for the current dataset. The user must preview it against the active source; the API performs authoritative validation.
- Pipelines are not uploaded or persisted to Supabase, Render, or any server.
- No automatic execution occurs on import or load.
- Source files remain immutable; execute produces a separate CSV.

## Deliberate limitations

This increment does not implement server-side pipeline storage, team sharing, scheduling, connector triggers, parameterized templates, schema migration, or automatic column remapping. A pipeline referring to columns absent from a new dataset will fail preview safely and must be edited by the user.

## Verification gates

- Web lint and production build must pass.
- Existing API transformation tests must remain green.
- Review import validation and ensure no raw data is present in exported JSON.
- Manual browser review should cover desktop/mobile and light/dark themes.
