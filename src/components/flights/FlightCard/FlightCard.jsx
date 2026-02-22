'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCurrencyStore } from '@/lib/store/currencyStore';
import { ROUTES } from '@/lib/constants/routes';

export default function FlightCard({ flight }) {
  const { addFlight, removeFlight, flights } = useWishlistStore();
  const format = useCurrencyStore((s) => s.format);
  const saved = flights?.some((f) => f.id === flight?.id);

  if (!flight) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md flex justify-between items-center gap-4">
      <Link href={ROUTES.FLIGHT_DETAIL(flight.id)} className="flex-1">
        <div className="font-medium text-gray-900">{flight.airline} • {flight.origin} → {flight.destination}</div>
        <div className="text-sm text-gray-600">{flight.duration} • {new Date(flight.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="font-semibold text-indigo-600 mt-1">{format(flight.price)}</div>
      </Link>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); saved ? removeFlight(flight.id) : addFlight(flight); }}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        {saved ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
