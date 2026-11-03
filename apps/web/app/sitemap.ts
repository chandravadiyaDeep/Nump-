import type { MetadataRoute } from "next";

const baseUrl = "https://numpa.online";

// Keep this list aligned with the public routes and statically generated content.
export default function sitemap(): MetadataRoute.Sitemap {
  const fixedRoutes = [
    "",
    "/services",
    "/services/data-cleaning",
    "/services/ml-readiness",
    "/services/dataset-analysis",
    "/services/ai-tools",
    "/learn",
    "/blog",
    "/resources",
    "/explore/tutorials",
    "/explore/infographics",
    "/explore/research",
    "/community/write-for-numpa",
    "/community/authors",
    "/community/contributions",
    "/about",
    "/contact",
  ];

  const learnTopics = ["artificial-intelligence", "machine-learning", "data-science", "python"];
  const resourceTopics = ["datasets", "cheat-sheets", "learning-roadmaps", "useful-tools"];
  const blogArticles = ["data-quality-before-machine-learning", "understanding-missing-values"];

  return [...fixedRoutes, ...learnTopics.map((slug) => `/learn/${slug}`), ...resourceTopics.map((slug) => `/resources/${slug}`), ...blogArticles.map((slug) => `/blog/${slug}`)].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/services") ? 0.9 : 0.7,
  }));
}
