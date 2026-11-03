"use client";

import Link from "next/link";

const footerGroups = [
  {
    title: "Products & Services",
    links: [
      { label: "Data Cleaning", href: "/services/data-cleaning" },
      { label: "ML Readiness", href: "/services/ml-readiness" },
      { label: "Dataset Analysis", href: "/services/dataset-analysis" },
      { label: "AI Tools", href: "/services/ai-tools", planned: true },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Artificial Intelligence", href: "/learn/artificial-intelligence" },
      { label: "Machine Learning", href: "/learn/machine-learning" },
      { label: "Data Science", href: "/learn/data-science" },
      { label: "Python", href: "/learn/python" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Tutorials", href: "/explore/tutorials" },
      { label: "Infographics", href: "/explore/infographics" },
      { label: "Research", href: "/explore/research" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Datasets", href: "/resources/datasets" },
      { label: "Cheat Sheets", href: "/resources/cheat-sheets" },
      { label: "Learning Roadmaps", href: "/resources/learning-roadmaps" },
      { label: "Useful Tools", href: "/resources/useful-tools" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Write for NUMPA", href: "/community/write-for-numpa" },
      { label: "Authors", href: "/community/authors" },
      { label: "Contributions", href: "/community/contributions" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "", planned: true },
      { label: "Terms", href: "", planned: true },
    ],
  },
] as const;

export default function SiteFooter() {
  return (
    <footer className="numpa-site-footer" aria-label="NUMPA site footer">
      <div className="numpa-footer-main">
        <div className="numpa-footer-brand">
          <Link className="numpa-footer-logo" href="/" aria-label="NUMPA workspace home">
            <span className="numpa-footer-mark" aria-hidden="true">N</span>
            <span>NUMPA</span>
          </Link>
          <p>Practical tools and knowledge for data analysis, data preparation and machine-learning readiness.</p>
          <span className="numpa-footer-note">Services first. Useful knowledge alongside them.</span>
        </div>

        {footerGroups.map((group) => (
          <nav className="numpa-footer-group" aria-label={group.title} key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.label}>
                  {"planned" in link && link.planned ? (
                    <span className="numpa-footer-planned" aria-disabled="true">
                      {link.label}<span className="numpa-footer-status">Planned</span>
                    </span>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="numpa-footer-bottom">
        <p>© {new Date().getFullYear()} NUMPA. All rights reserved.</p>
        <p>Explore services, practical learning and carefully sourced resources.</p>
      </div>
    </footer>
  );
}
