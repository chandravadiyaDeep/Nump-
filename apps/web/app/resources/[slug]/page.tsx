import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicArticle, PublicPage } from "../../components/public-site";
import { resourceContent } from "../../components/public-content";

export function generateStaticParams() { return Object.keys(resourceContent).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const item = resourceContent[slug];
  return item ? { title: `${item.title} | NUMPA Resources`, description: item.description } : {};
}
export default async function ResourceTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = resourceContent[slug]; if (!item) notFound();
  return <PublicPage eyebrow="RESOURCE LIBRARY" title={item.title} description={item.description}><PublicArticle title={item.title} updated="November 3, 2026" intro={item.description} sections={item.sections} /></PublicPage>;
}
