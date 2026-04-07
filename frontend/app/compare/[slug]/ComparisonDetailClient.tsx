"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Check,
  X,
  Trophy,
  Shield,
  Zap,
  Globe,
  DollarSign,
  Users,
  ChevronDown,
  ChevronUp,
  Award,
  ExternalLink,
  Minus,
  ArrowLeft,
  Loader2,
} from "lucide-react";

/* ─── TYPES ──────────────────────────────────────────── */

interface ProductData {
  name: string;
  tagline: string;
  price: string;
  rating: number;
  color: string;
  affiliateLink: string;
  ourRating: number;
  bestFor: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  features: Record<string, unknown>;
  buyReasons: string[];
}

interface Category {
  title: string;
  icon: string;
  winner: "A" | "B" | "tie";
  summaryA: string;
  summaryB: string;
  details: string;
}

interface FAQ {
  q: string;
  a: string;
}

interface ComparisonData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  meta_description: string;
  product_a: ProductData;
  product_b: ProductData;
  winner: "A" | "B";
  winner_reason: string;
  categories: Category[];
  faqs: FAQ[];
  verdict_summary: string;
}

/* ─── ICON MAP ───────────────────────────────────────── */

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Zap,
  Globe,
  DollarSign,
  Users,
  Trophy,
  Star,
};

/* ─── STAR RATING COMPONENT ──────────────────────────── */

function StarRating({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < full
              ? "text-amber-400 fill-amber-400"
              : i === full && hasHalf
              ? "text-amber-400 fill-amber-400/50"
              : "text-slate-300 dark:text-slate-600"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── WINNER BADGE ───────────────────────────────────── */

function WinnerBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide">
      <Trophy className="w-3 h-3" /> {label}
    </span>
  );
}

/* ─── FAQ ITEM ───────────────────────────────────────── */

function FAQItem({ q, a }: FAQ) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {q}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── COMPARISON TABLE BUILDER ───────────────────────── */

function buildTableRows(productA: ProductData, productB: ProductData) {
  const fa = productA.features;
  const fb = productB.features;

  // build feature rows dynamically based on available keys
  const featureKeys = new Set([...Object.keys(fa), ...Object.keys(fb)]);
  const labelMap: Record<string, string> = {
    servers: "Servers",
    speed: "Max Speed",
    devices: "Simultaneous Devices",
    encryption: "Encryption",
    killSwitch: "Kill Switch",
    splitTunneling: "Split Tunneling",
    adBlocker: "Ad Blocker",
    dedicatedIP: "Dedicated IP",
    noLogs: "No-Logs Policy",
    streaming: "Streaming Support",
    storage: "Storage",
    bandwidth: "Bandwidth",
    freeDomain: "Free Domain",
    freeSSL: "Free SSL",
    emailAccounts: "Email Accounts",
    backups: "Backups",
    phoneSupport: "Phone Support",
    wordpressOptimized: "WordPress Optimized",
    uptime: "Uptime",
    loadTime: "Load Time",
    keywordDatabase: "Keyword Database",
    backlinks: "Backlink Index",
    siteAudit: "Site Audit",
    rankTracking: "Rank Tracking",
    contentOptimization: "Content Optimization",
    competitiveAnalysis: "Competitive Analysis",
    aiWriting: "AI Writing",
    teamMembers: "Team Members",
    apiAccess: "API Access",
    reporting: "Reporting",
  };

  const rows: {
    label: string;
    a: unknown;
    b: unknown;
    winnerCol: string;
  }[] = [
    {
      label: "Price",
      a: productA.price,
      b: productB.price,
      winnerCol: "tie",
    },
    {
      label: "Rating",
      a: `${productA.rating}/5 ⭐`,
      b: `${productB.rating}/5 ⭐`,
      winnerCol:
        productA.rating > productB.rating
          ? "A"
          : productA.rating < productB.rating
          ? "B"
          : "tie",
    },
  ];

  for (const key of featureKeys) {
    const label = labelMap[key] || key;
    const valA = fa[key];
    const valB = fb[key];

    let winnerCol = "tie";
    if (typeof valA === "boolean" && typeof valB === "boolean") {
      if (valA && !valB) winnerCol = "A";
      else if (!valA && valB) winnerCol = "B";
    }

    rows.push({ label, a: valA, b: valB, winnerCol });
  }

  rows.push({
    label: "Best For",
    a: productA.bestFor,
    b: productB.bestFor,
    winnerCol: "tie",
  });

  rows.push({
    label: "Our Rating",
    a: `${productA.ourRating}/10`,
    b: `${productB.ourRating}/10`,
    winnerCol:
      productA.ourRating > productB.ourRating
        ? "A"
        : productA.ourRating < productB.ourRating
        ? "B"
        : "tie",
  });

  return rows;
}

