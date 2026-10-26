# ML Readiness Assessment Specification

## Purpose
The readiness score describes data preparation and task suitability. It does not predict model accuracy, profitability or business value.

## Planned task coverage
- Classification
- Regression
- Time-series forecasting
- Clustering

A task appearing in a request or score endpoint does not mean model evaluation for that task is already implemented. State support separately for scoring and training/evaluation.

## Assessment inputs
Dataset schema and quality profile, selected task, target for supervised tasks, intended algorithm when known, validation strategy, domain constraints and a versioned assessment configuration.

## Scoring requirements
- Deterministic code computes scores; AI cannot silently change scores, weights or thresholds.
- Explain each dimension, weight, evidence, penalty and threshold.
- Use task-specific checks.
- Support built-in presets and later configurable weights/thresholds.
- Validate configuration and document weight normalization.
- Version formulas and configurations.
- Warn when evidence is insufficient or a dimension cannot be assessed.
- Avoid false precision.

## Candidate dimensions to validate through research
Missingness, duplicates, entity integrity, type validity, target completeness/variation, class imbalance, sample size, timestamp continuity/gaps, clustering distance suitability, identifier-like features, leakage risk and algorithm prerequisites. These are candidates, not a finalized universal formula.

## Leakage rules
- Separate target and features explicitly.
- Fit imputers, scalers, encoders and selectors on training data only.
- Preserve chronology for forecasting.
- Use group-aware splits when entities or repeated observations require them.
- Document validation strategy for each model comparison.

## Evaluation plan
- Create curated datasets with known quality problems.
- Define expected explanations and score direction for controlled changes.
- Test monotonicity where intended.
- Review false positives/negatives.
- Compare scores across formula versions and document changes.
- Do not tune scores to one model's holdout metric without evidence.

## Response contract
Return task, target, score, formula version, dimension scores/weights/explanations, evidence, warnings, configuration version and caveat. Never fabricate an unavailable dimension.
