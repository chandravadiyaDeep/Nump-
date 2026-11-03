# Landing demo sample dataset

File: `ecommerce_customers_synthetic.csv`

- Rows: 100 (97 unique base records plus 3 intentional duplicate rows)
- Columns: 12
- Source: Synthetic data generated deterministically for the NUMPA public-site demonstration.
- Purpose: Demonstrate dataset inspection, quality checks, simple charts and sample cleaning interactions.
- Collection date: None; this is generated data, not collected customer information.
- Last updated: 2026-11-03 (repository commit date; not a live data timestamp).
- License: Original synthetic demonstration data supplied with this repository.
- Personal data: No real customer records or identifiers are included.

The sample intentionally includes 96 missing cells (8% of the 1,200-cell grid), three duplicate rows and numeric outliers. Demo calculations run in the browser from this bundled sample. They are illustrative and are not calls to the production ML Readiness API or production customer analytics.

The sample is public static demo content. Never place an uploaded visitor dataset in this directory, localStorage, or source control.
