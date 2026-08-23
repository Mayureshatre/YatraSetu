"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { RecommendationResponse } from "@/types";
import { DestinationCard } from "@/components/destination/destination-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type DistanceFilterType = "all" | "1-100" | "100-300" | "300-500" | "500-1000";

const DISTANCE_OPTIONS: Array<{ id: DistanceFilterType; label: string }> = [
  { id: "all", label: "All Distances" },
  { id: "1-100", label: "1 – 100 km (Local & Quick Trips)" },
  { id: "100-300", label: "100 – 300 km (Weekend Getaways)" },
  { id: "300-500", label: "300 – 500 km (Road Trips)" },
  { id: "500-1000", label: "500+ km (Long Expeditions)" },
];

function RecommendationsContent() {
  const searchParams = useSearchParams();

  const originLatParam = searchParams.get("origin_lat");
  const originLngParam = searchParams.get("origin_lng");

  const originLat = originLatParam ? parseFloat(originLatParam) : undefined;
  const originLng = originLngParam ? parseFloat(originLngParam) : undefined;

  const originLabel =
    searchParams.get("origin_label") || "Jabalpur, Madhya Pradesh";
  const vehicleType = searchParams.get("vehicle_type") || "car";
  const durationDays = parseInt(searchParams.get("duration_days") || "1", 10);

  const [data, setData] = React.useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadingStep, setLoadingStep] = React.useState(
    "Resolving road routes...",
  );
  const [error, setError] = React.useState<string | null>(null);

  // Distance Dropdown State
  const [distanceFilter, setDistanceFilter] =
    React.useState<DistanceFilterType>("all");

  const fetchRecommendations = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    setLoadingStep(
      "Calculating actual road distances via Google Routes API...",
    );

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin_lat: originLat,
          origin_lng: originLng,
          origin_label: originLabel,
          vehicle_type: vehicleType,
          duration_days: durationDays,
        }),
      });

      setLoadingStep("Synthesizing AI ranking & travel recommendations...");

      if (!res.ok) {
        const json = await res.json();
        throw new Error(
          json.error?.message || "Failed to generate recommendations",
        );
      }

      const json = await res.json();
      setData(json.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to generate recommendations";
      setError(message);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  }, [originLat, originLng, originLabel, vehicleType, durationDays]);

  React.useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Distance-filtered results
  const filteredRecommendations = React.useMemo(() => {
    if (!data?.recommendations) {
      return [];
    }

    return data.recommendations.filter((r) => {
      const distance = r.distance_km ?? 0;
      switch (distanceFilter) {
        case "1-100":
          return distance > 0 && distance <= 100;
        case "100-300":
          return distance > 100 && distance <= 300;
        case "300-500":
          return distance > 300 && distance <= 500;
        case "500-1000":
          return distance > 500;
        case "all":
        default:
          return true;
      }
    });
  }, [data, distanceFilter]);

  // Badge counts for each bracket
  const counts = React.useMemo(() => {
    const defaultCounts: Record<DistanceFilterType, number> = {
      all: 0,
      "1-100": 0,
      "100-300": 0,
      "300-500": 0,
      "500-1000": 0,
    };

    if (!data?.recommendations) return defaultCounts;

    defaultCounts.all = data.recommendations.length;

    data.recommendations.forEach((r) => {
      const dist = r.distance_km ?? 0;
      if (dist > 0 && dist <= 100) defaultCounts["1-100"]++;
      else if (dist > 100 && dist <= 300) defaultCounts["100-300"]++;
      else if (dist > 300 && dist <= 500) defaultCounts["300-500"]++;
      else if (dist > 500) defaultCounts["500-1000"]++;
    });

    return defaultCounts;
  }, [data]);

  const resolvedOrigin = data?.origin || {
    latitude: originLat ?? 23.1815,
    longitude: originLng ?? 79.9864,
    label: originLabel,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Dynamic AI Travel Results
            </span>

            <Badge
              variant={data?.data_freshness === "live" ? "success" : "default"}
              className="text-[10px]"
            >
              {data?.data_freshness === "live"
                ? "● Live AI Ranking + Google Routes"
                : "● Verified Route Intelligence"}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Top Ranked Destinations from {resolvedOrigin.label.split(",")[0]}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
            <span>
              📍 Origin:{" "}
              <strong className="text-slate-700 dark:text-slate-300">
                {resolvedOrigin.label}
              </strong>{" "}
              ({resolvedOrigin.latitude.toFixed(2)}°,{" "}
              {resolvedOrigin.longitude.toFixed(2)}°)
            </span>

            <span>•</span>

            <span>
              🚗 Vehicle:{" "}
              <strong className="text-slate-700 dark:text-slate-300 capitalize">
                {vehicleType}
              </strong>
            </span>

            <span>•</span>

            <span>
              🗓️ Duration:{" "}
              <strong className="text-slate-700 dark:text-slate-300">
                {durationDays} Day
                {durationDays > 1 ? "s" : ""}
              </strong>
            </span>
          </p>
        </div>

        <Link href="/trip">
          <Button variant="outline" size="sm" className="font-bold">
            Change Origin or Vehicle
          </Button>
        </Link>
      </div>

      {/* Distance Filter Dropdown Bar */}
      {data && data.recommendations.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <label
              htmlFor="distance-filter-select"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5"
            >
              <span>🧭 Distance Filter:</span>
            </label>

            <div className="relative min-w-[240px]">
              <select
                id="distance-filter-select"
                value={distanceFilter}
                onChange={(e) =>
                  setDistanceFilter(e.target.value as DistanceFilterType)
                }
                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2 px-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
              >
                {DISTANCE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} ({counts[option.id]})
                  </option>
                ))}
              </select>

              {/* Custom Dropdown Chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500 dark:text-slate-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {filteredRecommendations.length}
            </strong>{" "}
            of {data.recommendations.length} destinations
          </span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center animate-pulse">
            <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              {loadingStep}
            </p>

            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              Fetching verified route geometry and calculating dynamic match
              scores...
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-4 shadow-xs"
              >
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState
          title="Could not calculate recommendations"
          message={error}
          onRetry={fetchRecommendations}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredRecommendations.length === 0 && (
        <EmptyState
          title="No destinations found in this distance bracket"
          description="Try selecting 'All Distances' or choosing another distance bracket."
          actionLabel="View All Distances"
          onAction={() => setDistanceFilter("all")}
        />
      )}

      {/* Destination Grid */}
      {!isLoading && !error && filteredRecommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              originLabel={resolvedOrigin.label}
              vehicleType={vehicleType}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-4"
            >
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <React.Suspense fallback={<RecommendationsLoading />}>
      <RecommendationsContent />
    </React.Suspense>
  );
}
