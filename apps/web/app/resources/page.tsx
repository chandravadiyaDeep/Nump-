import type { Metadata } from "next";
import { PublicCardGrid, PublicPage } from "../components/public-site";
import { resourceCards } from "../components/public-content";

export const metadata: Metadata = { title: "Data Science Resources | NUMPA", description: "Explore public datasets, cheat sheets, learning roadmaps and useful data tools." };
export default function ResourcesPage() {
  return <PublicPage eyebrow="RESOURCES" title="Useful resources for practical data work" description="A curated starting point for datasets, documentation, learning sequences and tools. Check source licences and terms before reuse."><PublicCardGrid cards={resourceCards} /></PublicPage>;
}
