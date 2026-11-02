"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import AuthNav from "./auth-nav";

const destinations = [
  { label: "Data Analysis", icon: "⌕", description: "Inspect a dataset and review its quality." },
  { label: "Data Preprocessing / Cleaning", icon: "☷", description: "Review and prepare cleaning operations." },
  { label: "Data Visualization", icon: "▥", description: "Explore distributions and relationships." },
  { label: "ML Readiness", icon: "◉", description: "Assess dataset readiness for a selected task." },
  { label: "ML Lab", icon: "⚗", description: "Compare supported model workflows." },
  { label: "Analysis History", icon: "◷", description: "Review previous analysis reports." },
  { label: "Settings", icon: "⚙", description: "Manage account and workspace preferences." },
] as const;

type Theme = "light" | "dark";
type Section = (typeof destinations)[number]["label"];

export default function WorkspaceShell({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<Section>("Data Analysis");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("numpa-theme");
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    } catch {
      // Keep the light default if browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!mobileOpen) return;
    drawer.current?.querySelector<HTMLButtonElement>(".workspace-nav-item")?.focus();

    function handleDrawerKeys(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !drawer.current) return;
      const focusable = Array.from(
        drawer.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'),
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!drawer.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleDrawerKeys);
    return () => document.removeEventListener("keydown", handleDrawerKeys);
  }, [mobileOpen]);

  function chooseSection(label: Section) {
    setSection(label);
    closeDrawer();
  }

  const restoreDrawerFocus = useRef(false);

  function closeDrawer() {
    if (!mobileOpen) return;
    restoreDrawerFocus.current = true;
    setMobileOpen(false);
  }

  useEffect(() => {
    if (mobileOpen || !restoreDrawerFocus.current) return;
    restoreDrawerFocus.current = false;
    menuTrigger.current?.focus();
  }, [mobileOpen]);

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    // Persist only the appearance preference; dataset files and results remain in memory.
    try {
      window.localStorage.setItem("numpa-theme", nextTheme);
    } catch {
      // Theme switching still works for this session if browser storage is unavailable.
    }
  }

  const current = destinations.find((destination) => destination.label === section)!;

  return (
    <div className={`workspace-shell${collapsed ? " is-collapsed" : ""}`} data-theme={theme}>
      {mobileOpen && (
        <button
          className="workspace-drawer-scrim"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => {
            closeDrawer();
          }}
        />
      )}
      <aside
        className={`workspace-sidebar${mobileOpen ? " is-mobile-open" : ""}`}
        ref={drawer}
        aria-label="Primary navigation"
        aria-modal={mobileOpen || undefined}
        role={mobileOpen ? "dialog" : undefined}
        id="workspace-navigation"
      >
        <div className="workspace-brand-row">
          <a className="workspace-brand" href="/" aria-label="NUMPA home">
            <span className="workspace-brand-mark" aria-hidden="true">N</span>
            <span className="workspace-brand-name">NUMPA</span>
          </a>
          <button
            className="workspace-icon-button workspace-collapse-button"
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((value) => !value)}
          >
            <span aria-hidden="true">{collapsed ? "»" : "«"}</span>
          </button>
          <button
            className="workspace-icon-button workspace-drawer-close"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => {
              closeDrawer();
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="workspace-nav" aria-label="Workspace sections">
          {destinations.map(({ label, icon }) => (
            <button
              className={`workspace-nav-item${section === label ? " is-active" : ""}`}
              key={label}
              type="button"
              title={collapsed ? label : undefined}
              aria-label={label}
              aria-current={section === label ? "page" : undefined}
              onClick={() => chooseSection(label)}
            >
              <span className="workspace-nav-icon" aria-hidden="true">{icon}</span>
              <span className="workspace-nav-label">{label}</span>
            </button>
          ))}
        </nav>

        <div className="workspace-sidebar-footer">
          <span className="workspace-sidebar-footer-mark" aria-hidden="true">N</span>
          <span className="workspace-nav-label">Workspace foundation</span>
        </div>
      </aside>

      <div className="workspace-main" inert={mobileOpen}>
        <header className="workspace-topbar">
          <div className="workspace-title-group">
            <button
              className="workspace-icon-button workspace-menu-button"
              type="button"
              ref={menuTrigger}
              aria-label="Open navigation menu"
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              aria-controls="workspace-navigation"
              onClick={() => setMobileOpen(true)}
            >
              <span aria-hidden="true">☰</span>
            </button>
            <div>
              <p className="workspace-context">NUMPA WORKSPACE</p>
              <p className="workspace-section-title" role="heading" aria-level={1}>{section}</p>
            </div>
          </div>
          <div className="workspace-topbar-actions">
            <span className="workspace-dataset-context">
              {section === "Data Analysis" ? "Dataset Quality Studio" : "Commercial V1"}
            </span>
            <button
              className="workspace-theme-button"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
              <span className="workspace-theme-label">{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </button>
            <AuthNav />
          </div>
        </header>

        <main className="workspace-content" id="main-content">
          {section === "Data Analysis" ? children : (
            <section className="workspace-coming-soon" aria-labelledby="coming-soon-title">
              <span className="workspace-coming-icon" aria-hidden="true">{current.icon}</span>
              <p className="workspace-context">WORKSPACE SECTION</p>
              <h2 id="coming-soon-title">{section}</h2>
              <p>{current.description}</p>
              <div className="workspace-planned-badge">Coming soon</div>
              {section === "Settings" && (
                <p className="workspace-settings-note">
                  Appearance is available in the top bar. Integrations will be managed within Settings when that workspace is built.
                </p>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
