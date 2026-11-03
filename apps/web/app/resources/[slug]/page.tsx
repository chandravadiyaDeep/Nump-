import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "../../components/public-site";
import ResourceDirectory from "../../components/resource-directory";
import { resourceContent } from "../../components/public-content";

const categoryBySlug: Record<string, string> = {
  datasets: "datasets",
  "cheat-sheets": "documentation",
  "learning-roadmaps": "learning",
  "useful-tools": "tools",
};

export function generateStaticParams() {
  return Object.keys(resourceContent).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = resourceContent[slug];
  return item ? { title: `${item.title} | NUMPA Resources`, description: item.description } : {};
}

export default async function ResourceTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = resourceContent[slug];
  if (!item) notFound();

  return (
    <PublicPage eyebrow="RESOURCE LIBRARY" title={item.title} description={item.description}>
      <section className="resource-topic-intro">
        <h2>Start with trustworthy sources</h2>
        <p>Explore original repositories, official documentation and learning material. NUMPA adds context to help you choose a starting point; the publisher remains the source of truth.</p>
        <ul>{item.sections.flatMap((section) => section.bullets ?? []).map((entry) => <li key={entry}>{entry}</li>)}</ul>
      </section>
      <ResourceDirectory initialCategory={categoryBySlug[slug] ?? "all"} />
    </PublicPage>
  );
}
