# NUMPA Curated Resource Directory

**Implementation:** `apps/web/app/components/resource-library.ts`  
**Public entry point:** `/resources`  
**Last reviewed:** 2026-11-03

## Purpose

The resource directory supports NUMPA's data-analysis, data-cleaning and ML-readiness services. It prioritizes original publishers, official documentation, public dataset repositories and maintained open-source projects.

The directory is a curated link index. NUMPA does not mirror third-party files or claim ownership of external resources.

## Categories

- Datasets: UCI, OpenML, Hugging Face, Kaggle, World Bank, India's Open Government Data platform and Google Dataset Search.
- Learning: official Python, NumPy, Google ML and framework learning resources.
- Documentation: Python, pandas, NumPy, Jupyter, SciPy, scikit-learn, PostgreSQL and Statsmodels.
- Data quality: Pandera, Great Expectations, Frictionless and Evidently.
- Visualization: Matplotlib, Seaborn, Observable Plot, Datawrapper Academy, Apache Superset and Metabase.
- Tools: Hugging Face Hub, GitHub, Kaggle Notebooks, DuckDB, Polars and DVC.

## Attribution and licensing rules

1. Link to the original publisher rather than copying or rehosting its material.
2. A public URL does not imply an open licence or permission to redistribute.
3. Dataset licences, citation requirements, privacy restrictions and terms vary by dataset. Users must inspect the original dataset card or publisher page.
4. Platform-level terms do not automatically apply to every item hosted on that platform. OpenML explicitly notes that individual datasets can have their own citation requests.
5. The directory's access labels are broad orientation only. "Free" does not mean public domain; "Open source" refers to the tool/project and does not grant rights to every dataset processed by it; "Mixed" means terms/features vary.
6. Remove or correct a link when its destination becomes unavailable, misleading or no longer meets editorial standards.

## User experience

- Search matches title, publisher, description, note and tags.
- Category filters are client-side and require no account or external API.
- Each resource card shows publisher, level, access orientation, usage note and original source link.
- Empty search results provide a clear reset action.
- Every resource page includes a visible reminder to verify licences and current terms at the source.

## Maintenance

Review links and descriptions at least quarterly and whenever a user reports a problem. Add resources only when they have a clear reader use case, a credible publisher and a verified destination. Do not add items merely to increase page count or search keywords.

## Known limitations

- This is a manually curated directory, not a live API catalogue.
- Availability and publisher terms can change between reviews.
- The current "level" labels are editorial guidance, not formal prerequisites or certification.
- The Privacy and Terms pages in this release are product-transparency summaries, not complete legal agreements. Operator identity, jurisdiction, contact, retention and formal legal review remain required before final legal publication.
- The footer's AI Tools item links to an explanatory page and remains labelled Planned; it is not a live standalone service.
