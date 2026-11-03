import type { Metadata } from "next";
import { PublicCardGrid, PublicPage } from "../components/public-site";
import { learnCards } from "../components/public-content";

export const metadata: Metadata = { title: "Learn AI, Machine Learning, Data Science and Python | NUMPA", description: "Explore practical learning guides for artificial intelligence, machine learning, data science and Python." };

export default function LearnPage() {
  return <PublicPage eyebrow="LEARN" title="Build practical data and AI skills" description="Start with clear foundations, follow structured topics and connect what you learn to real data workflows."><PublicCardGrid cards={learnCards} /></PublicPage>;
}
