# NUMPA Platform Expansion Roadmap

**Product direction:** Services first; discovery and education support service adoption.  
**Status:** Approved direction, phased implementation.  
**Important:** The Search Intelligence Agent is intentionally deferred to a later phase and must not delay current platform work.

## 1. Product principle

NUMPA remains focused on helping people work with data and prepare datasets for machine learning. The footer, learning content, blog, tutorials, research and resources are supporting discovery channels. They must lead users toward useful services rather than distract from the product.

Do not create empty pages, fake capabilities or large collections of thin SEO pages merely to populate navigation.

## 2. Platform identity

NUMPA is a unified platform for data analysis, machine-learning readiness and practical data-science knowledge.

The current application workspaces remain the primary product experience. Public discovery pages should explain the services, help users learn, and provide useful resources.

## 3. Footer and discovery information architecture

### Products & Services

- Data Cleaning
- ML Readiness
- Dataset Analysis
- AI Tools

These entries should link to truthful service explanations and the actual available product workflows. Do not imply that a planned tool is already available.

### Learn

- Artificial Intelligence
- Machine Learning
- Data Science
- Python

Build structured learning hubs with curated tutorials and learning paths. Start with high-value, well-maintained material.

### Explore

- Blog
- Tutorials
- Infographics
- Research

Use these channels for original explanations, practical examples, visual learning and carefully sourced research.

### Resources

- Datasets
- Cheat Sheets
- Learning Roadmaps
- Useful Tools

Resource entries should include source, license/usage notes where relevant, format, update date and clear limitations. Do not redistribute material without permission.

### Community

- Write for NUMPA
- Authors
- Contributions

Provide transparent editorial/contribution guidelines. Submissions should be reviewed for accuracy, originality, attribution, quality and safety.

### Company

- About
- Contact
- Privacy
- Terms

Company/legal pages must contain accurate owner and operational information. Do not invent addresses, legal entities, contact details, certifications or privacy claims.

### Footer utility row

- Copyright notice.
- Verified social links.
- Contact link.
- Privacy and Terms links.

Only display social destinations that have been supplied and verified by the repository owner.

## 4. User journeys

1. Service-intent visitor → service explanation → open NUMPA workspace → complete a task.
2. Learning-intent visitor → learning hub → tutorial/resource → relevant service.
3. Research-intent visitor → research article → evidence and references → relevant service.
4. Contributor → contribution guidelines → submission/review process.
5. Returning visitor → blog/resources → new learning or service use.

Every page should have a clear purpose and a relevant next step without aggressive or misleading calls to action.

## 5. SEO, AEO and GEO foundations

- Give each substantive page a unique title, description, canonical URL and clear heading structure.
- Use descriptive internal links and logical topic hubs.
- Add structured data only when it accurately describes visible page content.
- Provide crawlable HTML content; do not hide essential content behind client-only interactions.
- Maintain sitemap and robots rules intentionally.
- Keep author, publication/update dates and citations visible where appropriate.
- Write direct, evidence-based answers to genuine user questions.
- Use original examples and transparent methodology.
- Do not promise rankings or AI answer inclusion.
- Avoid keyword stuffing, doorway pages, fake reviews, fabricated author credentials and unsubstantiated claims.

## 6. Implementation phases

### Phase A — Governance foundation

- Publish core protection, architecture, contributor, expansion and agent-spec documents.
- Establish clear green/amber/red contribution boundaries.
- Map actual current modules before any code relocation.

### Phase B — Footer and discovery navigation

- Implement responsive, accessible footer groups.
- Use only verified routes and destinations.
- Ensure links are not dead ends.
- Keep navigation concise and consistent with the services-first identity.
- Add accurate metadata and page-level structure where relevant.

### Phase C — Public discovery pages

- Build real service explanation pages.
- Create Learn, Explore and Resources hubs.
- Add About, Contact, Privacy and Terms only with accurate content.
- Establish editorial and contribution workflow before accepting submissions.

### Phase D — Publishing system

- Add a maintainable content model and publishing workflow.
- Support authorship, citations, publication/update dates, categories and related content.
- Keep drafts and unpublished material out of search indexing.
- Add content quality checks and broken-link review.

### Phase E — Content growth operations

- Build a repeatable editorial calendar.
- Prioritize content based on user needs and service relevance.
- Review performance and update outdated pages.
- Repurpose approved content into infographics and social posts.

### Phase F — Search Intelligence Agent (deferred)

This phase is intentionally backward in priority. It must not block Phases A–E or current NUMPA service implementation. The separate specification is maintained in `SEARCH_INTELLIGENCE_AGENT_SPEC.md` for future execution.

## 7. Success measures

Measure useful outcomes, not vanity page counts:

- Visitors reaching service pages from learning/resource pages.
- Service workspace starts and successful workflow completion.
- Organic landing-page engagement and qualified search traffic.
- Helpful content feedback and returning visitors.
- Broken-link rate, stale-content rate and page performance.
- Contributor submissions accepted and time to review.

Do not claim SEO, AEO or GEO success solely from impressions, page count or AI-generated visibility estimates.

## 8. Non-goals for this phase

- Do not build the Search Intelligence Agent now.
- Do not add new dataset processing engines as part of footer work.
- Do not change ML readiness formulas or API contracts.
- Do not add payment, usage metering, API key auth or connectors merely because they appear in the footer.
- Do not create fake social profiles, authors, community activity or testimonials.
- Do not restructure core directories before mapping dependencies.

## 9. Release gates

Before shipping public discovery changes:

- All destinations resolve and have meaningful content.
- Navigation is keyboard accessible and responsive.
- Metadata/canonical/indexability are correct.
- Structured data matches visible content.
- No invented capabilities or unsupported claims.
- Existing workspace and API workflows remain unaffected.
- Automated checks pass and a preview is reviewed.
