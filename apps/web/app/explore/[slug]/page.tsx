import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPage, PublicCallout } from "../../components/public-site";

const hubs: Record<string, { title: string; description: string; items: string[]; sources: { label: string; url: string }[]; next: string }> = {
  tutorials: {
    title: "Tutorials",
    description: "Step-by-step guides that connect concepts to practical data workflows.",
    items: [
      "Start with a clear question and inspect the dataset before transforming it.",
      "Document each cleaning decision and compare the source with the cleaned output.",
      "For machine learning, keep preprocessing inside the training and validation pipeline to avoid leakage.",
      "Use a small, documented dataset and reproduce each step before scaling the workflow.",
    ],
    sources: [
      { label: "pandas — Getting started tutorials", url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/" },
      { label: "scikit-learn — Common pitfalls", url: "https://scikit-learn.org/stable/common_pitfalls.html" },
      { label: "Google — Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course/" },
    ],
    next: "Start with dataset inspection and cleaning in NUMPA.",
  },
  infographics: {
    title: "Infographics",
    description: "Visual explanations of data and machine-learning concepts, supported by readable explanations and source links.",
    items: [
      "Dataset lifecycle: collect, inspect, prepare, analyse and communicate.",
      "Train/validation/test split: understand what each partition is used for.",
      "Data leakage: recognize how information can cross the evaluation boundary.",
      "Missing values: distinguish measurement gaps, structural missingness and recording failures.",
      "Chart selection: match visual encodings to the question and data type.",
    ],
    sources: [
      { label: "scikit-learn — Cross-validation", url: "https://scikit-learn.org/stable/modules/cross_validation.html" },
      { label: "pandas — Missing data", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html" },
      { label: "Datawrapper Academy", url: "https://academy.datawrapper.de/" },
    ],
    next: "Explore a dataset and inspect its quality signals.",
  },
  research: {
    title: "Research",
    description: "Evidence-led notes that explain methods, sources and limitations.",
    items: [
      "Research notes include source links, publication or update context and a transparent method.",
      "Claims distinguish published evidence from interpretation and estimates.",
      "Dataset licences and provenance are checked at the original publisher.",
      "Benchmarks are meaningful only when task definitions, splits, metrics and data versions are comparable.",
    ],
    sources: [
      { label: "OpenML — Open licences and citation guidance", url: "https://www.openml.org/terms" },
      { label: "scikit-learn — Model evaluation and validation", url: "https://scikit-learn.org/stable/model_selection.html" },
      { label: "UCI Machine Learning Repository", url: "https://archive.ics.uci.edu/" },
    ],
    next: "Use NUMPA's ML Readiness assessment as an initial diagnostic, not a substitute for validation.",
  },
};

export function generateStaticParams() {
  return Object.keys(hubs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = hubs[slug];
  return item ? { title: `${item.title} | NUMPA Explore`, description: item.description } : {};
}

export default async function ExploreHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = hubs[slug];
  if (!item) notFound();

  return (
    <PublicPage eyebrow="EXPLORE NUMPA" title={item.title} description={item.description}>
      <section className="public-detail-panel">
        <h2>Explore this topic</h2>
        <ul>{item.items.map((entry) => <li key={entry}>{entry}</li>)}</ul>
        <h2>Trusted sources and further reading</h2>
        <ul>{item.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ul>
        <PublicCallout>New material will be added when it has been reviewed for usefulness, accuracy and source quality. NUMPA does not claim a larger published library than currently exists.</PublicCallout>
        <p>{item.next}</p>
        <Link className="public-primary-link" href="/app">Open NUMPA workspace <span aria-hidden="true">→</span></Link>
      </section>
    </PublicPage>
  );
}
