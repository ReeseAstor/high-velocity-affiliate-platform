import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap:
      "https://high-velocity-affiliate-platform-88away.vercel.app/sitemap.xml",
  };
}
