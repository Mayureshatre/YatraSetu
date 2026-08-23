import * as React from "react";
import { RatingCategories } from "@/types";

interface RatingBreakdownProps {
  overallScore: number;
  totalReviews?: number;
  categoryAverages?: Partial<RatingCategories>;
}

export function RatingBreakdown({
  overallScore,
  totalReviews = 0,
  categoryAverages = {},
}: RatingBreakdownProps) {
  const categories: Array<{
    key: keyof RatingCategories;
    label: string;
    icon: string;
  }> = [
    { key: "cleanliness", label: "Cleanliness & Hygiene", icon: "✨" },
    { key: "safety", label: "Safety & Security", icon: "🛡️" },
    { key: "accessibility", label: "Road Accessibility", icon: "🛣️" },
    { key: "scenery", label: "Scenic Beauty & Views", icon: "🌄" },
    { key: "family_friendly", label: "Family Friendly", icon: "👨‍👩‍👧" },
    { key: "value_for_money", label: "Value for Money", icon: "💎" },
  ];

  return (
    <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700/60">
        <div>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {overallScore.toFixed(1)}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-sm ml-1.5 font-medium">
            / 5.0
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Based on {totalReviews} traveler review
            {totalReviews === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-1 text-emerald-500 text-xl">
          {"★".repeat(Math.round(overallScore))}
          {"☆".repeat(5 - Math.round(overallScore))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {categories.map((cat) => {
          const score = categoryAverages[cat.key] || 4.5;
          const percentage = (score / 5) * 100;
          return (
            <div key={cat.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <span>{cat.icon}</span> {cat.label}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {score.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
