# NUMPA Public Content

This directory is the editorial source-of-truth area for public content planning and future content migrations.

## Current implementation

The initial public publishing registry is currently maintained in:

- `apps/web/app/components/public-content.ts`

It contains typed service, learning, exploration and resource directory data, plus the initial blog articles. This is intentionally dependency-free and compatible with the existing Next.js application.

## Public routes

- `/services` and `/services/[slug]`
- `/learn` and `/learn/[slug]`
- `/blog` and `/blog/[slug]`
- `/explore/[slug]`
- `/resources` and `/resources/[slug]`
- `/community/[slug]`
- `/about` and `/contact`

## Adding a blog article

1. Add a new article record to `blogPosts` in `public-content.ts`.
2. Use a unique, lowercase, hyphen-separated slug.
3. Include a specific title, accurate summary, category, update date, original introduction and useful sections.
4. Cite authoritative sources for factual or technical claims. Do not copy protected articles.
5. Add the slug to `apps/web/app/sitemap.ts`.
6. Check internal links, metadata, mobile layout and accessibility.
7. Run the web build and review the preview before merge.

Do not publish drafts, thin pages, unverified author biographies, fake testimonials or claims about features that are not available.

## Future CMS migration

A CMS or MDX migration may be considered when editorial volume justifies it. Preserve the route structure, metadata, author attribution, publication dates, canonical URLs and content history. Do not add a CMS dependency just for a small initial library.
