import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicArticle, PublicPage } from "../../components/public-site";
import { learnContent } from "../../components/public-content";

export function generateStaticParams() { return Object.keys(learnContent).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const item = learnContent[slug];
  return item ? { title: `${item.title} | NUMPA Learn`, description: item.description } : {};
}
export default async function LearnTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = learnContent[slug]; if (!item) notFound();
  return <PublicPage eyebrow="LEARNING GUIDE" title={item.title} description={item.description}><PublicArticle updated="November 3, 2026" intro={item.description} sections={item.sections} /></PublicPage>;
}
