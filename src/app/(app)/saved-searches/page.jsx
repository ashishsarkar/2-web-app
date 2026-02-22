'use client';

import Link from 'next/link';
import { useSavedSearchesStore } from '@/lib/store/savedSearchesStore';
import { ROUTES } from '@/lib/constants/routes';

export default function SavedSearchesPage() {
  const { searches, removeSearch } = useSavedSearchesStore();

  const getSearchUrl = (s) => {
    if (s.type === 'flight') {
      const params = new URLSearchParams({ origin: s.origin, destination: s.destination });
      if (s.departureDate) params.set('departureDate', s.departureDate);
      return `${ROUTES.FLIGHT_SEARCH}?${params}`;
    }
    const params = new URLSearchParams({ location: s.location });
    if (s.checkIn) params.set('checkIn', s.checkIn);
    if (s.checkOut) params.set('checkOut', s.checkOut);
    return `${ROUTES.HOTEL_SEARCH}?${params}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Searches</h1>

      {searches.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-600 mb-4">No saved searches.</p>
          <p className="text-sm text-gray-500">Save a search from the flight or hotel results page.</p>
          <Link href={ROUTES.HOME} className="inline-block mt-4 text-indigo-600 font-medium">
            Search flights or hotels
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {searches.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center bg-white rounded-xl p-4 shadow border border-gray-100"
            >
              <Link href={getSearchUrl(s)} className="flex-1">
                <span className="font-medium capitalize">{s.type}</span>
                {s.type === 'flight' && (
                  <span> {s.origin} → {s.destination} {s.departureDate ? `• ${s.departureDate}` : ''}</span>
                )}
                {s.type === 'hotel' && (
                  <span> {s.location} {s.checkIn ? `• ${s.checkIn} to ${s.checkOut || '—'}` : ''}</span>
                )}
              </Link>
              <button
                onClick={() => removeSearch(s.id)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
