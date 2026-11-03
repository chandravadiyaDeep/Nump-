import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "../../components/public-site";

const pages: Record<string, { title: string; description: string; sections: { heading: string; body: string[] }[] }> = {
  "write-for-numpa": { title: "Write for NUMPA", description: "NUMPA welcomes useful, original educational ideas about data, AI and machine learning. A public submission channel will be added after editorial operations are ready.", sections: [{ heading: "What makes a strong submission", body: ["Choose a specific reader problem and explain it clearly.", "Use original examples, cite authoritative sources and distinguish facts from opinion.", "Disclose AI assistance where relevant and verify every technical claim."] }, { heading: "Current submission status", body: ["The editorial guidelines are published, but no public submission form or guaranteed publication process is currently offered."] }] },
  authors: { title: "Authors", description: "Author attribution and editorial transparency are part of NUMPA's publishing standards.", sections: [{ heading: "Attribution policy", body: ["Published articles should identify their actual author and, where relevant, technical reviewer. Credentials and affiliations must be accurate and verifiable.", "No author profiles are listed here until contributors have confirmed their details and approved publication."] }] },
  contributions: { title: "Contributions", description: "Help improve NUMPA through code, documentation, educational content and carefully sourced resources.", sections: [{ heading: "Ways to contribute", body: ["Developers can follow the repository contribution guidelines for code and documentation.", "Writers and researchers can prepare original educational material with citations and clear limitations.", "All contributions are reviewed for quality, security, accessibility and compatibility before publication."] }, { heading: "Repository guidelines", body: ["Read the NUMPA contributor guidelines in the public repository before opening a pull request."] }] },
};
export function generateStaticParams() { return Object.keys(pages).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const item = pages[slug]; return item ? { title: `${item.title} | NUMPA Community`, description: item.description } : {};
}
export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = pages[slug]; if (!item) notFound();
  return <PublicPage eyebrow="NUMPA COMMUNITY" title={item.title} description={item.description}><div className="public-article">{item.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div></PublicPage>;
}
