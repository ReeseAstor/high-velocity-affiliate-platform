"use client";

import { motion } from "framer-motion";
import { Star, ExternalLink, Activity, TrendingUp } from "lucide-react";

interface ProductCardProps {
    name: string;
    description: string;
    affiliateLink: string;
    rating?: number;
    imageSrc?: string;
    commission?: number;
    status?: string;
}

export default function ProductCard({ name, description, affiliateLink, rating = 4.5, imageSrc, commission, status }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow"
        >
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                 {imageSrc ? (
                    <img src={imageSrc} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <Activity className="w-12 h-12 opacity-20" />
                    </div>
                 )}
                 <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {rating}
                 </div>
                 {status && (
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                        status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                    }`}>
                        {status}
                    </div>
                 )}
            </div>

            <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {description}
                </p>

                {commission !== undefined && commission > 0 && (
                    <div className="flex items-center gap-1.5 mb-4 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        {commission}% Commission
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                    <a
                        href={affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex justify-center items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                    >
                        Check Price <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
