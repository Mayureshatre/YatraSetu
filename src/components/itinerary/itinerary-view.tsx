"use client";

import * as React from "react";
import { FlexibleItinerary } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ItineraryViewProps {
  itinerary: FlexibleItinerary | null;
  isLoading?: boolean;
  onRegenerate?: () => void;
  destinationName: string;
  durationDays: number;
}

export function ItineraryView({
  itinerary,
  isLoading = false,
  onRegenerate,
  destinationName,
  durationDays,
}: ItineraryViewProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-4 transition-colors">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-16 w-full bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
        <div className="space-y-3 pt-2">
          <div className="h-24 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
          <div className="h-24 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-8 text-center space-y-3 transition-colors">
        <div className="text-3xl">🗓️</div>
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Custom {durationDays}-Day AI Itinerary
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Generate an unhurried, flexible day-by-day plan tailored specifically
          for your trip duration and vehicle choice.
        </p>
        {onRegenerate && (
          <Button size="sm" variant="primary" onClick={onRegenerate}>
            Generate Itinerary
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6 space-y-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Flexible {itinerary.duration_days}-Day Itinerary for{" "}
              {destinationName}
            </h3>
            <Badge variant="purple" className="text-[10px]">
              AI Generated
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {itinerary.summary}
          </p>
        </div>

        {onRegenerate && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            className="shrink-0 text-xs gap-1.5"
          >
            <span>🔄</span>
            <span>Regenerate</span>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {itinerary.items.map((item) => (
          <div
            key={item.day_number}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 space-y-2 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-black">
                  DAY {item.day_number}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h4>
              </div>
              {item.timing_suggestion && (
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                  ⏱️ {item.timing_suggestion}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>

            {item.activities && item.activities.length > 0 && (
              <div className="pt-1 flex flex-wrap gap-1.5">
                {item.activities.map((act, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium px-2 py-0.5 rounded-full"
                  >
                    ✓ {act}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
