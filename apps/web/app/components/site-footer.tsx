"use client";

type WorkspaceDestination = "Data Analysis" | "Data Preprocessing / Cleaning" | "Data Visualization" | "ML Readiness" | "ML Lab" | "Analysis History" | "Settings";

type SiteFooterProps = {
  onNavigate: (destination: WorkspaceDestination) => void;
};

const footerGroups = [
  {
    title: "Products & Services",
    links: [
      { label: "Data Cleaning", destination: "Data Preprocessing / Cleaning" as const, available: true },
      { label: "ML Readiness", destination: "ML Readiness" as const, available: true },
      { label: "Dataset Analysis", destination: "Data Analysis" as const, available: true },
      { label: "AI Tools", available: false },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Artificial Intelligence", available: false },
      { label: "Machine Learning", available: false },
      { label: "Data Science", available: false },
      { label: "Python", available: false },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Blog", available: false },
      { label: "Tutorials", available: false },
      { label: "Infographics", available: false },
      { label: "Research", available: false },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Datasets", available: false },
      { label: "Cheat Sheets", available: false },
      { label: "Learning Roadmaps", available: false },
      { label: "Useful Tools", available: false },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Write for NUMPA", available: false },
      { label: "Authors", available: false },
      { label: "Contributions", available: false },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", available: false },
      { label: "Contact", available: false },
      { label: "Privacy", available: false },
      { label: "Terms", available: false },
    ],
  },
] as const;

export default function SiteFooter({ onNavigate }: SiteFooterProps) {
  return (
    <footer className="numpa-site-footer" aria-label="NUMPA site footer">
      <div className="numpa-footer-main">
        <div className="numpa-footer-brand">
          <a className="numpa-footer-logo" href="#main-content" aria-label="NUMPA workspace home">
            <span className="numpa-footer-mark" aria-hidden="true">N</span>
            <span>NUMPA</span>
          </a>
          <p>
            Practical tools and knowledge for data analysis, data preparation and machine-learning readiness.
          </p>
          <span className="numpa-footer-note">Services first. Useful knowledge alongside them.</span>
        </div>

        {footerGroups.map((group) => (
          <nav className="numpa-footer-group" aria-label={group.title} key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.label}>
                  {"available" in link && link.available && "destination" in link ? (
                    <button type="button" onClick={() => onNavigate(link.destination)}>{link.label}</button>
                  ) : (
                    <span className="numpa-footer-planned" aria-disabled="true">
                      {link.label}
                      <span className="numpa-footer-status">Planned</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="numpa-footer-bottom">
        <p>© {new Date().getFullYear()} NUMPA. All rights reserved.</p>
        <p>More learning, resources and community destinations will be published as they become useful and ready.</p>
      </div>
    </footer>
  );
}
