import type { Metadata } from "next";
import Link from "next/link";
import { PublicPage } from "../components/public-site";

export const metadata: Metadata = { title: "About NUMPA", description: "Learn about NUMPA's services-first approach to data analysis, data cleaning and machine-learning readiness." };
export default function AboutPage() {
  return <PublicPage eyebrow="ABOUT NUMPA" title="Better data workflows, supported by practical knowledge" description="NUMPA brings dataset inspection, cleaning and machine-learning readiness workflows together with educational resources for people working with data."><section className="public-detail-panel"><h2>Our product direction</h2><p>NUMPA is being developed as a services-first platform. The primary experience is the workspace: inspect a dataset, review cleaning operations, explore visual patterns and assess readiness for machine-learning tasks.</p><p>Learning guides, articles and resources support those workflows. They are not a substitute for the product and will be expanded gradually based on usefulness and quality.</p><Link className="public-primary-link" href="/services">Explore NUMPA services <span aria-hidden="true">→</span></Link></section></PublicPage>;
}
