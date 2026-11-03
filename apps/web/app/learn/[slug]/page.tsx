import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicArticle, PublicPage } from "../../components/public-site";
import { learnContent } from "../../components/public-content";

const references: Record<string, { label: string; url: string }[]> = {
  "artificial-intelligence": [
    { label: "Google for Developers — Foundational Machine Learning Courses", url: "https://developers.google.com/machine-learning/foundational-courses" },
    { label: "Google for Developers — Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course/" },
    { label: "Hugging Face — Datasets documentation", url: "https://huggingface.co/docs/hub/datasets-overview" },
  ],
  "machine-learning": [
    { label: "scikit-learn — User Guide", url: "https://scikit-learn.org/stable/user_guide.html" },
    { label: "scikit-learn — Common pitfalls and recommended practices", url: "https://scikit-learn.org/stable/common_pitfalls.html" },
    { label: "Google — Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course/" },
  ],
  "data-science": [
    { label: "pandas — User Guide", url: "https://pandas.pydata.org/docs/user_guide/" },
    { label: "NumPy — Learn", url: "https://numpy.org/learn/" },
    { label: "Matplotlib — Tutorials", url: "https://matplotlib.org/stable/tutorials/" },
  ],
  python: [
    { label: "Python — Official Tutorial", url: "https://docs.python.org/3/tutorial/" },
    { label: "pandas — Getting started", url: "https://pandas.pydata.org/docs/getting_started/" },
    { label: "NumPy — Absolute beginners", url: "https://numpy.org/doc/stable/user/absolute_beginners.html" },
  ],
};

export function generateStaticParams() {
  return Object.keys(learnContent).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = learnContent[slug];
  return item ? { title: `${item.title} | NUMPA Learn`, description: item.description } : {};
}

export default async function LearnTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = learnContent[slug];
  if (!item) notFound();

  return (
    <PublicPage eyebrow="LEARNING GUIDE" title={item.title} description={item.description}>
      <PublicArticle updated="November 3, 2026" intro={item.description} sections={item.sections} sources={references[slug] ?? []} />
      <section className="learn-next-step">
        <div><h2>Put the concepts into practice</h2><p>Use a dataset you are authorized to work with. Start by inspecting its structure and quality before choosing transformations or models.</p></div>
        <Link className="public-primary-link" href="/app">Open NUMPA workspace <span aria-hidden="true">→</span></Link>
      </section>
    </PublicPage>
  );
}
