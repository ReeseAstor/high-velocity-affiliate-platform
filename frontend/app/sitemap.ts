import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://high-velocity-affiliate-platform-88away.vercel.app";
  const dir = path.join(process.cwd(), "app/content/reviews");

  const pages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  if (fs.existsSync(dir)) {
    fs.readdirSync(dir)
      .filter((f: string) => f.endsWith(".md"))
      .forEach((f: string) => {
        pages.push({
          url: `${base}/blog/${f.replace(/\.md$/, "")}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
  }

  return pages;
}
