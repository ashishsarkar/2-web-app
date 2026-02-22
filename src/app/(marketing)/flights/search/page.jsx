'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchFlights } from '@/lib/api/flights';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useSavedSearchesStore } from '@/lib/store/savedSearchesStore';
import { useCurrencyStore } from '@/lib/store/currencyStore';
import { ROUTES } from '@/lib/constants/routes';

function FlightSearchContent() {
  const { addFlight, removeFlight, flights: savedFlights } = useWishlistStore();
  const addSearch = useSavedSearchesStore((s) => s.addSearch);
  const format = useCurrencyStore((s) => s.format);
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const origin = searchParams.get('origin') || '';
    const destination = searchParams.get('destination') || '';
    searchFlights({ origin, destination })
      .then((res) => setFlights(res.flights || []))
      .catch(() => setFlights([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Flight Search Results</h1>
        {searchParams.get('origin') && searchParams.get('destination') && (
          <button
            type="button"
            onClick={() => addSearch({
              type: 'flight',
              origin: searchParams.get('origin'),
              destination: searchParams.get('destination'),
              departureDate: searchParams.get('departureDate') || '',
            })}
            className="text-sm text-indigo-600 hover:underline"
          >
            Save this search
          </button>
        )}
      </div>
      {flights.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-600">No flights found. Try different search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flights.map((f) => {
            const saved = savedFlights?.some((x) => x.id === f.id);
            return (
              <div key={f.id} className="bg-white rounded-xl p-6 shadow border border-gray-100 hover:shadow-md transition relative">
                <button
                  type="button"
                  onClick={() => saved ? removeFlight(f.id) : addFlight(f)}
                  className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100"
                  title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  {saved ? '❤️' : '🤍'}
                </button>
                <Link href={ROUTES.FLIGHT_DETAIL(f.id)}>
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">✈</span>
                      <div>
                        <p className="font-semibold text-gray-900">{f.airline}</p>
                        <p className="text-gray-600">{f.origin} → {f.destination} • {f.duration}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(f.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {new Date(f.arrivalTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">{format(f.price)}</p>
                      <p className="text-sm text-gray-500">per person</p>
                      <span className="inline-block mt-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                        Select
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FlightSearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12"><div className="h-32 bg-gray-200 rounded-xl animate-pulse" /></div>}>
      <FlightSearchContent />
    </Suspense>
  );
}
