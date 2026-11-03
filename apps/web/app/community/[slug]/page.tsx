import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPage } from "../../components/public-site";

const repository = "https://github.com/chandravadiyaDeep/Nump-";
const pages: Record<string, { title: string; description: string; sections: { heading: string; body: string[] }[]; action: { label: string; href: string } }> = {
  "write-for-numpa": {
    title: "Write for NUMPA",
    description: "NUMPA welcomes useful, original educational ideas about data, AI and machine learning. The current submission route is a public repository contribution; no separate editorial submission form is offered yet.",
    sections: [
      { heading: "What makes a strong submission", body: ["Choose a specific reader problem and explain it clearly.", "Use original examples, cite authoritative sources and distinguish facts from opinion.", "Disclose AI assistance where relevant and verify every technical claim.", "Include publication/update context, limitations and accessible descriptions for meaningful visuals."] },
      { heading: "How to propose content", body: ["Read the editorial publishing guide first. Then open a GitHub issue describing the proposed topic, intended reader, outline and sources. Do not attach private datasets, secrets or copyrighted material you do not have permission to share.", "A proposal is not a promise of acceptance or publication. NUMPA may request revisions or decline material that does not meet its quality and safety standards."] },
    ],
    action: { label: "Read editorial publishing guide", href: `${repository}/blob/main/docs/content/EDITORIAL_PUBLISHING_GUIDE.md` },
  },
  authors: {
    title: "Authors",
    description: "Author attribution and editorial transparency are part of NUMPA's publishing standards.",
    sections: [
      { heading: "Attribution policy", body: ["Published articles should identify their actual author and, where relevant, technical reviewer. Credentials and affiliations must be accurate and verifiable.", "No author profiles are listed here until contributors have confirmed their details and approved publication. NUMPA does not invent author identities, biographies or credentials."] },
      { heading: "Author corrections", body: ["Authors can propose corrections through the repository issue tracker. Material corrections should be reviewed and reflected in the article's update information."] },
    ],
    action: { label: "View published NUMPA articles", href: "/blog" },
  },
  contributions: {
    title: "Contributions",
    description: "Help improve NUMPA through code, documentation, educational content and carefully sourced resources.",
    sections: [
      { heading: "Ways to contribute", body: ["Developers can improve code, tests, accessibility and documentation.", "Writers and researchers can propose original educational material with citations and clear limitations.", "Resource contributions should identify the original publisher, source URL, licence or terms where known, and the date checked.", "All contributions are reviewed for quality, security, accessibility and compatibility before publication."] },
      { heading: "Before opening a pull request", body: ["Read the contributor guidelines and production safety contract. Do not change protected production infrastructure, secrets, authentication settings, database schema or API contracts without the required approval.", "Never commit credentials, personal data, private datasets or unlicensed content."] },
    ],
    action: { label: "Read contributor guidelines", href: `${repository}/blob/main/docs/contribution/CONTRIBUTOR_GUIDELINES.md` },
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = pages[slug];
  return item ? { title: `${item.title} | NUMPA Community`, description: item.description } : {};
}

export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = pages[slug];
  if (!item) notFound();

  return (
    <PublicPage eyebrow="NUMPA COMMUNITY" title={item.title} description={item.description}>
      <div className="public-article">
        {item.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </div>
      {item.action.href.startsWith("/") ? (
        <Link className="public-primary-link" href={item.action.href}>{item.action.label} <span aria-hidden="true">→</span></Link>
      ) : (
        <a className="public-primary-link" href={item.action.href} target="_blank" rel="noopener noreferrer">{item.action.label} <span aria-hidden="true">↗</span></a>
      )}
    </PublicPage>
  );
}
