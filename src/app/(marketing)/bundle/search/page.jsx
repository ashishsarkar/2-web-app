'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchFlights } from '@/lib/api/flights';
import { searchHotels } from '@/lib/api/hotels';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { ROUTES } from '@/lib/constants/routes';
import FlightCard from '@/components/flights/FlightCard';
import HotelCard from '@/components/hotels/HotelCard';
import { useCurrencyStore } from '@/lib/store/currencyStore';

function BundleSearchContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('destination') || '';
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const router = useRouter();
  const setBooking = useCheckoutStore((s) => s.setBooking);
  const format = useCurrencyStore((s) => s.format);

  useEffect(() => {
    if (!destination) {
      setLoading(false);
      return;
    }
    Promise.all([
      searchFlights({ destination }).then((r) => (Array.isArray(r) ? r : r.flights || [])),
      searchHotels({ location: destination }).then((r) => (Array.isArray(r) ? r : r.hotels || [])),
    ])
      .then(([f, h]) => {
        setFlights(f);
        setHotels(h);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [destination]);

  const handleBookBundle = () => {
    if (!selectedFlight || !selectedHotel) return;
    const hotel = selectedHotel.rooms?.[0]
      ? { ...selectedHotel, room: selectedHotel.rooms[0], price: selectedHotel.rooms[0].price }
      : selectedHotel;
    setBooking({
      type: 'bundle',
      flight: selectedFlight,
      hotel,
      bundleTotal: (selectedFlight.price || 0) + (hotel.price || hotel.rooms?.[0]?.price || 0),
    });
    router.push(ROUTES.CHECKOUT);
  };

  const total = (selectedFlight?.price || 0) + (selectedHotel?.price || selectedHotel?.rooms?.[0]?.price || 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Flight + Hotel Bundle — {destination || 'All'}
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select flight</h2>
          <div className="space-y-3">
            {flights.length === 0 ? (
              <p className="text-gray-500">No flights found.</p>
            ) : (
              flights.slice(0, 5).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFlight(f)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedFlight?.id === f.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="font-medium">{f.airline} {f.origin} → {f.destination}</span>
                  <span className="block text-indigo-600 font-medium">{format(f.price)}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select hotel</h2>
          <div className="space-y-3">
            {hotels.length === 0 ? (
              <p className="text-gray-500">No hotels found.</p>
            ) : (
              hotels.slice(0, 5).map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHotel(h)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedHotel?.id === h.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="font-medium">{h.name}</span>
                  <span className="block text-indigo-600 font-medium">
                    {format(h.rooms?.[0]?.price ?? h.price)}/night
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedFlight && selectedHotel && (
        <div className="bg-indigo-50 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-gray-700">
              {selectedFlight.airline} + {selectedHotel.name}
            </p>
            <p className="text-xl font-bold text-indigo-600">{format(total)} total</p>
          </div>
          <button
            onClick={handleBookBundle}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            Book bundle & checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default function BundleSearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12"><div className="h-64 bg-gray-200 rounded-xl animate-pulse" /></div>}>
      <BundleSearchContent />
    </Suspense>
  );
}
