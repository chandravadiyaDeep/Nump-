import type { Metadata } from "next";
import { PublicCardGrid, PublicPage } from "../components/public-site";
import { blogPosts } from "../components/public-content";

export const metadata: Metadata = { title: "NUMPA Blog — Data Cleaning and Machine Learning", description: "Practical articles about dataset quality, data cleaning and machine-learning workflows." };

export default function BlogPage() {
  const cards = blogPosts.map((post) => ({ title: post.title, description: post.summary, href: `/blog/${post.slug}`, eyebrow: post.category }));
  return <PublicPage eyebrow="NUMPA BLOG" title="Ideas for better data work" description="Practical, evidence-led articles about understanding datasets, cleaning data and building reliable machine-learning workflows."><PublicCardGrid cards={cards} /></PublicPage>;
}
