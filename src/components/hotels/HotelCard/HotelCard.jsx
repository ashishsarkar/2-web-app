'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCurrencyStore } from '@/lib/store/currencyStore';
import { ROUTES } from '@/lib/constants/routes';

export default function HotelCard({ hotel }) {
  const { addHotel, removeHotel, hotels } = useWishlistStore();
  const format = useCurrencyStore((s) => s.format);
  const saved = hotels?.some((h) => h.id === hotel?.id);

  if (!hotel) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md flex justify-between items-center gap-4">
      <Link href={ROUTES.HOTEL_DETAIL(hotel.id)} className="flex-1">
        <div className="font-medium text-gray-900">{hotel.name}</div>
        <div className="text-sm text-gray-600">{hotel.location} • ★ {hotel.rating}</div>
        <div className="font-semibold text-indigo-600 mt-1">{format(hotel.price)}/night</div>
      </Link>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); saved ? removeHotel(hotel.id) : addHotel(hotel); }}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        {saved ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
