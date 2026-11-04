# NUMPA Reporting and Export — Phase 4

**Status:** Metadata-only JSON and printable HTML export implemented on a feature branch; CI and review pending.

## Included report sections

- Dataset filename, file size, row/column counts, missing-cell and duplicate-row counts, and column names.
- Selected ML task and target context.
- Cleaning audit when available.
- ML readiness assessment when available.
- Cleaning before/after readiness comparison when available.
- Model comparison results when available.
- Transformation operation audit summaries after a successful preview.
- Feature-engineering operation audit summaries after a successful preview.
- Generation timestamp and report schema version.

## Export formats

- JSON: machine-readable report with schema version 1.
- Printable HTML: standalone report that can be opened in a browser and printed or saved as PDF by the user.

Direct server-generated PDF is not part of this increment. The printable HTML workflow avoids adding a PDF rendering dependency and keeps the report local to the browser.

## Privacy

- Report generation is client-side.
- Raw dataset rows, preview samples and source file contents are excluded.
- No report is uploaded, persisted, or added to Analysis History.
- The report includes metadata such as filenames and column names; users should review these before sharing.

## Limitations

- Only results currently held in the active browser session are included.
- Transformation and feature audit summaries contain operation metadata only; preview rows are excluded.
- Transformation and feature-operation audit summaries are not yet lifted into shared page state and therefore are not included in this release.
- No persistent report history, share links, scheduled reports, PDF service, or additional export formats.
