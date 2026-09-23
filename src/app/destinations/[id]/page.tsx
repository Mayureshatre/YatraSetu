"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Destination,
  DestinationServicesData,
  DestinationWeatherData,
  FlexibleItinerary,
  BusBookingRedirectInfo,
  CabBookingRedirectInfo,
} from "@/types";
import { MapPanel } from "@/components/map/map-panel";
import { ServiceList } from "@/components/destination/service-list";
import { SafetyCard } from "@/components/destination/safety-card";
import { WeatherCard } from "@/components/destination/weather-card";
import { RatingBreakdown } from "@/components/ui/rating-breakdown";
import { ReviewCard } from "@/components/destination/review-card";
import { ReviewFormModal } from "@/components/destination/review-form-modal";
import { CommunityPostCard } from "@/components/community/community-post-card";
import { CreatePostModal } from "@/components/community/create-post-modal";
import { ItineraryView } from "@/components/itinerary/itinerary-view";
import { TravelOptionsCard } from "@/components/booking/travel-options-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useAuth, DEFAULT_LOCATION } from "@/lib/auth/auth-context";

export default function DestinationDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, userLocation, signInWithGoogle } = useAuth();
  const destinationId = params.id as string;

  const urlOriginLat = searchParams.get("origin_lat");
  const urlOriginLng = searchParams.get("origin_lng");
  const urlOriginLabel = searchParams.get("origin_label");
  const vehicleType = searchParams.get("vehicle_type") || "car";

  const origin = React.useMemo(() => {
    if (urlOriginLat && urlOriginLng && urlOriginLabel) {
      return {
        latitude: parseFloat(urlOriginLat),
        longitude: parseFloat(urlOriginLng),
        label: urlOriginLabel,
      };
    }
    return userLocation || DEFAULT_LOCATION;
  }, [urlOriginLat, urlOriginLng, urlOriginLabel, userLocation]);

  const [destination, setDestination] = React.useState<Destination | null>(
    null,
  );
  const [weather, setWeather] = React.useState<DestinationWeatherData | null>(
    null,
  );
  const [services, setServices] =
    React.useState<DestinationServicesData | null>(null);
  const [mapServices, setMapServices] = React.useState<{
    fuel?: any[];
    mechanic?: any[];
    hospital?: any[];
  } | null>(null);
  const [communityData, setCommunityData] = React.useState<any>(null);
  const [itinerary, setItinerary] = React.useState<FlexibleItinerary | null>(
    null,
  );
  const [busRedirect, setBusRedirect] =
    React.useState<BusBookingRedirectInfo | null>(null);
  const [cabRedirect, setCabRedirect] =
    React.useState<CabBookingRedirectInfo | null>(null);
  const [routeInfo, setRouteInfo] = React.useState<{
    distance_km: number;
    duration_formatted: string;
  } | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isWeatherLoading, setIsWeatherLoading] = React.useState(true);
  const [isItinLoading, setIsItinLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const [showPostModal, setShowPostModal] = React.useState(false);

  const loadAllData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const destRes = await fetch(`/api/destinations/${destinationId}`, {
        cache: "no-store",
      });
      if (!destRes.ok) throw new Error("Destination not found");
      const destJson = await destRes.json();
      const dest: Destination = destJson.data;
      setDestination(dest);

      const originCityName = origin.label.split(",")[0].trim();
      const destCityName = dest.name.split(" ")[0].trim();

      setIsWeatherLoading(true);
      const [
        srvRes,
        facilityRes,
        weatherRes,
        commRes,
        routeRes,
        busRes,
        cabRes,
      ] = await Promise.allSettled([
        fetch(
          `/api/destinations/${dest.id}/services?origin_lat=${origin.latitude}&origin_lng=${origin.longitude}&origin_label=${encodeURIComponent(origin.label)}&vehicle_type=${vehicleType}`,
          { cache: "no-store" },
        ),
        fetch(
          `/api/destinations/${dest.id}/facilities?lat=${dest.latitude}&lng=${dest.longitude}`,
          { cache: "no-store" },
        ),
        fetch(
          `/api/destinations/${dest.id}/weather?lat=${dest.latitude}&lng=${dest.longitude}`,
          { cache: "no-store" },
        ),
        fetch(`/api/destinations/${dest.id}/community`, {
          cache: "no-store",
        }),
        fetch(
          `/api/routes?origin_lat=${origin.latitude}&origin_lng=${origin.longitude}&dest_lat=${dest.latitude}&dest_lng=${dest.longitude}&vehicle_type=${vehicleType}`,
          { cache: "no-store" },
        ),
        fetch(
          `/api/booking/bus?origin_city=${encodeURIComponent(originCityName)}&destination_city=${encodeURIComponent(destCityName)}`,
          { cache: "no-store" },
        ),
        fetch(
          `/api/booking/cab?origin_city=${encodeURIComponent(originCityName)}&destination_city=${encodeURIComponent(destCityName)}`,
          { cache: "no-store" },
        ),
      ]);

      if (srvRes.status === "fulfilled" && srvRes.value.ok) {
        const json = await srvRes.value.json();
        setServices(json.data);
      }
      if (facilityRes.status === "fulfilled" && facilityRes.value.ok) {
        try {
          const json = await facilityRes.value.json();
          setMapServices({
            fuel: json.data?.fuel_stations?.places || [],
            mechanic: json.data?.mechanics?.places || [],
            hospital: json.data?.hospitals?.places || [],
          });
        } catch {
          setMapServices({
            fuel: [],
            mechanic: [],
            hospital: [],
          });
        }
      } else {
        setMapServices({
          fuel: [],
          mechanic: [],
          hospital: [],
        });
      }
      if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
        const json = await weatherRes.value.json();
        setWeather(json.data);
      }
      setIsWeatherLoading(false);

      if (commRes.status === "fulfilled" && commRes.value.ok) {
        const json = await commRes.value.json();
        setCommunityData(json.data);
      }
      if (routeRes.status === "fulfilled" && routeRes.value.ok) {
        const json = await routeRes.value.json();
        setRouteInfo({
          distance_km: json.data.distance_km,
          duration_formatted: json.data.duration_formatted,
        });
      }
      if (busRes.status === "fulfilled" && busRes.value.ok) {
        const json = await busRes.value.json();
        setBusRedirect(json.data);
      }
      if (cabRes.status === "fulfilled" && cabRes.value.ok) {
        const json = await cabRes.value.json();
        setCabRedirect(json.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsWeatherLoading(false);
    }
  }, [destinationId, origin, vehicleType]);

  React.useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleGenerateItinerary = async () => {
    if (!destination) return;
    setIsItinLoading(true);
    try {
      const res = await fetch("/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_id: destination.id,
          duration_days: 2,
          vehicle_type: vehicleType,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setItinerary(json.data);
      }
    } finally {
      setIsItinLoading(false);
    }
  };

  const handleAddComment = async (
    postId: string,
    text: string,
    parentId?: string,
  ) => {
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: text,
        parent_id: parentId,
        user_id: user?.id || "traveler-user-01",
        user_name: user?.name || "Explorer",
        user_avatar: user?.avatar_url,
      }),
    });
    const commRes = await fetch(
      `/api/destinations/${destinationId}/community`,
      {
        cache: "no-store",
      },
    );
    if (commRes.ok) {
      const json = await commRes.json();
      setCommunityData(json.data);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-80 w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorState
          title="Destination could not be loaded"
          message={error || "Destination not found."}
          onRetry={loadAllData}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header with Verified Image & Provenance Attribution Badge */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-md group">
        <img
          src={
            destination.hero_image_url ||
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
          }
          alt={destination.image_alt || destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Image Attribution */}
        {destination.image_source && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white/90 text-[11px] px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
            <span>📷</span>
            <span>{destination.image_source}</span>
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider">
              {destination.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">
              {destination.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-2 flex-wrap">
              <span>📍 {destination.region}</span>
              <span>•</span>
              <span>
                🛣️{" "}
                {routeInfo
                  ? `${routeInfo.distance_km} km`
                  : "Calculating route..."}{" "}
                from {origin.label.split(",")[0]}
              </span>
              <span>•</span>
              <span>
                ⏱️{" "}
                {routeInfo
                  ? `${routeInfo.duration_formatted} by ${vehicleType}`
                  : "Calculating time..."}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (!user) {
                  signInWithGoogle();
                  return;
                }
                setShowReviewModal(true);
              }}
            >
              {user ? "★ Rate & Review" : "Sign in to Review"}
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                if (!user) {
                  signInWithGoogle();
                  return;
                }
                setShowPostModal(true);
              }}
            >
              {user ? "+ Share Story" : "Sign in to Post"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Content + Side Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview & Image Credit */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-3 transition-colors">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              About {destination.name}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {destination.description}
            </p>
            {destination.image_credit && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                Photo Credit: <strong>{destination.image_credit}</strong> (
                {destination.image_license || "Verified"})
              </p>
            )}
          </div>

          {/* 5-Day Live Weather Forecast */}
          <WeatherCard weather={weather} isLoading={isWeatherLoading} />

          {/* Interactive Route Map */}
          <MapPanel
            originLat={origin.latitude}
            originLng={origin.longitude}
            originLabel={origin.label}
            destLat={destination.latitude}
            destLng={destination.longitude}
            destName={destination.name}
            distanceKm={routeInfo?.distance_km ?? 0}
            durationFormatted={routeInfo?.duration_formatted ?? ""}
            services={
              mapServices ||
              (services
                ? {
                    fuel: services.fuel_stations.places,
                    mechanic: services.mechanics.places,
                    hospital: services.hospitals.places,
                  }
                : undefined)
            }
          />

          {/* Live Support Along User's Route */}
          {services && <ServiceList services={services} />}

          {/* Flexible AI Itinerary */}
          <ItineraryView
            itinerary={itinerary}
            isLoading={isItinLoading}
            onRegenerate={handleGenerateItinerary}
            destinationName={destination.name}
            durationDays={2}
          />

          {/* Travel & Booking Options (Bus, Rapido Cab, Self-Drive) */}
          <TravelOptionsCard
            busRedirect={busRedirect}
            cabRedirect={cabRedirect}
            distanceKm={routeInfo?.distance_km ?? 0}
            durationFormatted={routeInfo?.duration_formatted ?? ""}
            destinationName={destination.name}
          />

          {/* Community Discussion Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Traveler Discussions for {destination.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real explorer tips, questions, and road conditions
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPostModal(true)}
              >
                + Ask or Share
              </Button>
            </div>

            {communityData?.posts && communityData.posts.length > 0 ? (
              <div className="space-y-4">
                {communityData.posts.map((post: any) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    onAddComment={handleAddComment}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                No community discussions yet for {destination.name}. Be the
                first to start one!
              </p>
            )}
          </div>
        </div>

        {/* Right 4 Columns */}
        <div className="lg:col-span-4 space-y-6">
          {/* Road & Terrain Safety Card */}
          <SafetyCard
            roadCondition={destination.road_condition}
            safetyTips={destination.safety_tips}
          />

          {/* Rating Breakdown & Reviews */}
          {communityData?.rating_summary && (
            <div className="space-y-4">
              <RatingBreakdown
                overallScore={communityData.rating_summary.overall_average}
                totalReviews={communityData.rating_summary.total_reviews}
                categoryAverages={
                  communityData.rating_summary.category_averages
                }
              />

              {/* Recent Reviews */}
              {communityData.reviews && communityData.reviews.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Recent Verified Reviews
                  </h4>
                  {communityData.reviews.slice(0, 3).map((r: any) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ReviewFormModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        destinationId={destination.id}
        destinationName={destination.name}
        reviews={communityData?.reviews || []}
        onReviewSubmitted={loadAllData}
      />

      <CreatePostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        destinations={[destination]}
        preselectedDestinationId={destination.id}
        onPostCreated={loadAllData}
      />
    </div>
  );
}
