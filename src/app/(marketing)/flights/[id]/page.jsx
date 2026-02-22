'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFlightById, searchFlights } from '@/lib/api/flights';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { ROUTES } from '@/lib/constants/routes';
import SeatMap from '@/components/flights/SeatMap';
import FlightCard from '@/components/flights/FlightCard';

export default function FlightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [baggageStatus, setBaggageStatus] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const setBooking = useCheckoutStore((s) => s.setBooking);

  useEffect(() => {
    getFlightById(params.id)
      .then((f) => {
        setFlight(f);
        setBaggageStatus({ status: 'checked', allowance: '7 kg cabin + 15 kg check-in' });
        if (f?.destination) {
          searchFlights({ destination: f.destination }).then((r) => {
            const list = Array.isArray(r) ? r : (r.flights || []);
            const others = list.filter((x) => x.id !== f.id).slice(0, 3);
            setRecommendations(others);
          }).catch(() => {});
        }
      })
      .catch(() => setFlight(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSelect = () => {
    setBooking({ type: 'flight', flight: { ...flight, seat: selectedSeat } });
    router.push(ROUTES.CHECKOUT);
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><div className="h-64 bg-gray-200 rounded-xl animate-pulse" /></div>;
  }
  if (!flight) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><p className="text-gray-600">Flight not found.</p></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Flight Details</h1>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Airline</span>
            <span className="font-semibold">{flight.airline}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Route</span>
            <span className="font-semibold">{flight.origin} → {flight.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Departure</span>
            <span>{new Date(flight.departureTime).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Arrival</span>
            <span>{new Date(flight.arrivalTime).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration</span>
            <span>{flight.duration || 'N/A'}</span>
          </div>
          {baggageStatus && (
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Baggage</span>
              <span className="font-medium">{baggageStatus.allowance} • {baggageStatus.status}</span>
            </div>
          )}
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Price</span>
            <span className="font-bold text-indigo-600">₹{flight.price?.toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-6">
          <SeatMap selectedSeat={selectedSeat} onSelectSeat={setSelectedSeat} />
        </div>

        <button
          onClick={handleSelect}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
        >
          Proceed to Checkout {selectedSeat ? `(Seat ${selectedSeat})` : ''}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">You might also like</h2>
          <div className="space-y-3">
            {recommendations.map((r) => (
              <Link key={r.id} href={ROUTES.FLIGHT_DETAIL(r.id)}>
                <FlightCard flight={r} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
