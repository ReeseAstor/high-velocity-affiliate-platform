import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
}

export default function StatsCard({ title, value, description, trend, icon: Icon }: StatsCardProps) {
  return (
    <div className="card-glass p-6 rounded-lg dark:bg-slate-900/50 bg-white/50 border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02]">
      <div className="flex justify-between items-start">
        <div>
           <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
           <div className="mt-2 flex items-baseline">
             <p className="text-3xl font-bold gradient-text">{value}</p>
           </div>
        </div>
        {Icon && (
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
        )}
      </div>

      <div className="mt-4 flex items-center">
        {trend && (
           <span className={cn(
             "text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1",
             trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
             trend === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
             "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
           )}>
             {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
             {description && <span className="ml-1">{description}</span>}
           </span>
        )}
      </div>
    </div>
  );
}
