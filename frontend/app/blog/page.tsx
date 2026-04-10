import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartDeskHQ Blog | Tech Reviews, Guides & Comparisons",
  description:
    "Expert tech reviews, buying guides, and product comparisons for smart home, gaming, and work-from-home tech. Find the best products at every budget.",
  openGraph: {
    title: "SmartDeskHQ Blog | Tech Reviews, Guides & Comparisons",
    description:
      "Expert tech reviews, buying guides, and product comparisons.",
    type: "website",
  },
};

interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  content_type: string;
  product_category: string;
  is_sponsored: boolean;
}

const typeColors: Record<string, string> = {
  "Product Review":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Comparison Guide":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Buying Guide":
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Best-of List":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Setup Guide":
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

function getArticles(): ArticleMeta[] {
  const dir = path.join(process.cwd(), "app/content/reviews");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f: string) => f.endsWith(".md"))
    .map((filename: string) => {
      const { data } = matter(
        fs.readFileSync(path.join(dir, filename), "utf8")
      );
      return {
        slug: filename.replace(/\.md$/, ""),
        title: (data.title as string) || filename,
        date: (data.date as string) || "",
        description: (data.description as string) || "",
        content_type: (data.content_type as string) || "Article",
        product_category: (data.product_category as string) || "",
        is_sponsored: Boolean(data.is_sponsored),
      };
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export default function BlogPage() {
  const articles = getArticles();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Latest Articles
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Expert reviews, guides, and comparisons to help you find the best
          tech.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block"
            >
              <article className="h-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      typeColors[article.content_type] ||
                      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {article.content_type}
                  </span>
                  {article.is_sponsored && (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Sponsored
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-auto">
                  {article.date && (
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {article.product_category && (
                    <span>{article.product_category}</span>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
