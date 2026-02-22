'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCurrencyStore } from '@/lib/store/currencyStore';
import { ROUTES } from '@/lib/constants/routes';

export default function WishlistPage() {
  const { flights, hotels, removeFlight, removeHotel } = useWishlistStore();
  const format = useCurrencyStore((s) => s.format);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h1>

      {flights.length === 0 && hotels.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-600 mb-4">No saved flights or hotels.</p>
          <Link href={ROUTES.HOME} className="text-indigo-600 font-medium">
            Search to add items
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {flights.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Saved flights</h2>
              <div className="space-y-2">
                {flights.map((f) => (
                  <div
                    key={f.id}
                    className="flex justify-between items-center bg-white rounded-xl p-4 shadow border border-gray-100"
                  >
                    <Link href={ROUTES.FLIGHT_DETAIL(f.id)} className="flex-1">
                      <span className="font-medium">{f.airline} • {f.origin} → {f.destination}</span>
                      <span className="block text-indigo-600 font-medium">{format(f.price)}</span>
                    </Link>
                    <button
                      onClick={() => removeFlight(f.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hotels.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Saved hotels</h2>
              <div className="space-y-2">
                {hotels.map((h) => (
                  <div
                    key={h.id}
                    className="flex justify-between items-center bg-white rounded-xl p-4 shadow border border-gray-100"
                  >
                    <Link href={ROUTES.HOTEL_DETAIL(h.id)} className="flex-1">
                      <span className="font-medium">{h.name} • {h.location}</span>
                      <span className="block text-indigo-600 font-medium">{format(h.price)}/night</span>
                    </Link>
                    <button
                      onClick={() => removeHotel(h.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
