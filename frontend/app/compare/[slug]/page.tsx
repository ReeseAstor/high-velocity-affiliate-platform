import type { Metadata } from "next";
import ComparisonDetailClient from "./ComparisonDetailClient";

/* ─── SEO METADATA (server-side) ─────────────────────── */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_BASE}/comparisons/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();

    const productAName = data.product_a.name;
    const productBName = data.product_b.name;
    const winnerName =
      data.winner === "A" ? productAName : productBName;

    return {
      title: `${productAName} vs ${productBName} – Which Is Better in 2025? | Affiliate Hub`,
      description:
        data.meta_description ||
        `${productAName} vs ${productBName}: detailed head-to-head comparison covering features, pricing, performance, and value. Our pick: ${winnerName}.`,
      keywords: [
        productAName,
        productBName,
        `${productAName} vs ${productBName}`,
        `${productBName} vs ${productAName}`,
        "comparison",
        "review",
        "2025",
        "best",
      ],
      openGraph: {
        title: `${productAName} vs ${productBName} – Detailed 2025 Comparison`,
        description: `We tested ${productAName} and ${productBName} side-by-side. See features, pricing, and our verdict.`,
        type: "article",
        siteName: "Affiliate Hub",
      },
      twitter: {
        card: "summary_large_image",
        title: `${productAName} vs ${productBName} – 2025 Comparison`,
        description: `Head-to-head comparison: ${productAName} vs ${productBName}. Our winner: ${winnerName}.`,
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `/compare/${slug}`,
      },
    };
  } catch {
    return {
      title: "Product Comparison | Affiliate Hub",
      description: "Detailed product comparison to help you choose the right tool.",
    };
  }
}

/* ─── SERVER PAGE COMPONENT ──────────────────────────── */

export default async function ComparisonSlugPage({ params }: PageProps) {
  const { slug } = await params;
  return <ComparisonDetailClient slug={slug} />;
}
