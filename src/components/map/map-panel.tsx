"use client";

import * as React from "react";
import { NearbyPlaceItem, ServiceType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MapPanelProps {
  originLat: number;
  originLng: number;
  originLabel?: string;
  destLat: number;
  destLng: number;
  destName: string;
  distanceKm: number;
  durationFormatted: string;
  vehicleType?: string;
  services?: {
    fuel: NearbyPlaceItem[];
    mechanic: NearbyPlaceItem[];
    hospital: NearbyPlaceItem[];
  };
  className?: string;
}

export function MapPanel({
  originLat,
  originLng,
  originLabel = "Origin",
  destLat,
  destLng,
  destName,
  distanceKm,
  durationFormatted,
  vehicleType = "car",
  services,
  className,
}: MapPanelProps) {
  const [activeLayer, setActiveLayer] = React.useState<"all" | ServiceType>(
    "all",
  );
  const [hoveredService, setHoveredService] =
    React.useState<NearbyPlaceItem | null>(null);

  const allServices: NearbyPlaceItem[] = [
    ...(services?.fuel || []),
    ...(services?.mechanic || []),
    ...(services?.hospital || []),
  ];

  const visibleServices =
    activeLayer === "all"
      ? allServices
      : allServices.filter((s) => s.type === activeLayer);

  // Compute map bounding box including all route endpoints & active service coordinates
  const allLats = [
    originLat,
    destLat,
    ...visibleServices.map((s) => s.latitude),
  ];
  const allLngs = [
    originLng,
    destLng,
    ...visibleServices.map((s) => s.longitude),
  ];

  const minLat = Math.min(...allLats) - 0.08;
  const maxLat = Math.max(...allLats) + 0.08;
  const minLng = Math.min(...allLngs) - 0.08;
  const maxLng = Math.max(...allLngs) + 0.08;

  const mapWidth = 700;
  const mapHeight = 360;

  const project = (lat: number, lng: number) => {
    const x =
      ((lng - minLng) / (maxLng - minLng || 0.05)) * (mapWidth - 140) + 70;
    const y =
      (1 - (lat - minLat) / (maxLat - minLat || 0.05)) * (mapHeight - 120) + 60;
    return {
      x: Math.max(35, Math.min(mapWidth - 35, x)),
      y: Math.max(35, Math.min(mapHeight - 35, y)),
    };
  };

  const originPoint = project(originLat, originLng);
  const destPoint = project(destLat, destLng);

  // Intermediate curve control point to simulate natural highway route
  const midX = (originPoint.x + destPoint.x) / 2 + 15;
  const midY = (originPoint.y + destPoint.y) / 2 - 15;
  const pathD = `M ${originPoint.x}${originPoint.y} Q ${midX}${midY} ${destPoint.x}${destPoint.y}`;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm flex flex-col transition-colors">
      {/* Map Control Bar */}
      <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <span>🗺️</span>
            <span>Interactive Route Canvas</span>
          </div>
          <span className="text-slate-500">•</span>
          <div className="text-xs text-slate-300">
            <span>🛣️ {distanceKm} km</span>
            <span className="mx-1.5">|</span>
            <span>
              ⏱️ {durationFormatted} ({vehicleType})
            </span>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
            Layers:
          </span>
          <button
            onClick={() => setActiveLayer("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeLayer === "all"
                ? "bg-emerald-500 text-slate-900 dark:bg-emerald-600 dark:text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            }`}
          >
            All ({allServices.length})
          </button>
          <button
            onClick={() => setActiveLayer("fuel")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeLayer === "fuel"
                ? "bg-emerald-500 text-slate-900 dark:bg-emerald-600 dark:text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            }`}
          >
            ⛽ Fuel ({services?.fuel?.length || 0})
          </button>
          <button
            onClick={() => setActiveLayer("mechanic")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeLayer === "mechanic"
                ? "bg-cyan-500 text-slate-900 dark:bg-cyan-600 dark:text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            }`}
          >
            🔧 Mechanic ({services?.mechanic?.length || 0})
          </button>
          <button
            onClick={() => setActiveLayer("hospital")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeLayer === "hospital"
                ? "bg-emerald-500 text-white dark:bg-emerald-600"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            }`}
          >
            🏥 Hospital ({services?.hospital?.length || 0})
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-950 overflow-hidden select-none">
        {/* Subtle Map Grid Pattern */}
        <svg className="w-full h-full" viewBox={`0 0 ${mapWidth}${mapHeight}`}>
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#1e293b"
                strokeWidth="0.8"
              />
            </pattern>
            <linearGradient
              id="routeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Regional Contour Curves */}
          <path
            d={`M 0 180 Q 200 120 400 240 T ${mapWidth} 160`}
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.5"
          />

          {/* Route Shadow */}
          <path
            d={pathD}
            fill="none"
            stroke="#0f172a"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Highway Route Polyline */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Animated Direction Indicator */}
          <circle r="4" fill="#ffffff">
            <animateMotion path={pathD} dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Origin Pin */}
          <g transform={`translate(${originPoint.x},${originPoint.y})`}>
            <circle
              r="14"
              fill="#0284c7"
              opacity="0.3"
              className="animate-ping"
            />
            <circle r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
            <text
              y="-14"
              textAnchor="middle"
              fill="#93c5fd"
              fontSize="11"
              fontWeight="bold"
            >
              {originLabel.split(",")[0]} (Start)
            </text>
          </g>

          {/* Destination Pin */}
          <g transform={`translate(${destPoint.x},${destPoint.y})`}>
            <circle
              r="16"
              fill="#10b981"
              opacity="0.4"
              className="animate-ping"
            />
            <circle r="10" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
            <text
              y="-16"
              textAnchor="middle"
              fill="#a7f3d0"
              fontSize="12"
              fontWeight="bold"
            >
              {destName} (Destination)
            </text>
          </g>

          {/* Emergency Service Markers with True GPS Geographic Projection */}
          {visibleServices.map((srv) => {
            const { x: sx, y: sy } = project(srv.latitude, srv.longitude);
            const icon =
              srv.type === "fuel"
                ? "⛽"
                : srv.type === "mechanic"
                  ? "🔧"
                  : "🏥";
            const color =
              srv.type === "fuel"
                ? "#f59e0b"
                : srv.type === "mechanic"
                  ? "#06b6d4"
                  : "#ef4444";
            const isHovered = hoveredService?.id === srv.id;

            return (
              <g
                key={srv.id}
                transform={`translate(${sx},${sy})`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredService(srv)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <circle
                  r={isHovered ? 13 : 9}
                  fill="#0f172a"
                  stroke={color}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200"
                />
                <text y="3.5" textAnchor="middle" fontSize={isHovered ? 11 : 9}>
                  {icon}
                </text>
                <title>{`${srv.name} (${srv.distance_from_origin_km ?? srv.distance_km ?? 0} km from start) - ${srv.address}`}</title>
              </g>
            );
          })}
        </svg>

        {/* Hovered Service Tooltip Card */}
        {hoveredService && (
          <div className="absolute top-3 left-3 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-lg text-white text-xs max-w-xs space-y-1 z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 font-bold">
              <span>
                {hoveredService.type === "fuel"
                  ? "⛽"
                  : hoveredService.type === "mechanic"
                    ? "🔧"
                    : "🏥"}
              </span>
              <span className="truncate">{hoveredService.name}</span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              {hoveredService.address}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-medium">
              <span>
                📍{" "}
                {hoveredService.distance_from_origin_km ??
                  hoveredService.distance_km ??
                  0}{" "}
                km from start
              </span>
              {hoveredService.rating && (
                <span>★ {hoveredService.rating.toFixed(1)}</span>
              )}
            </div>
          </div>
        )}

        {/* Floating Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
          <span>● GPS Vector Map</span>
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold hover:underline ml-1"
          >
            Open in Google Maps ↗
          </a>
        </div>
      </div>
    </div>
  );
}
