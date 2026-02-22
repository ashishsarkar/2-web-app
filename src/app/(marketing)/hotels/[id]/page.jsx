'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getHotelById, searchHotels } from '@/lib/api/hotels';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { ROUTES } from '@/lib/constants/routes';
import HotelCard from '@/components/hotels/HotelCard';
import HotelMap from '@/components/hotels/HotelMap';
import { useCurrencyStore } from '@/lib/store/currencyStore';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const setBooking = useCheckoutStore((s) => s.setBooking);
  const format = useCurrencyStore((s) => s.format);

  useEffect(() => {
    getHotelById(params.id)
      .then((h) => {
        setHotel(h);
        if (!selectedRoom && h?.rooms?.length) setSelectedRoom(h.rooms[0]);
        if (h?.location) {
          searchHotels({ location: h.location }).then((r) => {
            const list = Array.isArray(r) ? r : (r.hotels || r.results || []);
            const others = list.filter((x) => x.id !== h.id).slice(0, 3);
            setRecommendations(others);
          }).catch(() => {});
        }
      })
      .catch(() => setHotel(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (hotel?.rooms?.length && !selectedRoom) setSelectedRoom(hotel.rooms[0]);
  }, [hotel, selectedRoom]);

  const handleSelect = () => {
    const room = selectedRoom || hotel?.rooms?.[0];
    const price = room?.price ?? hotel?.price;
    setBooking({ type: 'hotel', hotel: { ...hotel, room, price } });
    router.push(ROUTES.CHECKOUT);
  };

  const price = (selectedRoom?.price ?? hotel?.price) || 0;

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><div className="h-64 bg-gray-200 rounded-xl animate-pulse" /></div>;
  }
  if (!hotel) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><p className="text-gray-600">Hotel not found.</p></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{hotel.name}</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">📍 Location</h3>
          <HotelMap lat={hotel.lat} lng={hotel.lng} address={hotel.address} name={hotel.name} />
        </div>

        <div className="space-y-4 mb-6">
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
        </div>

        {hotel.rooms?.length ? (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Select room</h3>
            <div className="space-y-2">
              {hotel.rooms.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoom(r)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedRoom?.id === r.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{r.name}</span>
                      <span className="text-gray-500 text-sm ml-2">Up to {r.maxGuests} guests</span>
                    </div>
                    <span className="font-bold text-indigo-600">{format(r.price)}/night</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex justify-between text-lg mb-6">
          <span className="text-gray-600">Price per night</span>
          <span className="font-bold text-indigo-600">{format(price)}</span>
        </div>

        <button
          onClick={handleSelect}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
        >
          Proceed to Checkout {selectedRoom ? `(${selectedRoom.name})` : ''}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">You might also like</h2>
          <div className="space-y-3">
            {recommendations.map((r) => (
              <Link key={r.id} href={ROUTES.HOTEL_DETAIL(r.id)}>
                <HotelCard hotel={r} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
