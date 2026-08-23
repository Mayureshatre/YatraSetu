"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";

export function LocationPermissionModal() {
  const {
    showLocationModal,
    requestLocationPermission,
    setManualLocation,
    dismissLocationPrompt,
  } = useAuth();

  const [isRequesting, setIsRequesting] = React.useState(false);
  const [customInput, setCustomInput] = React.useState("");
  const [isGeocoding, setIsGeocoding] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const POPULAR_HUBS = [
    { label: "Jabalpur, Madhya Pradesh", lat: 23.1815, lng: 79.9864 },
    { label: "Bhopal, Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
    { label: "Indore, Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
    { label: "Gwalior, Madhya Pradesh", lat: 26.2183, lng: 78.1828 },
    { label: "Ujjain, Madhya Pradesh", lat: 23.1765, lng: 75.7885 },
    { label: "Pachmarhi, Madhya Pradesh", lat: 22.4674, lng: 78.4346 },
  ];

  const handleGrantGps = async () => {
    setError(null);
    setIsRequesting(true);
    const granted = await requestLocationPermission();
    setIsRequesting(false);
    if (!granted) {
      setError(
        "GPS access denied or timed out. Please enter your location manually.",
      );
    }
  };

  const handleManualSelect = (hub: (typeof POPULAR_HUBS)[0]) => {
    setManualLocation({
      latitude: hub.lat,
      longitude: hub.lng,
      label: hub.label,
    });
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setError(null);
    setIsGeocoding(true);

    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(customInput.trim())}`,
      );
      const json = await res.json();

      if (!res.ok || !json.data) {
        throw new Error(
          json.error?.message || `Could not find location "${customInput}".`,
        );
      }

      setManualLocation({
        latitude: json.data.latitude,
        longitude: json.data.longitude,
        label: json.data.formatted_address || customInput.trim(),
      });
    } catch (err: any) {
      setError(err.message || "Failed to geocode location. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <Modal
      isOpen={showLocationModal}
      onClose={dismissLocationPrompt}
      title="Set Your Travel Starting Location"
      description="YatraSetu calculates verified road distance, travel duration, and AI recommendations from your exact origin."
      maxWidth="md"
    >
      <div className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
            ⚠️ {error}
          </div>
        )}

        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs space-y-1.5">
          <p className="font-bold">Why location is essential:</p>
          <ul className="space-y-1 list-disc list-inside text-emerald-800 dark:text-emerald-300">
            <li>Computes real road distances via Google Maps Routes API.</li>
            <li>
              Prioritizes destinations within your preferred 100 km radius.
            </li>
            <li>
              Locates live emergency services (Fuel, Mechanics, Hospitals) along
              your route.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGrantGps}
            isLoading={isRequesting}
            className="w-full gap-2 text-sm font-bold shadow-md"
          >
            <span>📍</span>
            <span>Use Device GPS Location</span>
          </Button>
        </div>

        {/* Custom Location Search Input */}
        <form
          onSubmit={handleCustomSubmit}
          className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60"
        >
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Or Search Any City / Town:
          </label>
          <div className="flex gap-2">
            <Input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. Jabalpur, Rewa, Sagar, Chhindwara"
              className="text-xs"
            />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              isLoading={isGeocoding}
              className="shrink-0 font-bold"
            >
              Set Location
            </Button>
          </div>
        </form>

        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Or Select a Quick Regional Hub:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_HUBS.map((hub) => (
              <button
                key={hub.label}
                type="button"
                onClick={() => handleManualSelect(hub)}
                className="text-left text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-between"
              >
                <span className="truncate">{hub.label.split(",")[0]}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold ml-1">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
