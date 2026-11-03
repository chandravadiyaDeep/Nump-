import Link from "next/link";
import SiteFooter from "./site-footer";
import type { ReactNode } from "react";

export type PublicCard = {
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
};

export function PublicSiteHeader() {
  return (
    <header className="public-site-header">
      <Link className="public-site-brand" href="/" aria-label="NUMPA workspace home">
        <span className="public-site-brand-mark" aria-hidden="true">N</span>
        <span>NUMPA</span>
      </Link>
      <nav aria-label="Public navigation">
        <Link href="/services">Services</Link>
        <Link href="/learn">Learn</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/resources">Resources</Link>
        <Link className="public-site-cta" href="/">Open workspace</Link>
      </nav>
    </header>
  );
}

export function PublicSiteFooter() {
  return <SiteFooter />;
}

export function PublicPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="public-page">
      <PublicSiteHeader />
      <div className="public-page-inner">
        <section className="public-page-hero">
          <p className="public-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        {children}
      </div>
      <PublicSiteFooter />
    </main>
  );
}

export function PublicCardGrid({ cards }: { cards: PublicCard[] }) {
  return (
    <div className="public-card-grid">
      {cards.map((card) => (
        <Link className="public-card" href={card.href} key={card.href}>
          {card.eyebrow ? <span className="public-card-eyebrow">{card.eyebrow}</span> : null}
          <h2>{card.title}</h2>
          <p>{card.description}</p>
          <span className="public-card-link">Explore <span aria-hidden="true">→</span></span>
        </Link>
      ))}
    </div>
  );
}

export function PublicArticle({
  updated,
  intro,
  sections,
  sources = [],
}: {
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  sources?: { label: string; url: string }[];
}) {
  return (
    <article className="public-article">
      <p className="public-article-updated">Updated {updated}</p>
      <p className="public-article-intro">{intro}</p>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets ? (
            <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
          ) : null}
        </section>
      ))}
      {sources.length > 0 ? (
        <section className="public-article-sources">
          <h2>Further reading</h2>
          <ul>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>
        </section>
      ) : null}
    </article>
  );
}

export function PublicCallout({ children }: { children: ReactNode }) {
  return <aside className="public-callout">{children}</aside>;
}
