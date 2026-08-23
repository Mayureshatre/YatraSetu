"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Car,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Loader2,
  Gauge,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { AiVehicleProfile, AiDestinationTerrain } from "@/lib/ai/ai-adapter";

interface CompatibilityData {
  score: number;
  verdict: "Highly Recommended" | "Proceed with Caution" | "Not Recommended";
  summary: string;
  reasons: string[];
  warnings: string[];
}

interface Props {
  destination: AiDestinationTerrain;
}

const VEHICLE_OPTIONS: Array<{ label: string; profile: AiVehicleProfile }> = [
  {
    label: "Hatchback (Swift, i20, Altroz)",
    profile: {
      name: "Standard Hatchback",
      category: "Hatchback",
      groundClearanceMm: 165,
      drivetrain: "FWD",
      engineCapacityCc: 1200,
    },
  },
  {
    label: "Sedan (City, Verna, Virtus)",
    profile: {
      name: "Mid-size Sedan",
      category: "Sedan",
      groundClearanceMm: 165,
      drivetrain: "FWD",
      engineCapacityCc: 1500,
    },
  },
  {
    label: "Compact SUV (Brezza, Creta, Nexon)",
    profile: {
      name: "Compact SUV",
      category: "Compact SUV",
      groundClearanceMm: 195,
      drivetrain: "FWD",
      engineCapacityCc: 1500,
    },
  },
  {
    label: "4x4 / AWD SUV (Thar, Scorpio-N, Fortuner)",
    profile: {
      name: "4x4 Expedition SUV",
      category: "4x4 SUV",
      groundClearanceMm: 226,
      drivetrain: "4WD",
      engineCapacityCc: 2200,
    },
  },
  {
    label: "ADV Motorcycle (Himalayan, 390 Adventure)",
    profile: {
      name: "Adventure Tourer",
      category: "Motorcycle",
      groundClearanceMm: 220,
      drivetrain: "RWD",
      engineCapacityCc: 450,
    },
  },
];

export function VehicleCompatibilitySection({ destination }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(2); // Default to Compact SUV
  const [report, setReport] = useState<CompatibilityData | null>(null);
  const [source, setSource] = useState<"ai" | "fallback_engine">("ai");
  const [isPending, startTransition] = useTransition();

  const selectedVehicle = VEHICLE_OPTIONS[selectedIdx].profile;

  useEffect(() => {
    let isCancelled = false;

    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/vehicle-compatibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicle: selectedVehicle,
            destination,
          }),
        });

        if (!res.ok) throw new Error("API call failed");

        const json = await res.json();
        if (!isCancelled && json.data) {
          setReport(json.data);
          setSource(json.source || "ai");
        }
      } catch (err) {
        console.error("Compatibility evaluation error:", err);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedIdx, destination]);

  const getVerdictTheme = (verdict?: string) => {
    switch (verdict) {
      case "Highly Recommended":
        return {
          badge:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          progress: "text-emerald-500 stroke-emerald-500",
          scoreBg: "text-emerald-600 dark:text-emerald-400",
        };
      case "Not Recommended":
        return {
          badge:
            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          progress: "text-rose-500 stroke-rose-500",
          scoreBg: "text-rose-600 dark:text-rose-400",
        };
      default:
        return {
          badge:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          progress: "text-amber-500 stroke-amber-500",
          scoreBg: "text-amber-600 dark:text-amber-400",
        };
    }
  };

  const theme = getVerdictTheme(report?.verdict);
  const score = report?.score ?? 0;
  const strokeDashoffset = 100 - score;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              Vehicle Terrain Compatibility
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Sparkles className="h-3 w-3" />
                {source === "ai" ? "Gemini AI" : "Heuristic"}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Terrain assessment and mechanical risk scoring for{" "}
              {destination.name}
            </p>
          </div>
        </div>

        {/* Specs Pill */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg w-fit">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{selectedVehicle.groundClearanceMm}mm clearance</span>
          <span>•</span>
          <span>{selectedVehicle.drivetrain}</span>
        </div>
      </div>

      {/* Vehicle Selection Dropdown */}
      <div className="mt-5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
          Select Your Ride
        </label>
        <select
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
        >
          {VEHICLE_OPTIONS.map((opt, i) => (
            <option key={i} value={i}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main Analysis Display */}
      {isPending ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-xs font-medium">
            Evaluating terrain gradient, unpaved trails & ground clearance...
          </p>
        </div>
      ) : report ? (
        <div className="mt-6 space-y-5">
          {/* Score & Verdict Banner */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Radial Progress Gauge */}
              <div className="relative h-14 w-14 flex items-center justify-center">
                <svg
                  className="h-full w-full -rotate-90 transform"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-muted/60 stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${theme.progress} transition-all duration-700 ease-out`}
                    strokeDasharray="100, 100"
                    strokeDashoffset={strokeDashoffset}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className={`absolute text-sm font-bold ${theme.scoreBg}`}>
                  {report.score}
                </span>
              </div>

              <div>
                <div className="text-xs text-muted-foreground font-medium">
                  Suitability Score
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {report.score >= 80
                    ? "Safe & Capable Route"
                    : report.score >= 60
                      ? "Moderate Caution Advised"
                      : "High Clearance Recommended"}
                </div>
              </div>
            </div>

            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${theme.badge}`}
            >
              {report.verdict}
            </span>
          </div>

          {/* AI Executive Summary */}
          <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/20 p-3 rounded-lg border-l-2 border-primary">
            &ldquo;{report.summary}&rdquo;
          </p>

          {/* Reasons & Warnings Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Positive Capabilities */}
            {report.reasons?.length > 0 && (
              <div className="space-y-2 rounded-xl p-3.5 bg-emerald-500/5 border border-emerald-500/10">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Route Suitability Factors
                </span>
                <ul className="space-y-2">
                  {report.reasons.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-foreground/90"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings & Risk Factors */}
            {report.warnings?.length > 0 && (
              <div className="space-y-2 rounded-xl p-3.5 bg-amber-500/5 border border-amber-500/10">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Terrain & Safety Alerts
                </span>
                <ul className="space-y-2">
                  {report.warnings.map((w, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-foreground/90"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
