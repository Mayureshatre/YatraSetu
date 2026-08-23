"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, DEFAULT_LOCATION } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleType } from "@/types";

export function TripSetupForm() {
  const router = useRouter();
  const { userLocation, requestLocationPermission, setManualLocation } =
    useAuth();

  const [originLabel, setOriginLabel] = React.useState(
    userLocation?.label || DEFAULT_LOCATION.label,
  );

  const [originLat, setOriginLat] = React.useState<number | null>(
    userLocation?.latitude ?? DEFAULT_LOCATION.latitude,
  );

  const [originLng, setOriginLng] = React.useState<number | null>(
    userLocation?.longitude ?? DEFAULT_LOCATION.longitude,
  );

  const [vehicleType, setVehicleType] = React.useState<VehicleType>("car");

  const [durationDays, setDurationDays] = React.useState<number>(1);

  const [isLoading, setIsLoading] = React.useState(false);

  const [loadingStatus, setLoadingStatus] = React.useState<string>("");

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (userLocation) {
      setOriginLabel(userLocation.label);
      setOriginLat(userLocation.latitude);
      setOriginLng(userLocation.longitude);
      setErrorMessage(null);
    }
  }, [userLocation]);

  const vehicles: Array<{
    type: VehicleType;
    label: string;
    icon: string;
    desc: string;
  }> = [
    {
      type: "car",
      label: "Car / Sedan",
      icon: "🚗",
      desc: "Standard paved highway driving",
    },
    {
      type: "bike",
      label: "Motorcycle",
      icon: "🏍️",
      desc: "Scenic curves & ghat routes",
    },
    {
      type: "suv",
      label: "SUV / 4x4",
      icon: "🚙",
      desc: "Rugged hills & wildlife safari trails",
    },
    {
      type: "bus",
      label: "Intercity Bus",
      icon: "🚌",
      desc: "Direct expressways & booking links",
    },
  ];

  const handleGpsClick = async () => {
    setErrorMessage(null);
    setLoadingStatus("Detecting GPS location...");

    const granted = await requestLocationPermission();

    setLoadingStatus("");

    if (!granted) {
      setErrorMessage(
        "GPS permission was denied or unavailable. Please enter your location manually.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setIsLoading(true);

    try {
      let finalLat = originLat;
      let finalLng = originLng;
      let finalLabel = originLabel.trim();

      const isCustomText =
        !userLocation ||
        userLocation.label.toLowerCase() !== finalLabel.toLowerCase();

      if (isCustomText || finalLat === null || finalLng === null) {
        setLoadingStatus("Resolving location coordinates via Google Maps...");

        const geoRes = await fetch(
          `/api/geocode?q=${encodeURIComponent(finalLabel)}`,
        );

        const geoJson = await geoRes.json();

        if (!geoRes.ok || !geoJson.data) {
          throw new Error(
            geoJson.error?.message ||
              `Unable to locate "${finalLabel}". Please verify the city or town name.`,
          );
        }

        const latitude = geoJson.data.latitude;
        const longitude = geoJson.data.longitude;

        if (
          typeof latitude !== "number" ||
          typeof longitude !== "number" ||
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          throw new Error(
            "Invalid location coordinates received from Google Maps.",
          );
        }

        finalLat = latitude;
        finalLng = longitude;
        finalLabel = geoJson.data.formatted_address || finalLabel;

        setManualLocation({
          latitude,
          longitude,
          label: finalLabel,
        });
      }

      if (finalLat === null || finalLng === null) {
        throw new Error("Unable to determine valid location coordinates.");
      }

      setLoadingStatus("Calculating road distances & AI rankings...");

      const queryParams = new URLSearchParams({
        origin_lat: finalLat.toString(),
        origin_lng: finalLng.toString(),
        origin_label: finalLabel,
        vehicle_type: vehicleType,
        duration_days: durationDays.toString(),
      });

      router.push(`/trip/recommendations?${queryParams.toString()}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to process location. Please try again.";

      setErrorMessage(message);
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 transition-colors"
    >
      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Origin Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          1. Starting Location / City Hub
        </label>

        <div className="flex gap-2">
          <Input
            value={originLabel}
            onChange={(e) => {
              setOriginLabel(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="Enter starting city (e.g. Jabalpur, Bhopal, Indore, Gwalior)"
            required
            className="font-medium"
          />

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleGpsClick}
            title="Use Device GPS"
            className="shrink-0 font-bold gap-1.5"
          >
            <span>📍</span>
            <span>GPS</span>
          </Button>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Enter any Indian city/town or use GPS to calculate live road distance
          to destinations.
        </p>
      </div>

      {/* Vehicle Preference */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          2. Travel Vehicle Preference
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vehicles.map((v) => (
            <button
              key={v.type}
              type="button"
              onClick={() => setVehicleType(v.type)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                vehicleType === v.type
                  ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div className="text-2xl mb-1">{v.icon}</div>

              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {v.label}
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {v.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration Days */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          3. Trip Duration (Days)
        </label>

        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDurationDays(d)}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                durationDays === d
                  ? "bg-emerald-600 border-emerald-600 dark:bg-emerald-700 dark:border-emerald-600 text-white shadow-sm"
                  : "bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              {d} Day{d > 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button & Dynamic Status */}
      <div className="pt-3 space-y-2">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          className="w-full text-base font-bold shadow-md"
        >
          <span>✨ Discover AI Ranked Destinations</span>
        </Button>

        {isLoading && loadingStatus && (
          <p className="text-center text-xs text-emerald-700 dark:text-emerald-400 font-medium animate-pulse">
            {loadingStatus}
          </p>
        )}
      </div>
    </form>
  );
}
