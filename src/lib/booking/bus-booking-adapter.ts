import { BusBookingRedirectInfo, BusBookingRedirectParams } from '@/types';

export class BusBookingAdapter {
  generateRedirectInfo(params: BusBookingRedirectParams): BusBookingRedirectInfo {
    const origin = encodeURIComponent(params.origin_city.trim());
    const destination = encodeURIComponent(params.destination_city.trim());
    const provider = params.provider || 'redbus';

    const dateStr = params.travel_date || new Date(Date.now() + 86400000).toISOString().split('T')[0];

    let bookingUrl = `https://www.redbus.in/bus-tickets/${origin.toLowerCase()}-to-${destination.toLowerCase()}?date=${dateStr}`;
    let providerName = 'RedBus India';

    if (provider === 'abhibus') {
      bookingUrl = `https://www.abhibus.com/bus_search/${origin}/${destination}/${dateStr}/O`;
      providerName = 'AbhiBus';
    } else if (provider === 'state_transport') {
      bookingUrl = `https://www.mptransport.org/`;
      providerName = 'MP State Road Transport (Interstate Services)';
    }

    return {
      provider_name: providerName,
      origin_city: params.origin_city,
      destination_city: params.destination_city,
      travel_date: dateStr,
      booking_url: bookingUrl,
      deeplink_available: true,
      disclaimer: 'You will be redirected to the verified external booking provider to view available seats, operators, and ticket pricing.',
    };
  }
}

export const busBookingAdapter = new BusBookingAdapter();
