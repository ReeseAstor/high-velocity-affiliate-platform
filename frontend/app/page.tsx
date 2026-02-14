"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { useState } from "react";
import { MousePointerClick, DollarSign, TrendingUp, Activity } from "lucide-react";
// import { fetchAPI } from "@/lib/api";

export default function Home() {
  const [stats, setStats] = useState({
    clicks: 12450,
    conversions: 342,
    revenue: 15420.50,
    epc: 1.24
  });

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Dashboard Overview
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance metrics across all networks.</p>
        </div>
        <div className="flex space-x-2">
            <button className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 shadow-lg shadow-blue-500/10 transition-all">
                Download Report
            </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
            title="Total Clicks"
            value={stats.clicks.toLocaleString()}
            trend="up"
            description="+12% vs last month"
            icon={MousePointerClick}
        />
        <StatsCard
            title="Total Conversions"
            value={stats.conversions.toLocaleString()}
            trend="up"
            description="+4% vs last month"
            icon={TrendingUp}
        />
        <StatsCard
            title="Total Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            trend="up"
            description="+18% vs last month"
            icon={DollarSign}
        />
        <StatsCard
            title="EPC"
            value={`$${stats.epc.toFixed(2)}`}
            trend="neutral"
            description="Consistent"
            icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
              <div className="card-glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
                  <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-200">Revenue Overview</h3>
                  <div className="h-[300px] w-full">
                      <RevenueChart />
                  </div>
              </div>
          </div>
          <div>
              {/* Activity Feed */}
              <ActivityFeed />
          </div>
      </div>
    </div>
  );
}
