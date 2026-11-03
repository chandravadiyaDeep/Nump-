import type { Metadata } from "next";
import { PublicCardGrid, PublicPage } from "../components/public-site";
import { serviceCards } from "../components/public-content";

export const metadata: Metadata = {
  title: "NUMPA Services — Data Analysis, Cleaning and ML Readiness",
  description: "Explore NUMPA's dataset analysis, data cleaning and machine-learning readiness workflows.",
};

export default function ServicesPage() {
  return (
    <PublicPage eyebrow="NUMPA SERVICES" title="Make better decisions with better-prepared data" description="Understand a dataset, review cleaning operations and assess machine-learning readiness in one connected workspace.">
      <PublicCardGrid cards={serviceCards} />
    </PublicPage>
  );
}
