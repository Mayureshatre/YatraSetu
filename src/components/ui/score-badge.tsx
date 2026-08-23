import * as React from "react";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number; // 0 to 100
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export function ScoreBadge({
  score,
  size = "md",
  className,
  showLabel = true,
}: ScoreBadgeProps) {
  let colorClass =
    "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  let gaugeClass = "bg-emerald-500 dark:bg-emerald-400";

  if (score >= 90) {
    colorClass =
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
    gaugeClass = "bg-emerald-600 dark:bg-emerald-400";
  } else if (score >= 80) {
    colorClass =
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
    gaugeClass = "bg-emerald-600 dark:bg-emerald-400";
  } else if (score >= 65) {
    colorClass =
      "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800";
    gaugeClass = "bg-blue-600 dark:bg-blue-400";
  } else {
    colorClass =
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
    gaugeClass = "bg-emerald-600 dark:bg-emerald-400";
  }

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-bold shadow-xs transition-colors",
        colorClass,
        sizes[size],
        className,
      )}
    >
      <span className={cn("w-2 h-2 rounded-full animate-pulse", gaugeClass)} />
      <span>{score}%</span>
      {showLabel && (
        <span className="font-medium text-slate-500 dark:text-slate-400 text-[0.85em]">
          Match
        </span>
      )}
    </div>
  );
}
