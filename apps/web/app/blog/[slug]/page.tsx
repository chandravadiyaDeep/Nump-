import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicArticle, PublicPage } from "../../components/public-site";
import { blogPosts } from "../../components/public-content";

export function generateStaticParams() { return blogPosts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const post = blogPosts.find((item) => item.slug === slug);
  return post ? { title: `${post.title} | NUMPA Blog`, description: post.summary } : {};
}
export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = blogPosts.find((item) => item.slug === slug); if (!post) notFound();
  return <PublicPage eyebrow={`BLOG / ${post.category.toUpperCase()}`} title={post.title} description={post.summary}><PublicArticle title={post.title} updated={post.updated} intro={post.intro} sections={post.sections} /></PublicPage>;
}
