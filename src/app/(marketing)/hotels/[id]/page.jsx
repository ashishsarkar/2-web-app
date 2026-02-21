'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getHotelById } from '@/lib/api/hotels';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { ROUTES } from '@/lib/constants/routes';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const setBooking = useCheckoutStore((s) => s.setBooking);

  useEffect(() => {
    getHotelById(params.id)
      .then(setHotel)
      .catch(() => setHotel(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSelect = () => {
    setBooking({ type: 'hotel', hotel });
    router.push(ROUTES.CHECKOUT);
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><div className="h-64 bg-gray-200 rounded-xl animate-pulse" /></div>;
  }
  if (!hotel) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><p className="text-gray-600">Hotel not found.</p></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{hotel.name}</h1>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600">Location</span>
            <span className="font-semibold">{hotel.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Address</span>
            <span>{hotel.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rating</span>
            <span className="font-semibold">★ {hotel.rating}</span>
          </div>
          {hotel.amenities?.length ? (
            <div>
              <span className="text-gray-600 block mb-1">Amenities</span>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((a) => (
                  <span key={a} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{a}</span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex justify-between text-lg pt-4">
            <span className="text-gray-600">Price per night</span>
            <span className="font-bold text-indigo-600">₹{hotel.price?.toLocaleString()}</span>
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
