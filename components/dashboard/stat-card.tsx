import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: "blue" | "emerald" | "amber" | "rose";
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  accentColor = "blue",
}: StatCardProps) {
  const colorMap = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/50",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/50",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/50",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/50",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/50",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/50",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/50",
    },
  };

  const colors = colorMap[accentColor];

  return (
    <Card className="p-5 relative overflow-hidden transition-all hover:shadow-md border-slate-200/90 dark:border-slate-800">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-1">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center border",
            colors.bg,
            colors.text,
            colors.border
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs dark:border-slate-800/80">
        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
          {description || "Mis à jour en temps réel"}
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold text-xs px-2 py-0.5 rounded-full",
              trend.positive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
            )}
          >
            {trend.positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </Card>
  );
}
