import type { Metadata } from "next";
import { PublicPage } from "../components/public-site";

export const metadata: Metadata = {
  title: "Privacy and Data Handling | NUMPA",
  description: "A transparent overview of NUMPA&apos;s current account and dataset-processing architecture, with important policy limitations.",
};

export default function PrivacyPage() {
  return (
    <PublicPage eyebrow="COMPANY · TRANSPARENCY" title="Privacy and data handling" description="Understand the main services involved when you use NUMPA and how the current product is designed to handle uploaded datasets.">
      <article className="public-article">
        <aside className="public-callout"><strong>Policy status:</strong> This is a product-transparency overview, not a complete legal privacy notice. NUMPA&apos;s operator identity, contact details, applicable jurisdiction, legal bases, provider-specific retention periods and formal data-subject request process must be confirmed before this page can serve as a final legal policy.</aside>
        <section><h2>Account information</h2><p>NUMPA uses Supabase Authentication for email-based account registration, confirmation and sign-in. Authentication information is processed by Supabase to provide these account functions. Do not share passwords, one-time verification links or session tokens with anyone.</p><p>See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase&apos;s privacy information ↗</a> for details about the provider&apos;s own practices.</p></section>
        <section><h2>Uploaded datasets</h2><p>NUMPA&apos;s current dataset workflow sends the file you select to the NUMPA processing API for inspection, cleaning previews, cleaning execution or readiness analysis. The product is designed to process uploaded datasets in memory and does not intentionally save raw dataset files as part of the normal workflow. Cleaning produces a separate result so the original source is not silently overwritten.</p><p>This design statement is not a promise that network infrastructure, hosting providers or operational systems retain no request metadata. Do not upload personal, confidential, regulated or otherwise sensitive data unless you have the authority to do so and have assessed whether the service is appropriate for that data.</p></section>
        <section><h2>Service providers</h2><ul><li><strong>Vercel:</strong> hosts the NUMPA web application. Review <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel&apos;s privacy policy ↗</a>.</li><li><strong>Supabase:</strong> provides authentication services. Review <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase&apos;s privacy information ↗</a>.</li><li><strong>Render:</strong> hosts the NUMPA API. Review <a href="https://render.com/privacy" target="_blank" rel="noopener noreferrer">Render&apos;s privacy policy ↗</a>.</li></ul><p>These providers operate under their own terms and privacy documentation. Their processing, infrastructure logs and retention practices are not fully described by this NUMPA product overview.</p></section>
        <section><h2>Your responsibilities</h2><ul><li>Use only datasets you are authorized to upload and process.</li><li>Remove or anonymize personal information when it is not needed for your task.</li><li>Do not upload passwords, access tokens, payment details or secrets in datasets.</li><li>Contact the service operator through a verified channel for account or privacy questions once official contact details are published.</li></ul></section>
        <section><h2>Updates and formal policy</h2><p>This overview may change as NUMPA&apos;s services evolve. Before treating it as a complete privacy policy, the operator must add verified business identity and contact details, confirm the applicable legal requirements, document provider arrangements and publish accurate retention and request-handling procedures.</p></section>
      </article>
    </PublicPage>
  );
}
