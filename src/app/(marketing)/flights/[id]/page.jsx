'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFlightById } from '@/lib/api/flights';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { ROUTES } from '@/lib/constants/routes';

export default function FlightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const setBooking = useCheckoutStore((s) => s.setBooking);

  useEffect(() => {
    getFlightById(params.id)
      .then(setFlight)
      .catch(() => setFlight(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSelect = () => {
    setBooking({ type: 'flight', flight });
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
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Flight Details</h1>
        <div className="space-y-4 mb-8">
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
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Price</span>
            <span className="font-bold text-indigo-600">₹{flight.price?.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={handleSelect}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
