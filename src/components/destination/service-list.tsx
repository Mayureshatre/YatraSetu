"use client";

import * as React from "react";
import {
  DestinationServicesData,
  RouteServiceItem,
  ServiceType,
} from "@/types";
import { Badge } from "@/components/ui/badge";

interface ServiceListProps {
  services: DestinationServicesData;
}

export function ServiceList({ services }: ServiceListProps) {
  const [activeTab, setActiveTab] = React.useState<ServiceType>("fuel");
  const [showAll, setShowAll] = React.useState(false);

  const tabs: Array<{
    key: ServiceType;
    label: string;
    count: number;
    icon: string;
  }> = [
    {
      key: "fuel",
      label: "Fuel Stations",
      count: services.fuel_stations.count,
      icon: "⛽",
    },
    {
      key: "mechanic",
      label: "24/7 Mechanics",
      count: services.mechanics.count,
      icon: "🔧",
    },
    {
      key: "hospital",
      label: "Emergency Hospitals",
      count: services.hospitals.count,
      icon: "🏥",
    },
  ];

  const currentPlaces: RouteServiceItem[] =
    activeTab === "fuel"
      ? services.fuel_stations.places
      : activeTab === "mechanic"
        ? services.mechanics.places
        : services.hospitals.places;

  const displayedPlaces = showAll ? currentPlaces : currentPlaces.slice(0, 5);

  const originName = services.origin?.label?.split(",")[0] || "Origin";
  const destName = services.destination_name?.split(" ")[0] || "Destination";
  const briefing = services.ai_readiness_briefing;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6 space-y-6 shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🚨</span> Real-Time Travel Support & Emergency Readiness
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified facilities & AI route safety analysis between{" "}
            <strong className="text-slate-700 dark:text-slate-200">
              {originName}
            </strong>{" "}
            and{" "}
            <strong className="text-slate-700 dark:text-slate-200">
              {destName}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {services.retrieved_at_relative || "Live Query"}
          </span>
          <Badge
            variant={services.data_freshness === "live" ? "success" : "default"}
            className="text-[10px]"
          >
            {services.data_freshness === "live"
              ? "● Live Google Places + Gemini"
              : "● Verified Service Monitor"}
          </Badge>
        </div>
      </div>

      {/* Gemini AI Emergency Readiness & Route Safety Briefing */}
      {briefing && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 text-white space-y-4 shadow-sm border border-slate-700 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">✨</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Gemini Emergency Safety Briefing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Readiness Score:</span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                {briefing.safety_score}/100 ({briefing.readiness_level})
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
              {briefing.headline}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {briefing.summary}
            </p>
          </div>

          {/* Detailed Facility Assessment Pills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <div className="bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/80 dark:border-slate-700 rounded-lg p-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span>⛽ Fuel Coverage</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {briefing.coverage_analysis.fuel_assessment}
              </p>
            </div>

            <div className="bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/80 dark:border-slate-700 rounded-lg p-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <span>🔧 Mechanic & Auto Care</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {briefing.coverage_analysis.mechanic_assessment}
              </p>
            </div>

            <div className="bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/80 dark:border-slate-700 rounded-lg p-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span>🏥 Emergency Medical</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {briefing.coverage_analysis.hospital_assessment}
              </p>
            </div>
          </div>

          {/* Actionable Driver Tips */}
          {briefing.actionable_tips && briefing.actionable_tips.length > 0 && (
            <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Driver Safety Tips for this Route:
              </span>
              <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                {briefing.actionable_tips.map((tip, idx) => (
                  <li key={idx} className="leading-snug">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Category Tabs */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                setShowAll(false);
              }}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                activeTab === t.key
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-xs dark:bg-emerald-700 dark:border-emerald-800"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="text-xs font-bold truncate max-w-full">
                {t.label}
              </span>
              <span
                className={`text-[10px] font-semibold ${
                  activeTab === t.key
                    ? "text-emerald-100"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {t.count} found
              </span>
            </button>
          ))}
        </div>

        {/* Places List */}
        <div className="space-y-3 pt-1">
          {currentPlaces.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                0 verified {activeTab} places found along this route corridor.
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Live places search queries the route corridor via Google Places
                API.
              </p>
            </div>
          ) : (
            displayedPlaces.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {p.name}
                    </h4>
                    {p.is_open !== null && p.is_open !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          p.is_open
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
                        }`}
                      >
                        {p.is_open ? "Open Now" : "Closed"}
                      </span>
                    )}
                    {p.rating && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        ★ {p.rating.toFixed(1)}{" "}
                        {p.user_rating_count ? `(${p.user_rating_count})` : ""}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    {p.address}
                  </p>

                  {/* Real Metrics: Distance from origin vs Detour */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium flex-wrap pt-0.5">
                    <span className="text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      📍 {p.distance_from_origin_km} km from starting point
                    </span>
                    {p.detour_km !== undefined && (
                      <span className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        ↪ ~{p.detour_km} km route detour
                      </span>
                    )}
                    {p.phone && (
                      <span className="text-slate-600 dark:text-slate-300 font-semibold">
                        📞 {p.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0 flex items-center justify-end">
                  <a
                    href={
                      p.google_maps_uri ||
                      `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 px-3 py-1.5 rounded-lg shadow-2xs transition-all"
                  >
                    <span>View on Maps</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))
          )}

          {currentPlaces.length > 5 && (
            <div className="text-center pt-1">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
              >
                {showAll
                  ? "▲ Show fewer places"
                  : `▼ View all ${currentPlaces.length} ${tabs.find((t) => t.key === activeTab)?.label}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