/* ─── MAIN CLIENT COMPONENT ──────────────────────────── */

export default function ComparisonDetailClient({ slug }: { slug: string }) {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const API =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API}/comparisons/${slug}`);
        if (!res.ok) throw new Error("Comparison not found");
        setData(await res.json());
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load"
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-sm text-slate-500">Loading comparison...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-32">
        <p className="text-red-500 font-medium text-lg">
          {error || "Comparison not found"}
        </p>
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all comparisons
        </Link>
      </div>
    );
  }

  const { product_a: productA, product_b: productB } = data;
  const winnerProduct = data.winner === "A" ? productA : productB;
  const tableRows = buildTableRows(productA, productB);

  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-500">
      {/* Back link */}
      <Link
        href="/compare"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-orange-500 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> All Comparisons
      </Link>

      {/* ═══════════════ 1. HERO SECTION ═══════════════ */}
      <section className="text-center space-y-6 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            Head-to-Head Comparison 2025
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span
              className={`bg-gradient-to-r ${productA.color} bg-clip-text text-transparent`}
            >
              {productA.name}
            </span>{" "}
            <span className="text-slate-400">vs</span>{" "}
            <span
              className={`bg-gradient-to-r ${productB.color} bg-clip-text text-transparent`}
            >
              {productB.name}
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Quick Verdict */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mx-auto max-w-xl bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-blue-950/40 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Our Pick
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {winnerProduct.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {data.winner_reason}
          </p>
          <div className="flex justify-center mt-3">
            <StarRating rating={winnerProduct.ourRating / 2} size="lg" />
            <span className="ml-2 font-bold text-lg text-slate-800 dark:text-slate-200">
              {winnerProduct.ourRating}/10
            </span>
          </div>
        </motion.div>

        {/* Side-by-Side Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8">
          {[productA, productB].map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              className={`relative bg-white dark:bg-slate-900 rounded-2xl border ${
                p === winnerProduct
                  ? "border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-200 dark:ring-emerald-800"
                  : "border-slate-200 dark:border-slate-800"
              } p-6 shadow-sm`}
            >
              {p === winnerProduct && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                    Winner
                  </span>
                </div>
              )}
              <div
                className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg`}
              >
                {p.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {p.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {p.tagline}
              </p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <StarRating rating={p.rating} />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  {p.rating}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                {p.price}
              </p>
              <p className="text-xs text-slate-400">Starting price / month</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ 2. QUICK COMPARISON TABLE ═══════════════ */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Quick Comparison
        </h2>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/60">
                <th className="text-left p-4 rounded-tl-xl font-semibold text-slate-600 dark:text-slate-300">
                  Feature
                </th>
                <th
                  className={`p-4 font-bold text-center bg-gradient-to-r ${productA.color} bg-clip-text text-transparent`}
                >
                  {productA.name}
                </th>
                <th
                  className={`p-4 font-bold text-center rounded-tr-xl bg-gradient-to-r ${productB.color} bg-clip-text text-transparent`}
                >
                  {productB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, idx) => (
                <tr
                  key={row.label}
                  className={`border-b border-slate-100 dark:border-slate-800 ${
                    idx % 2 === 0
                      ? "bg-white dark:bg-slate-900"
                      : "bg-slate-50/50 dark:bg-slate-900/50"
                  }`}
                >
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                    {row.label}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={
                        row.winnerCol === "A"
                          ? "font-semibold text-emerald-600 dark:text-emerald-400"
                          : "text-slate-600 dark:text-slate-400"
                      }
                    >
                      {typeof row.a === "boolean" ? (
                        row.a ? (
                          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        String(row.a ?? "—")
                      )}
                    </span>
                    {row.winnerCol === "A" && (
                      <Check className="w-4 h-4 text-emerald-500 inline-block ml-1" />
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={
                        row.winnerCol === "B"
                          ? "font-semibold text-emerald-600 dark:text-emerald-400"
                          : "text-slate-600 dark:text-slate-400"
                      }
                    >
                      {typeof row.b === "boolean" ? (
                        row.b ? (
                          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        String(row.b ?? "—")
                      )}
                    </span>
                    {row.winnerCol === "B" && (
                      <Check className="w-4 h-4 text-emerald-500 inline-block ml-1" />
                    )}
                  </td>
                </tr>
              ))}
              {/* CTA Row */}
              <tr className="bg-slate-50 dark:bg-slate-800/40">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                  Get Started
                </td>
                <td className="p-4 text-center">
                  <a
                    href={productA.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    Visit {productA.name}{" "}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="p-4 text-center">
                  <a
                    href={productB.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    Visit {productB.name}{" "}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════ 3. INDIVIDUAL OVERVIEWS ═══════════════ */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {[productA, productB].map((p) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
              >
                {p.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {p.name} Overview
                </h3>
                <div className="flex items-center gap-1">
                  <StarRating rating={p.rating} size="sm" />
                  <span className="text-xs text-slate-500 ml-1">
                    {p.rating}/5
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              {p.overview}
            </p>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Strengths
              </h4>
              <ul className="space-y-1.5">
                {p.strengths.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                Weaknesses
              </h4>
              <ul className="space-y-1.5">
                {p.weaknesses.map((w) => (
                  <li
                    key={w}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <Minus className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ═══════════════ 4. HEAD-TO-HEAD COMPARISONS ═══════════════ */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Head-to-Head Comparison
        </h2>
        <div className="space-y-6">
          {data.categories.map((cat, idx) => {
            const Icon = iconMap[cat.icon] || Shield;
            const winnerName =
              cat.winner === "A"
                ? productA.name
                : cat.winner === "B"
                ? productB.name
                : "Tie";
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {cat.title}
                    </h3>
                  </div>
                  <WinnerBadge label={winnerName} />
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                  <div
                    className={`p-5 ${
                      cat.winner === "A"
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`font-semibold text-sm bg-gradient-to-r ${productA.color} bg-clip-text text-transparent`}
                      >
                        {productA.name}
                      </span>
                      {cat.winner === "A" && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {cat.summaryA}
                    </p>
                  </div>
                  <div
                    className={`p-5 ${
                      cat.winner === "B"
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`font-semibold text-sm bg-gradient-to-r ${productB.color} bg-clip-text text-transparent`}
                      >
                        {productB.name}
                      </span>
                      {cat.winner === "B" && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {cat.summaryB}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/30 text-xs text-slate-500 dark:text-slate-400 italic">
                  {cat.details}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ 5. WHO SHOULD BUY WHAT ═══════════════ */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Who Should Buy What?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { product: productA, side: "A" },
            { product: productB, side: "B" },
          ].map(({ product: p, side }) => (
            <div
              key={p.name}
              className={`bg-gradient-to-br ${
                side === "A"
                  ? "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800"
                  : "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800"
              } border rounded-2xl p-6`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {p.name.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Choose {p.name} if you...
                </h3>
              </div>
              <ul className="space-y-3">
                {p.buyReasons.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <Check
                      className={`w-4 h-4 ${
                        side === "A"
                          ? "text-blue-500"
                          : "text-emerald-500"
                      } mt-0.5 shrink-0`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={p.affiliateLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-5 w-full inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:shadow-xl hover:shadow-orange-500/30"
              >
                Get {p.name} Now <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ 6. FINAL VERDICT ═══════════════ */}
      <section className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700"
        >
          <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            Final Verdict
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {winnerProduct.name} Wins Overall
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-xl mx-auto mb-8">
            {data.verdict_summary}
          </p>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 text-sm font-bold text-emerald-400">
              {productA.ourRating}/10
            </div>
            <span className="text-slate-500 text-sm font-medium">vs</span>
            <div className="bg-slate-700 border border-slate-600 rounded-full px-4 py-1.5 text-sm font-bold text-slate-300">
              {productB.ourRating}/10
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={productA.affiliateLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 text-sm"
            >
              Get {productA.name} <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={productB.affiliateLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all text-sm"
            >
              Get {productB.name} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ 7. FAQ ═══════════════ */}
      {data.faqs.length > 0 && (
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {data.faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════ AFFILIATE DISCLOSURE ═══════════════ */}
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
          <strong>Affiliate Disclosure:</strong> This comparison contains
          affiliate links. If you make a purchase through our links, we may
          earn a commission at no extra cost to you. This helps us maintain
          and improve our comparison reviews. We only recommend products we
          genuinely believe in.
        </p>
      </div>
    </div>
  );
}
