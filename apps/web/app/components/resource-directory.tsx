"use client";

import { useMemo, useState } from "react";
import { curatedResources, resourceCategories } from "./resource-library";

// Search and filter the source-attributed directory without a third-party service.
export default function ResourceDirectory({ initialCategory = "all" }: { initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");

  const resources = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return curatedResources.filter((resource) => {
      const matchesCategory = category === "all" || resource.category === category;
      const searchable = [resource.title, resource.publisher, resource.description, resource.note, ...resource.tags].join(" ").toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [category, query]);

  return (
    <section className="resource-directory" aria-label="Search curated data resources">
      <div className="resource-directory-controls">
        <label className="resource-search-label" htmlFor="resource-search">Search resources</label>
        <input id="resource-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try pandas, datasets, validation, charts…" />
        <div className="resource-filter-list" role="group" aria-label="Filter resources by category">
          {resourceCategories.map((item) => (
            <button key={item.id} type="button" className={category === item.id ? "is-active" : ""} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>
          ))}
        </div>
        <p className="resource-result-count" aria-live="polite">Showing {resources.length} of {curatedResources.length} curated resources</p>
      </div>

      {resources.length ? (
        <div className="resource-result-grid">
          {resources.map((resource) => (
            <article className="resource-result-card" key={resource.url}>
              <div className="resource-card-meta"><span>{resource.publisher}</span><span>{resource.level}</span></div>
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
              <div className="resource-tags">{resource.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <p className="resource-usage-note"><strong>{resource.access} · Usage note:</strong> {resource.note}</p>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">Visit original source <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      ) : (
        <div className="resource-empty-state"><h2>No matching resources</h2><p>Try a broader search or select another category.</p><button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>Clear filters</button></div>
      )}
      <p className="resource-directory-disclaimer">NUMPA curates links; it does not own or mirror these resources. Availability, licences, dataset conditions and third-party terms can change. Always verify details on the original publisher&apos;s page before downloading, using or redistributing material.</p>
    </section>
  );
}
