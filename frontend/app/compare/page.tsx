"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  Trophy,
  Zap,
  Loader2,
  Shield,
  Scale,
  Sparkles,
} from "lucide-react";

/* ─── TYPES ──────────────────────────────────────────── */

interface ComparisonProduct {
  name: string;
  tagline: string;
  price: string;
  rating: number;
  color: string;
  ourRating: number;
  bestFor: string;
}

interface Comparison {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  product_a: ComparisonProduct;
  product_b: ComparisonProduct;
  winner: string;
  winner_reason: string;
  status: string;
  created_at: string;
}

/* ─── STAR RATING ────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
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

/* ─── COMPARISON CARD ────────────────────────────────── */

function ComparisonCard({
  comparison,
  index,
}: {
  comparison: Comparison;
  index: number;
}) {
  const { product_a, product_b, winner } = comparison;
  const winnerProduct = winner === "A" ? product_a : product_b;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/compare/${comparison.slug}`}
        className="group block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-700 hover:-translate-y-1"
      >
        {/* Header gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />

        <div className="p-6">
          {/* VS Badge */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${product_a.color} flex items-center justify-center text-white text-sm font-black shadow-lg`}
              >
                {product_a.name.charAt(0)}
              </div>
              <span className="text-xs font-black text-slate-400 tracking-widest">
                VS
              </span>
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${product_b.color} flex items-center justify-center text-white text-sm font-black shadow-lg`}
              >
                {product_b.name.charAt(0)}
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
              <Trophy className="w-3 h-3" />
              {winnerProduct.name}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {product_a.name} vs {product_b.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 line-clamp-2">
            {comparison.subtitle}
          </p>

          {/* Side-by-side mini comparison */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[product_a, product_b].map((p) => (
              <div
                key={p.name}
                className={`rounded-xl p-3 text-center ${
                  p.name === winnerProduct.name
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                }`}
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {p.name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <StarRating rating={p.rating} />
                  <span className="text-xs text-slate-500 ml-1">
                    {p.rating}
                  </span>
                </div>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {p.price}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Score: {p.ourRating}/10
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[60%] truncate">
              {comparison.winner_reason}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
              Compare
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────── */

export default function CompareListingPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComparisons() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API}/comparisons/`);
        if (!res.ok) throw new Error("Failed to fetch comparisons");
        const data = await res.json();
        setComparisons(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load comparisons"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchComparisons();
  }, []);

  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-500">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="text-center space-y-5 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" />
            Product Comparisons
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Head-to-Head{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Comparisons
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
            Detailed, data-driven comparisons to help you choose the right tool.
            Every comparison is tested, scored, and reviewed by our team.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400"
        >
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Independently Tested</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Updated 2025</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>{comparisons.length} Comparisons</span>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ COMPARISON GRID ═══════════════ */}
      <section className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-sm text-slate-500">Loading comparisons...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
            <p className="text-sm text-slate-400 mt-2">
              Make sure the backend API is running on port 8000.
            </p>
          </div>
        ) : comparisons.length === 0 ? (
          <div className="text-center py-20">
            <Scale className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">
              No comparisons yet. Create one via the API.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisons.map((comp, idx) => (
              <ComparisonCard
                key={comp.id}
                comparison={comp}
                index={idx}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
