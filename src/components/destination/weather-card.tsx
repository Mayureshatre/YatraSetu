"use client";

import * as React from "react";
import { DestinationWeatherData } from "@/types";
import { Badge } from "@/components/ui/badge";

interface WeatherCardProps {
  weather: DestinationWeatherData | null;
  isLoading?: boolean;
}

export function WeatherCard({ weather, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6 space-y-4 shadow-xs animate-pulse transition-colors">
        <div className="flex justify-between items-center">
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded-md" />
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-slate-100 dark:bg-slate-900 p-3 space-y-2"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!weather || !weather.forecast || weather.forecast.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-5 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        Live weather information is temporarily unavailable for this
        destination.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6 space-y-4 shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🌤️</span> 5-Day Live Weather Forecast
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Local meteorological outlook at{" "}
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              {weather.destination_name || "destination"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {weather.retrieved_at_relative || "Updated just now"}
          </span>
          <Badge
            variant={weather.data_freshness === "live" ? "success" : "default"}
            className="text-[10px]"
          >
            {weather.data_freshness === "live"
              ? "● Live OpenWeather"
              : "● Regional Weather Station"}
          </Badge>
        </div>
      </div>

      {/* 5-Day Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {weather.forecast.map((day, idx) => {
          const isToday = idx === 0;
          return (
            <div
              key={day.date}
              className={`p-3.5 rounded-xl border text-center transition-all flex flex-col justify-between space-y-1.5 ${
                isToday
                  ? "bg-gradient-to-b from-emerald-50 to-emerald-50/50 dark:from-emerald-950/40 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-800 shadow-xs ring-1 ring-emerald-500/20 dark:ring-emerald-500/30"
                  : "bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
              }`}
            >
              <div>
                <span
                  className={`text-xs font-bold block ${isToday ? "text-emerald-900 dark:text-emerald-300" : "text-slate-900 dark:text-slate-100"}`}
                >
                  {day.dayOfWeek}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="text-2xl my-1 select-none">{day.icon}</div>

              <div className="space-y-0.5">
                <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                  {day.temperatureMax}° /{" "}
                  <span className="text-slate-500 dark:text-slate-400 font-normal">
                    {day.temperatureMin}°C
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate capitalize">
                  {day.condition}
                </p>
              </div>

              {day.precipitationProbability > 0 && (
                <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700 text-[10px] font-semibold text-sky-700 dark:text-sky-400 flex items-center justify-center gap-1">
                  <span>💧</span>
                  <span>{day.precipitationProbability}% rain</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
