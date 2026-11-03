import type { Metadata } from "next";
import Link from "next/link";
import { PublicPage } from "../components/public-site";

export const metadata: Metadata = { title: "Contact NUMPA", description: "Find the current public channel for NUMPA product questions and repository contributions." };
export default function ContactPage() {
  return <PublicPage eyebrow="CONTACT" title="Get in touch with NUMPA" description="For product feedback, bug reports and development contributions, use the public project repository."><section className="public-detail-panel"><h2>Product feedback and bug reports</h2><p>Share reproducible issues, feature suggestions and documentation improvements through the NUMPA GitHub repository. Do not post passwords, API keys, private datasets or other sensitive information in public issues.</p><a className="public-primary-link" href="https://github.com/chandravadiyaDeep/Nump-/issues" target="_blank" rel="noreferrer">Open NUMPA GitHub issues <span aria-hidden="true">↗</span></a><p className="public-small-note">A dedicated private support channel and verified business contact details have not yet been published.</p></section></PublicPage>;
}
