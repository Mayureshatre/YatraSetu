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

  const [filterRadius, setFilterRadius] = React.useState<
    "all" | "100km" | "extended"
  >("all");

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

  const filteredRecommendations = React.useMemo(() => {
    if (!data?.recommendations) {
      return [];
    }

    if (filterRadius === "100km") {
      return data.recommendations.filter((r) => r.is_within_preferred_radius);
    }

    if (filterRadius === "extended") {
      return data.recommendations.filter((r) => !r.is_within_preferred_radius);
    }

    return data.recommendations;
  }, [data, filterRadius]);

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

      {/* Filter Tabs */}
      {data && data.recommendations.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterRadius("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterRadius === "all"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              All Ranked ({data.recommendations.length})
            </button>

            <button
              onClick={() => setFilterRadius("100km")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterRadius === "100km"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              Preferred ≤ 100 km (
              {
                data.recommendations.filter((r) => r.is_within_preferred_radius)
                  .length
              }
              )
            </button>

            <button
              onClick={() => setFilterRadius("extended")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterRadius === "extended"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              AI-Justified Extended (
              {
                data.recommendations.filter(
                  (r) => !r.is_within_preferred_radius,
                ).length
              }
              )
            </button>
          </div>

          <span className="text-xs text-slate-400 dark:text-slate-500">
            Showing {filteredRecommendations.length} of{" "}
            {data.recommendations.length} verified routes
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
          title="No destinations matching current radius filter"
          description="Try switching to 'All Ranked' or broadening your trip duration."
          actionLabel="View All Ranked Destinations"
          onAction={() => setFilterRadius("all")}
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
