import type { Metadata } from "next";
import Link from "next/link";
import SampleDataDemo from "./components/landing/sample-data-demo";
import SiteFooter from "./components/site-footer";

export const metadata: Metadata = {
  title: "NUMPA — Understand, Clean and Prepare Your Data",
  description: "Analyze structured datasets, understand data quality, preview cleaning and assess machine-learning readiness in one connected workflow.",
  alternates: { canonical: "/" },
};

const workflow = [
  { number: "01", title: "Upload", description: "Bring a CSV, Excel or other supported structured dataset." },
  { number: "02", title: "Inspect", description: "Understand columns, data types, missing values and duplicates." },
  { number: "03", title: "Assess", description: "Explore task-aware machine-learning readiness." },
  { number: "04", title: "Preview", description: "Review suggested cleaning changes before applying them." },
  { number: "05", title: "Compare", description: "Understand what changed in your dataset and assessment." },
  { number: "06", title: "Export", description: "Download your cleaned dataset and available reports." },
];

const services = [
  { number: "01", title: "Dataset Analysis", description: "Get a clear overview of your dataset, its structure, statistics and quality signals.", bullets: ["Column and data-type overview", "Missing-value and duplicate checks", "Useful descriptive statistics"], href: "/services/dataset-analysis" },
  { number: "02", title: "Data Cleaning", description: "Review data preparation operations and create a separate cleaned output.", bullets: ["Preview before applying", "Review cleaning operations", "Export the processed dataset"], href: "/services/data-cleaning" },
  { number: "03", title: "ML Readiness", description: "Evaluate data quality against a selected machine-learning task.", bullets: ["Task-aware assessment", "Explainable dimensions", "Before-and-after comparison"], href: "/services/ml-readiness" },
];

