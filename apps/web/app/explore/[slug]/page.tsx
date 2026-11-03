import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPage, PublicCallout } from "../../components/public-site";

const hubs: Record<string, { title: string; description: string; items: string[] }> = {
  tutorials: { title: "Tutorials", description: "Step-by-step guides that connect concepts to practical data workflows.", items: ["Start with a clear question and inspect the dataset before transforming it.", "Document each cleaning decision and compare the source with the cleaned output.", "For machine learning, keep preprocessing inside the training and validation pipeline to avoid leakage."] },
  infographics: { title: "Infographics", description: "A growing visual-learning collection for data and machine-learning concepts.", items: ["Dataset lifecycle: collect, inspect, prepare, analyse and communicate.", "Train/validation/test split: understand what each partition is used for.", "Data leakage: recognize how information can cross the evaluation boundary."] },
  research: { title: "Research", description: "Evidence-led notes that explain methods, sources and limitations.", items: ["Research notes will include source links, publication dates and a transparent method.", "Claims will distinguish published evidence from interpretation and estimates.", "NUMPA will not invent benchmarks, search volumes or competitor performance figures."] },
};
export function generateStaticParams() { return Object.keys(hubs).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const item = hubs[slug];
  return item ? { title: `${item.title} | NUMPA Explore`, description: item.description } : {};
}
export default async function ExploreHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = hubs[slug]; if (!item) notFound();
  return <PublicPage eyebrow="EXPLORE NUMPA" title={item.title} description={item.description}><section className="public-detail-panel"><h2>What you will find</h2><ul>{item.items.map((entry) => <li key={entry}>{entry}</li>)}</ul><PublicCallout>New material will be added when it has been reviewed for usefulness, accuracy and source quality. This hub does not claim a larger published library than currently exists.</PublicCallout><Link className="public-primary-link" href="/blog">Read NUMPA articles <span aria-hidden="true">→</span></Link></section></PublicPage>;
}
