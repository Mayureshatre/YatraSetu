import * as React from "react";
import { DestinationReview } from "@/types";
import { Avatar } from "@/components/ui/avatar";

interface ReviewCardProps {
  review: DestinationReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const dateFormatted = new Date(review.created_at).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar
            src={review.user_avatar}
            name={review.user_name || "Traveler"}
            size="sm"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {review.user_name || "Verified Traveler"}
            </h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {dateFormatted}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
          <span>★</span>
          <span>{review.overall_score.toFixed(1)}</span>
        </div>
      </div>

      {review.body && (
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {review.body}
        </p>
      )}

      {review.category_scores &&
        Object.keys(review.category_scores).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Object.entries(review.category_scores).map(([k, v]) => (
              <span
                key={k}
                className="text-[10px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full capitalize"
              >
                {k.replace("_", " ")}:{" "}
                <strong className="text-slate-800 dark:text-slate-100">
                  {v}/5
                </strong>
              </span>
            ))}
          </div>
        )}
    </div>
  );
}