const audiences = [
  { title: "Freelance analysts", description: "Move from a raw client dataset to a clear, reviewable analysis and cleaning workflow." },
  { title: "Students", description: "Learn how data quality affects analysis and machine-learning preparation." },
  { title: "ML practitioners", description: "Check dataset characteristics before investing time in model experiments." },
  { title: "Researchers", description: "Explore structured data and make preparation steps easier to inspect." },
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <a className="landing-skip-link" href="#main-content">Skip to content</a>
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link href="/" className="landing-brand" aria-label="NUMPA home"><span className="landing-brand-mark">N</span><span>NUMPA</span></Link>
          <nav className="landing-nav" aria-label="Main navigation">
            <a href="#product">Product</a><a href="#how-it-works">How it works</a><a href="#live-demo">Live demo</a><a href="#use-cases">Who it helps</a><Link href="/learn">Learn</Link>
          </nav>
          <div className="landing-header-actions"><Link className="landing-login" href="/login">Log in</Link><Link className="landing-button landing-button-primary" href="/app">Start with your dataset <span aria-hidden="true">→</span></Link></div>
          <details className="landing-mobile-menu"><summary aria-label="Open navigation menu"><span></span><span></span><span></span></summary><nav aria-label="Mobile navigation"><a href="#product">Product</a><a href="#how-it-works">How it works</a><a href="#live-demo">Live demo</a><a href="#use-cases">Who it helps</a><Link href="/learn">Learn</Link><Link href="/login">Log in</Link><Link href="/app">Start with your dataset</Link></nav></details>
        </div>
      </header>
      <div id="main-content">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow"><span className="landing-eyebrow-dot"></span> A clearer way to work with data</p>
            <h1>Understand your data. <span>Improve its quality.</span> Prepare it for ML.</h1>
            <p className="landing-hero-description">Analyze structured datasets, discover quality issues, preview cleaning and understand machine-learning readiness — in one connected workflow.</p>
            <div className="landing-hero-actions"><Link className="landing-button landing-button-primary" href="/app">Start with your dataset <span aria-hidden="true">→</span></Link><a className="landing-button landing-button-secondary" href="#live-demo"><span aria-hidden="true">▷</span> Explore the demo</a></div>
            <div className="landing-hero-note"><span aria-hidden="true">✓</span> Explore the sample first. No upload needed.</div>
          </div>
          <div className="landing-hero-visual" aria-label="Illustration of a dataset analysis workspace">
            <div className="landing-preview-window"><div className="landing-preview-top"><div><i></i><i></i><i></i></div><span>NUMPA / Dataset overview</span><b>DEMO</b></div>
              <div className="landing-preview-body"><div className="landing-preview-sidebar"><span className="is-current">▦</span><span>⌁</span><span>▥</span><span>◉</span></div><div className="landing-preview-main">
                <div className="landing-preview-title"><span><small>DATASET OVERVIEW</small><strong>Customer data</strong></span><span className="landing-preview-chip">Sample</span></div>
                <div className="landing-preview-stats"><div><small>Rows</small><strong>100</strong></div><div><small>Columns</small><strong>12</strong></div><div><small>Dataset</small><strong>Sample</strong></div></div>
                <div className="landing-preview-chart"><div><strong>Data quality overview</strong><small>Illustrative interface preview</small></div><div className="landing-preview-bars"><i style={{height:"46%"}}></i><i style={{height:"76%"}}></i><i style={{height:"58%"}}></i><i style={{height:"92%"}}></i><i style={{height:"66%"}}></i><i style={{height:"82%"}}></i><i style={{height:"52%"}}></i><i style={{height:"70%"}}></i></div></div>
                <div className="landing-preview-bottom"><span><i></i> Structure inspected</span><span><i></i> Quality checks available</span></div>
              </div></div>
            </div><div className="landing-visual-caption">A connected workflow from dataset inspection to export.</div>
          </div>
        </section>
        <section className="landing-proof-strip" aria-label="Product principles"><span>Built for structured data</span><i></i><span>Review before cleaning</span><i></i><span>Explainable assessments</span><i></i><span>Privacy-conscious workflow</span></section>
        <section className="landing-section landing-product" id="product"><div className="landing-section-heading"><p className="landing-eyebrow">ONE CONNECTED WORKSPACE</p><h2>From raw dataset to a clearer next step.</h2><p>NUMPA brings the essential stages of data understanding and preparation together, so you can spend less time switching tools and more time understanding your data.</p></div>
          <div className="landing-service-grid">{services.map((service) => <article className="landing-service-card" key={service.number}><span className="landing-card-number">{service.number}</span><h3>{service.title}</h3><p>{service.description}</p><ul>{service.bullets.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><Link href={service.href}>Explore service <span aria-hidden="true">→</span></Link></article>)}
            <article className="landing-service-card landing-service-planned"><span className="landing-card-number">04</span><span className="landing-planned-label">Planned</span><h3>AI Tools</h3><p>A future collection of focused AI-assisted tools for data workflows.</p><p className="landing-planned-copy">Not available as a standalone service yet.</p></article>
          </div>
        </section>
        <SampleDataDemo />
        <section className="landing-section landing-workflow-section" id="how-it-works"><div className="landing-section-heading"><p className="landing-eyebrow">HOW IT WORKS</p><h2>Six steps. One understandable workflow.</h2><p>Move through each stage at your own pace. Review results before making changes to your source data.</p></div><div className="landing-workflow-grid">{workflow.map((step) => <article className="landing-workflow-step" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></section>
        <section className="landing-section landing-showcase"><div className="landing-section-heading"><p className="landing-eyebrow">BUILT AROUND YOUR WORK</p><h2>Useful detail, without unnecessary complexity.</h2><p>Explore the capabilities already available in the NUMPA workspace.</p></div><div className="landing-showcase-grid">
          <Link href="/services/dataset-analysis" className="landing-showcase-card"><span className="landing-showcase-icon">▦</span><div><h3>Understand the structure</h3><p>Inspect columns, data types, distributions and quality signals.</p></div><span className="landing-arrow">↗</span></Link>
          <Link href="/services/data-cleaning" className="landing-showcase-card"><span className="landing-showcase-icon">⌁</span><div><h3>Review before you clean</h3><p>Preview transformations and keep the original source separate.</p></div><span className="landing-arrow">↗</span></Link>
          <Link href="/services/ml-readiness" className="landing-showcase-card"><span className="landing-showcase-icon">◉</span><div><h3>Understand ML readiness</h3><p>Explore task-aware, explainable dataset assessments.</p></div><span className="landing-arrow">↗</span></Link>
        </div></section>
        <section className="landing-section landing-audience" id="use-cases"><div className="landing-section-heading"><p className="landing-eyebrow">WHO NUMPA HELPS</p><h2>Made for people who work with data.</h2></div><div className="landing-audience-grid">{audiences.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
        <section className="landing-trust"><div><p className="landing-eyebrow">DESIGNED WITH CARE</p><h2>Understand what happens to your data.</h2><p>NUMPA processes uploaded datasets in memory by default. Cleaning creates a separate result rather than silently overwriting your source. Readiness scores are explainable heuristics, not promises of model performance.</p><Link href="/about">Learn about NUMPA <span aria-hidden="true">→</span></Link></div><div className="landing-trust-points"><article><span>01</span><div><h3>Source stays separate</h3><p>Cleaning is a reviewed transformation that creates a separate output.</p></div></article><article><span>02</span><div><h3>Explainable estimates</h3><p>Readiness results help identify data considerations; they are not guarantees.</p></div></article><article><span>03</span><div><h3>In-memory by default</h3><p>Raw uploaded datasets are not persisted by default in the current workflow.</p></div></article></div></section>
        <section className="landing-section landing-learn"><div className="landing-section-heading"><p className="landing-eyebrow">KEEP LEARNING</p><h2>Build stronger data foundations.</h2><p>Explore practical guides, learning topics and resources alongside your work.</p></div><div className="landing-learn-grid"><Link href="/blog"><span>READ</span><h3>Articles & insights</h3><p>Practical explanations of data quality and machine learning.</p>Explore blog →</Link><Link href="/learn"><span>LEARN</span><h3>Learning guides</h3><p>Explore AI, machine learning, data science and Python topics.</p>Explore learning →</Link><Link href="/resources"><span>USE</span><h3>Data resources</h3><p>Find datasets, cheat sheets, roadmaps and useful tools.</p>Explore resources →</Link></div></section>
        <section className="landing-final-cta"><p className="landing-eyebrow">YOUR NEXT DATA WORKFLOW STARTS HERE</p><h2>Ready to understand your dataset?</h2><p>Start with your own file or explore the interactive sample first.</p><div><Link className="landing-button landing-button-primary" href="/app">Start with your dataset →</Link><a className="landing-button landing-button-secondary" href="#live-demo">Try the sample demo</a></div></section>
      </div>
      <SiteFooter />
    </main>
  );
}
