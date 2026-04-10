import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import type { Metadata } from "next";

const articlesDir = path.join(process.cwd(), "app/content/reviews");

export async function generateStaticParams() {
  if (!fs.existsSync(articlesDir)) return [];
  return fs
    .readdirSync(articlesDir)
    .filter((f: string) => f.endsWith(".md"))
    .map((f: string) => ({ slug: f.replace(/\.md$/, "") }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fp = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(fp)) return { title: "Not Found" };
  const { data } = matter(fs.readFileSync(fp, "utf8"));
  return {
    title: `${data.title} | SmartDeskHQ`,
    description: (data.description as string) || "",
    openGraph: {
      title: data.title as string,
      description: (data.description as string) || "",
      type: "article",
      publishedTime: data.date as string,
    },
    twitter: {
      card: "summary_large_image",
      title: data.title as string,
      description: (data.description as string) || "",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const fp = path.join(articlesDir, `${slug}.md`);

  if (!fs.existsSync(fp)) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-slate-400">
          Article not found
        </h1>
        <Link
          href="/blog"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to all articles
        </Link>
      </div>
    );
  }

  const fileContents = fs.readFileSync(fp, "utf8");
  const { data, content } = matter(fileContents);
  const pros = data.pros as string[] | undefined;
  const cons = data.cons as string[] | undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    datePublished: data.date,
    description: data.description,
    author: { "@type": "Organization", name: "SmartDeskHQ" },
    ...(data.product_name && {
      about: { "@type": "Product", name: data.product_name },
    }),
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        &larr; Back to all articles
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          {data.content_type && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {data.content_type as string}
            </span>
          )}
          {data.is_sponsored && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Sponsored
            </span>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          {data.title as string}
        </h1>
        {data.description && (
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">
            {data.description as string}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-slate-400">
          {data.date && (
            <time dateTime={data.date as string}>
              {new Date(data.date as string).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {data.product_category && (
            <span>&bull; {data.product_category as string}</span>
          )}
          {data.price_range && (
            <span>&bull; {data.price_range as string}</span>
          )}
        </div>
      </header>

      {data.is_sponsored && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
          <strong>Disclosure:</strong> This article contains affiliate links. We
          may earn a commission if you make a purchase through these links, at no
          extra cost to you.
        </div>
      )}

      {(pros || cons) && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {pros && pros.length > 0 && (
            <div className="p-5 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                Pros
              </h3>
              <ul className="space-y-2">
                {pros.map((p: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm text-green-700 dark:text-green-400"
                  >
                    + {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cons && cons.length > 0 && (
            <div className="p-5 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3">
                Cons
              </h3>
              <ul className="space-y-2">
                {cons.map((c: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm text-red-700 dark:text-red-400"
                  >
                    - {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <article className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>

      {data.verdict && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Our Verdict
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {data.verdict as string}
          </p>
          {data.affiliate_link && (
            <a
              href={data.affiliate_link as string}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/25"
            >
              Check Price on Amazon &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  );
}
