import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPage, PublicCallout } from "../../components/public-site";

const services: Record<string, { title: string; description: string; status: string; details: string[]; workspace: string }> = {
  "dataset-analysis": {
    title: "Dataset Analysis",
    description: "Understand the structure and quality signals in a dataset before deciding what to do next.",
    status: "Available in NUMPA workspace",
    details: ["Upload a supported dataset and inspect its structure.", "Review dimensions, data types and quality indicators returned by the analysis workflow.", "Use the findings to plan cleaning and further analysis."],
    workspace: "Data Analysis",
  },
  "data-cleaning": {
    title: "Data Cleaning",
    description: "Review proposed cleaning operations, inspect their preview and export a separate cleaned dataset.",
    status: "Available in NUMPA workspace",
    details: ["Inspect the source dataset first.", "Preview supported operations such as missing-value handling, exact duplicate removal and text normalization.", "Approve execution and download a separate cleaned CSV; the source remains unchanged."],
    workspace: "Data Preprocessing / Cleaning",
  },
  "ml-readiness": {
    title: "Machine-Learning Readiness",
    description: "Review dataset readiness signals for a selected machine-learning task.",
    status: "Available in NUMPA workspace",
    details: ["Assess supported task types: classification, regression, forecasting and clustering.", "Review dimensions, detected issues and caveats in the returned assessment.", "Use the score as an explainable heuristic, not a guarantee of model performance."],
    workspace: "ML Readiness",
  },
  "ai-tools": {
    title: "AI Tools",
    description: "NUMPA plans to expand its collection of focused AI-assisted tools over time.",
    status: "Planned — no standalone AI tools are being advertised as available here.",
    details: ["The current focus remains the working data-analysis and machine-learning workflows.", "Future tools will be added only when they provide a useful, tested capability."],
    workspace: "Data Analysis",
  },
};

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug];
  return service ? { title: `${service.title} | NUMPA`, description: service.description } : {};
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  return (
    <PublicPage eyebrow="PRODUCTS & SERVICES" title={service.title} description={service.description}>
      <section className="public-detail-panel">
        <span className="public-status">{service.status}</span>
        <h2>What this workflow helps you do</h2>
        <ul>{service.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
        <PublicCallout>NUMPA keeps the original uploaded source separate from cleaning outputs. Readiness results are assessments of dataset signals, not promises of model outcomes.</PublicCallout>
        <Link className="public-primary-link" href="/app">Open NUMPA workspace <span aria-hidden="true">→</span></Link>
      </section>
    </PublicPage>
  );
}
