"use client";

import * as React from "react";
import { BusBookingRedirectInfo, CabBookingRedirectInfo } from "@/types";
import { Button } from "@/components/ui/button";

interface TravelOptionsCardProps {
  busRedirect?: BusBookingRedirectInfo | null;
  cabRedirect?: CabBookingRedirectInfo | null;
  distanceKm?: number;
  durationFormatted?: string;
  destinationName?: string;
}

export function TravelOptionsCard({
  busRedirect,
  cabRedirect,
  distanceKm = 0,
  durationFormatted = "",
  destinationName = "",
}: TravelOptionsCardProps) {
  const [activeTab, setActiveTab] = React.useState<"bus" | "cab" | "drive">(
    "bus",
  );
  const isCabSuitable = distanceKm > 0 ? distanceKm <= 100 : true;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6 shadow-xs space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🗺️</span> Travel & Booking Options
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Intercity buses, on-demand cabs with Rapido, and self-drive routes
          </p>
        </div>

        {distanceKm > 0 && (
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            📍 {distanceKm} km{" "}
            {durationFormatted ? `(~${durationFormatted})` : ""}
          </span>
        )}
      </div>

      {/* Option Selector Tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("bus")}
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === "bus"
              ? "bg-emerald-500 text-white border-emerald-600 shadow-xs dark:bg-emerald-600 dark:border-emerald-700"
              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          <span className="text-xl">🚍</span>
          <span className="text-xs font-bold">Intercity Bus</span>
          <span
            className={`text-[10px] ${activeTab === "bus" ? "text-emerald-100" : "text-slate-400 dark:text-slate-500"}`}
          >
            RedBus / Transport
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cab")}
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === "cab"
              ? "bg-emerald-600 text-white border-emerald-700 shadow-xs dark:bg-emerald-700 dark:border-emerald-800"
              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          <span className="text-xl">🚕</span>
          <span className="text-xs font-bold">Cab & Auto</span>
          <span
            className={`text-[10px] ${activeTab === "cab" ? "text-emerald-100" : "text-slate-400 dark:text-slate-500"}`}
          >
            {isCabSuitable ? "Rapido (≤100 km)" : "Rapido Intercity"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("drive")}
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === "drive"
              ? "bg-slate-800 text-white border-slate-900 shadow-xs dark:bg-slate-700 dark:border-slate-600"
              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          <span className="text-xl">🚗</span>
          <span className="text-xs font-bold">Self Drive</span>
          <span
            className={`text-[10px] ${activeTab === "drive" ? "text-slate-300" : "text-slate-400 dark:text-slate-500"}`}
          >
            Live Route Map
          </span>
        </button>
      </div>

      {/* Tab 1: Intercity Bus */}
      {activeTab === "bus" && busRedirect && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-orange-50 border border-emerald-200 dark:from-emerald-950/40 dark:to-orange-950/40 dark:border-emerald-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400">
              Verified Bus Service from {busRedirect.origin_city} to{" "}
              {busRedirect.destination_city}
            </span>
            <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200 px-2 py-0.5 rounded border border-transparent dark:border-emerald-800">
              {busRedirect.provider_name}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {busRedirect.disclaimer}
          </p>
          <div className="flex justify-end pt-1">
            <a
              href={busRedirect.booking_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-slate-950 gap-1.5 font-bold text-xs border-0"
              >
                <span>Book Bus Seats on {busRedirect.provider_name}</span>
                <span>↗</span>
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* Tab 2: Cab & Auto (Rapido) */}
      {activeTab === "cab" && (
        <div
          className={`p-4 rounded-xl border space-y-3 ${
            isCabSuitable
              ? "bg-gradient-to-br from-emerald-50 to-emerald-50 border-emerald-200 dark:from-emerald-950/40 dark:to-emerald-950/40 dark:border-emerald-800/50"
              : "bg-gradient-to-br from-slate-50 to-emerald-50 border-emerald-200 dark:from-slate-900/60 dark:to-emerald-950/40 dark:border-emerald-800/50"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Rapido On-Demand Cabs
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isCabSuitable
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700/50"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700/50"
                }`}
              >
                {isCabSuitable
                  ? "✓ Recommended for this distance"
                  : "Distance > 100 km"}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-white text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 px-2 py-0.5 rounded">
              Official Partner
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {isCabSuitable
              ? `At ${distanceKm} km, on-demand cab transit with Rapido offers flexible door-to-door connectivity for ${destinationName || "your destination"}.`
              : `This trip is approximately ${distanceKm} km. While long-distance outstation cabs can be hailed in the Rapido app, intercity buses or self-drive may offer better convenience.`}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            You will be redirected to the official Rapido app/website. Confirm
            exact pickup location, vehicle class (Auto/Cab/Bike), and fare in
            Rapido before booking.
          </p>

          <div className="flex justify-end pt-1">
            <a
              href={cabRedirect?.booking_url || `https://www.rapido.bike/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="primary"
                className={`gap-1.5 font-bold text-xs border-0 ${
                  isCabSuitable
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    : "bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                }`}
              >
                <span>Book with Rapido</span>
                <span>↗</span>
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* Tab 3: Self Drive */}
      {activeTab === "drive" && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/80 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
            <span>🚗 Self-Drive Route Readiness</span>
            <span>
              {distanceKm} km • ~{durationFormatted}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Paved highway corridors with regular rest stops and emergency
            assistance points. Check the interactive map and road safety advice
            below before beginning your drive.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-500 pt-1">
            <span>⛽ Fuel stations monitored along route</span>
            <span>•</span>
            <span>🔧 24/7 mechanics mapped</span>
          </div>
        </div>
      )}
    </div>
  );
}
