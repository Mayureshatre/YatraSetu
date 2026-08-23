"use client";

import * as React from "react";
import { TripSetupForm } from "@/components/trip/trip-setup-form";

export default function TripPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Smart Trip Planner
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Plan Your Next Road Journey
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Specify your starting hub, chosen vehicle, and trip duration to
          receive AI-ranked destination recommendations.
        </p>
      </div>

      <TripSetupForm />
    </div>
  );
}
