"use client";

import { Activity, ShoppingCart, Star, TrendingUp } from "lucide-react";

const activities = [
    {
        id: 1,
        type: "conversion",
        message: "New sale generated for Lumina X Smart Watch",
        time: "2 minutes ago",
        earnings: "+$45.00",
        icon: ShoppingCart,
        color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
    },
    {
        id: 2,
        type: "click",
        message: "High traffic surge on 'Tech Gift Guide'",
        time: "15 minutes ago",
        earnings: null,
        icon: TrendingUp,
        color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
        id: 3,
        type: "review",
        message: "New 5-star review content generated",
        time: "1 hour ago",
        earnings: null,
        icon: Star,
        color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
        id: 4,
        type: "system",
        message: "Daily performance report ready",
        time: "3 hours ago",
        earnings: null,
        icon: Activity,
        color: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400"
    }
];

export default function ActivityFeed() {
    return (
        <div className="card-glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-full">
            <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Recent Activity
            </h3>

            <div className="space-y-6">
                {activities.map((item, index) => (
                    <div key={item.id} className="relative pl-6 sm:pl-0 flex gap-4 group">
                        {/* Timeline line */}
                        {index !== activities.length - 1 && (
                            <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 sm:left-[2.1rem] -ml-px h-full" />
                        )}

                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                            <item.icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 pt-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                                    {item.message}
                                </p>
                                {item.earnings && (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full ml-2">
                                        {item.earnings}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>

             <button className="w-full mt-8 py-2 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium border-t border-slate-100 dark:border-slate-800 transition-colors">
                View All Activity
            </button>
        </div>
    );
}
