import * as React from "react";
import { DestinationReview } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Star } from "lucide-react";

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
    <div className="group relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
      {/* Header: Avatar, Name, Date, and Overall Score */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Avatar
            src={review.user_avatar}
            name={review.user_name || "Traveler"}
            size="md"
          />
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {review.user_name || "Verified Traveler"}
            </h4>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {dateFormatted}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 dark:bg-emerald-500/10">
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {review.overall_score.toFixed(1)}
          </span>
          <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
        </div>
      </div>

      {/* Body Text */}
      {review.body && (
        <div className="mt-4">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {review.body}
          </p>
        </div>
      )}

      {/* Category Breakdown: Visual Progress Bars */}
      {review.category_scores &&
        Object.keys(review.category_scores).length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-slate-100 pt-5 dark:border-slate-800/80 sm:grid-cols-3">
            {Object.entries(review.category_scores).map(([key, value]) => {
              const scorePercentage = (Number(value) / 5) * 100;

              return (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600 capitalize dark:text-slate-400">
                      {key.replace("_", " ")}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {value}
                    </span>
                  </div>
                  {/* Progress Bar Track */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    {/* Progress Bar Fill */}
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out dark:bg-emerald-400"
                      style={{ width: `${scorePercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
