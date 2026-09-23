"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

interface MapPanelProps {
  originLat: number;
  originLng: number;
  originLabel?: string;
  destLat: number;
  destLng: number;
  destName?: string;
  distanceKm?: number;
  durationFormatted?: string;
  vehicleType?: string;
  services?: {
    fuel?: any[];
    mechanic?: any[];
    hospital?: any[];
  };
  className?: string;
}

export function MapPanel({
  originLat,
  originLng,
  destLat,
  destLng,
  services,
}: MapPanelProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "") {
    return (
      <div className="h-[400px] w-full rounded-xl border border-gray-800 bg-gray-900 flex flex-col items-center justify-center text-gray-500">
        <span className="text-xl mb-2">🗺️</span>
        <p>Interactive Map Temporarily Offline</p>
      </div>
    );
  }

  const centerLat = (originLat + destLat) / 2;
  const centerLng = (originLng + destLng) / 2;

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl border border-gray-800">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: centerLat, lng: centerLng }}
          defaultZoom={11}
          mapId="DEMO_MAP_ID"
          disableDefaultUI={true}
        >
          <AdvancedMarker position={{ lat: originLat, lng: originLng }}>
            <Pin
              background={"#0ea5e9"}
              borderColor={"#0284c7"}
              glyphColor={"#fff"}
            />
          </AdvancedMarker>

          <AdvancedMarker position={{ lat: destLat, lng: destLng }}>
            <Pin
              background={"#10b981"}
              borderColor={"#059669"}
              glyphColor={"#fff"}
            />
          </AdvancedMarker>

          {services?.fuel?.map((place, idx) => (
            <AdvancedMarker
              key={`fuel-${idx}`}
              position={{
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              }}
              title={place.name}
            >
              <Pin
                background={"#ef4444"}
                borderColor={"#b91c1c"}
                glyphColor={"#fff"}
              />
            </AdvancedMarker>
          ))}

          {services?.hospital?.map((place, idx) => (
            <AdvancedMarker
              key={`hosp-${idx}`}
              position={{
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              }}
              title={place.name}
            >
              <Pin
                background={"#8b5cf6"}
                borderColor={"#6d28d9"}
                glyphColor={"#fff"}
              />
            </AdvancedMarker>
          ))}

          {services?.mechanic?.map((place, idx) => (
            <AdvancedMarker
              key={`mech-${idx}`}
              position={{
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              }}
              title={place.name}
            >
              <Pin
                background={"#f59e0b"}
                borderColor={"#b45309"}
                glyphColor={"#fff"}
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

export default MapPanel;
