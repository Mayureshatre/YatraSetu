import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ApiErrorResponse } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates great-circle distance between two coordinates in meters using the Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Estimates driving travel duration in seconds based on road distance and vehicle type.
 */
export function estimateTravelDurationSeconds(
  distanceMeters: number,
  vehicleType: 'car' | 'bike' | 'suv' | 'bus' = 'car'
): number {
  // Average highway/arterial road speeds in km/h for central/rural routes
  const speedMap: Record<string, number> = {
    car: 55,
    suv: 60,
    bike: 45,
    bus: 40,
  };
  const speedKmh = speedMap[vehicleType] || 50;
  const hours = (distanceMeters / 1000) / speedKmh;
  return Math.round(hours * 3600);
}

/**
 * Formats duration in seconds into human-friendly string (e.g. "2 hrs 30 mins").
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs === 0) {
    return `${mins} mins`;
  }
  if (mins === 0) {
    return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  }
  return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
}

/**
 * Formats distance in meters into km string.
 */
export function formatDistance(meters: number): string {
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

/**
 * Standard API error response generator following Section 8.3
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown> | any[],
  status = 400
): { response: ApiErrorResponse; status: number } {
  return {
    response: {
      error: {
        code,
        message,
        details,
        requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      },
    },
    status,
  };
}
