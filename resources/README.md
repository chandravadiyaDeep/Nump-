# NUMPA Resource Library

This folder is the shared knowledge library for NUMPA.

You can manually create folders and add files here at any time. Store domain-specific knowledge that ChatGPT, Claude, Codex, and other contributors may need to retrieve while researching, planning, or developing NUMPA.

This is a source library, not the place for final product specifications or approved architecture decisions.

## What you can add

- **Books and papers:** PDFs you are permitted to store, research papers, book notes, summaries, and bibliographic references.
- **Documentation:** official product docs, API references, technical guides, standards, and tutorials.
- **Links:** useful websites, repositories, articles, courses, videos, tools, and community discussions.
- **Domain knowledge:** concepts, workflows, methods, algorithms, implementation examples, and industry practices.
- **Competitor research:** product capabilities, pricing observations, feature comparisons, and dated source links.
- **Your own notes:** ideas, questions, extracted insights, and explanations.

## Suggested folder structure

Create only the folders you need. This is a suggested starting point, not a mandatory structure:

```text
resources/
├── README.md
├── data-engineering/
├── data-analysis/
├── data-cleaning-quality/
├── data-visualization/
├── data-science-ml/
├── ai-engineering/
├── forecasting-advanced-ai/
├── mlops/
├── workflow-automation/
├── reporting-governance/
├── product-and-business/
├── competitor-research/
└── general/
```

Inside any domain folder, organize material in whatever way is useful. For example:

```text
data-science-ml/
├── books/
├── papers/
├── documentation/
├── links.md
├── notes.md
└── workflows.md
```

You do not need to create this entire structure now. Add folders and files gradually as your library grows.

## How to record links

For collections of links, create a `links.md` file in the relevant domain folder. Use this format:

```markdown
## Resource title

- URL: https://example.com
- Type: Official documentation / paper / article / repository / course / video
- Domain: Data Science & ML
- Added: YYYY-MM-DD
- Why it matters: What this resource helps us understand or build.
- Key topics: Topic 1, Topic 2
- Status: To review / Reviewed / Outdated
```

Prefer the original source URL. Add the date for information that may change, such as pricing, product features, API limits, and library support.

## How to add books and documents

- Upload files into the relevant domain folder, preferably under `books/`, `papers/`, or `documentation/`.
- Use descriptive filenames, for example `Hands-on-Machine-Learning-3rd-Edition.pdf`.
- For large or copyrighted books, do not upload or redistribute material unless you have the right to do so. You can instead add a bibliographic entry, your own notes, and a lawful source link.
- For scanned or image-only documents, include a short `README.md` or notes file describing the document and its relevant topics.

## How this library will be used

When you ask for NUMPA research, architecture, workflow design, implementation planning, or a technical comparison, contributors should:

1. Search the relevant `resources/` domain folders first.
2. Read the most relevant documents and notes, not blindly ingest the entire library.
3. Follow source links when current or deeper verification is needed.
4. Distinguish source facts, personal notes, hypotheses, and recommendations.
5. Cite the exact resource or source when using it in a report.
6. Identify outdated, conflicting, or missing information rather than silently trusting it.
7. Summarize important findings in `human_report/` when they affect project decisions.

The library is intended to be provider-independent. No specific AI model or tool is the exclusive owner of any domain.

## Maintenance and safety rules

1. Prefer official documentation, primary research, original product pages, and reputable technical sources.
2. Record access dates for changing information.
3. Keep raw reference material separate from conclusions and approved decisions.
4. Do not store API keys, passwords, tokens, private customer data, or production datasets here.
5. Do not commit copyrighted books, paid-course content, or other material you are not authorized to redistribute.
6. Do not treat an uploaded resource as an approved NUMPA requirement. Product decisions must still be reviewed and recorded in `human_report/DECISION_REGISTER.md`.
7. When a source becomes outdated, mark it as outdated rather than silently deleting useful history.

## Relationship with project documentation

- `resources/` — source material, references, books, links, and domain knowledge.
- `human_report/` — project research reports, squad decisions, architecture proposals, risks, and planning history.
- Application documentation — approved technical specifications and implementation guidance in their designated project documentation locations.
