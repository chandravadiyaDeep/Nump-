import type { Metadata } from "next";
import { PublicPage } from "../components/public-site";
import ResourceDirectory from "../components/resource-directory";
import { curatedResources } from "../components/resource-library";

export const metadata: Metadata = {
  title: "Data Science Resources | NUMPA",
  description: "Search a curated directory of public datasets, official documentation, learning courses, data-quality tools and visualization resources.",
};

export default function ResourcesPage() {
  return (
    <PublicPage
      eyebrow="NUMPA RESOURCE LIBRARY"
      title="A practical directory for better data work"
      description={`Explore ${curatedResources.length} curated resources from original publishers, open-source projects and established learning platforms. Search by topic, skill level or tool.`}
    >
      <ResourceDirectory />
    </PublicPage>
  );
}
