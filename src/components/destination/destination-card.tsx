"use client";

import * as React from "react";
import Link from "next/link";
import { RecommendationCandidate } from "@/types";
import { ScoreBadge } from "@/components/ui/score-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DestinationCardProps {
  destination: RecommendationCandidate;
  originLabel?: string;
  vehicleType?: string;
}

export function DestinationCard({
  destination,
  originLabel,
  vehicleType,
}: DestinationCardProps) {
  const isExtended = destination.is_extended_radius;

  return (
    <div className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image Header */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={
            destination.hero_image_url ||
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          }
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black flex items-center justify-center border border-white/20">
              #{destination.rank}
            </span>
            <Badge
              variant="default"
              className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 border-none backdrop-blur-xs font-semibold"
            >
              {destination.category}
            </Badge>
          </div>
          <ScoreBadge score={destination.match_score} size="sm" />
        </div>

        {/* Bottom Image Overlay Title & Distance */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-lg font-bold leading-tight drop-shadow-sm">
            {destination.name}
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-200 mt-1">
            <span>📍 {destination.distance_km} km</span>
            <span>•</span>
            <span>⏱️ {destination.duration_formatted}</span>
            {isExtended && (
              <>
                <span>•</span>
                <span className="text-emerald-300 font-semibold bg-black/40 px-1.5 py-0.5 rounded text-[10px]">
                  Extended Radius
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* AI Match Explanation */}
          <div className="p-3 bg-emerald-50/80 dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
            <span className="text-base leading-none">💡</span>
            <div>
              <span className="font-bold text-emerald-950 dark:text-emerald-400">
                AI Match Reason:{" "}
              </span>
              <span className="leading-relaxed">{destination.ai_reason}</span>
              {destination.extension_justification && (
                <p className="mt-1 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium italic">
                  Note: {destination.extension_justification}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
            🛣️{" "}
            {destination.road_condition
              ? destination.road_condition.split(";")[0]
              : "Paved road"}
          </div>
          <Link href={`/destinations/${destination.id}`}>
            <Button size="sm" variant="primary" className="shrink-0 text-xs">
              View Details →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
