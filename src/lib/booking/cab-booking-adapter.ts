import { CabBookingRedirectInfo, CabBookingRedirectParams } from '@/types';

// Configurable threshold: Journeys <= 100 km are well-suited for cabs/taxis
export const CAB_MAX_DISTANCE_KM = 100;

export class CabBookingAdapter {
  generateRedirectInfo(params: CabBookingRedirectParams): CabBookingRedirectInfo {
    const origin = params.origin_city.trim();
    const destination = params.destination_city.trim();
    const distanceKm = params.distance_km ?? 0;

    const isSuitable = distanceKm > 0 ? distanceKm <= CAB_MAX_DISTANCE_KM : true;

    // Construct official Rapido web / app redirection URL
    // Rapido official portal URL with destination hint
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDest = encodeURIComponent(destination);
    const bookingUrl = `https://www.rapido.bike/?pickup=${encodedOrigin}&drop=${encodedDest}`;

    const suitabilityMessage = isSuitable
      ? `Ideal for local or short intercity ride-hailing (~${distanceKm} km).`
      : `Cab may be less suitable for this long distance (${distanceKm} km > ${CAB_MAX_DISTANCE_KM} km). Intercity buses or self-drive are recommended.`;

    return {
      provider_name: 'Rapido Cabs & Auto',
      origin_city: origin,
      destination_city: destination,
      distance_km: distanceKm,
      is_suitable: isSuitable,
      max_suitable_distance_km: CAB_MAX_DISTANCE_KM,
      booking_url: bookingUrl,
      deeplink_available: true,
      suitability_message: suitabilityMessage,
      disclaimer: 'You will be redirected to the official Rapido app/website. Confirm exact pickup location, vehicle class, and fare estimate in Rapido before riding.',
    };
  }
}

export const cabBookingAdapter = new CabBookingAdapter();
