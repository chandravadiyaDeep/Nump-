import type { Metadata } from "next";
import { PublicPage } from "../components/public-site";

export const metadata: Metadata = {
  title: "Terms and Responsible Use | NUMPA",
  description: "Current product-use guidance for NUMPA's data analysis, cleaning and machine-learning readiness workflows.",
};

export default function TermsPage() {
  return (
    <PublicPage eyebrow="COMPANY · RESPONSIBLE USE" title="Terms and responsible use" description="Practical rules for using NUMPA's current data workflows responsibly.">
      <article className="public-article">
        <aside className="public-callout"><strong>Terms status:</strong> This page is a product-use summary, not a complete binding legal agreement. Formal terms require the service operator's verified legal identity, jurisdiction, contact details and legal review.</aside>
        <section><h2>Use only data you are allowed to process</h2><p>You are responsible for ensuring that you have the rights, permissions and lawful authority to upload, analyse, transform or otherwise use a dataset. Follow the dataset publisher's licence, attribution requirements, privacy restrictions and contractual terms.</p></section>
        <section><h2>Protect sensitive information</h2><p>Do not upload credentials, API keys, passwords, payment information, confidential records or sensitive personal information unless you are specifically authorized and have confirmed that NUMPA is appropriate for that data. Never publish another person's private information through public resources or issues.</p></section>
        <section><h2>Review transformations and outputs</h2><p>Inspect cleaning previews before execution. NUMPA is designed to keep the original source separate from a cleaned output, but you remain responsible for validating downloaded results before using them. Verify row counts, types, missing-value treatment and domain-specific rules.</p></section>
        <section><h2>Understand ML readiness results</h2><p>Readiness scores are explainable assessments of dataset characteristics and potential issues. They are heuristics, not guarantees of model accuracy, fairness, reliability, business outcomes or suitability for a regulated or high-impact decision. Perform appropriate validation and expert review before relying on a model.</p></section>
        <section><h2>Third-party resources</h2><p>NUMPA links to external datasets, documentation, software and learning resources. Those materials are maintained by their respective publishers and may have separate licences, terms, availability and privacy practices. Verify the original source before use.</p></section>
        <section><h2>Availability and changes</h2><p>Features, supported formats, usage limits and external integrations may change. Do not rely on NUMPA as the sole copy of important data or as a substitute for backups, independent validation or professional advice.</p></section>
        <section><h2>Formal terms</h2><p>A complete agreement covering the service operator, governing law, disclaimers, liability, dispute handling, account termination and other legal matters has not yet been published. This summary should not be treated as a substitute for that agreement.</p></section>
      </article>
    </PublicPage>
  );
}
