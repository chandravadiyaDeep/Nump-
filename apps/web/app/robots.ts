import type { MetadataRoute } from "next";

// Keep public discovery pages crawlable while excluding private framework/API paths.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/login/", "/reset-password/"],
    },
    sitemap: "https://numpa.online/sitemap.xml",
  };
}
