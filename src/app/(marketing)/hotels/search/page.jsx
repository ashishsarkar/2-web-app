'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchHotels } from '@/lib/api/hotels';
import { ROUTES } from '@/lib/constants/routes';

function HotelSearchContent() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const location = searchParams.get('location') || '';
    searchHotels({ location })
      .then((res) => setHotels(res.hotels || []))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hotel Search Results</h1>
      {hotels.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-600">No hotels found. Try a different location.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hotels.map((h) => (
            <Link
              key={h.id}
              href={ROUTES.HOTEL_DETAIL(h.id)}
              className="block bg-white rounded-xl p-6 shadow border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{h.name}</h3>
                  <p className="text-gray-600">{h.location} • {h.address}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">★ {h.rating}</span>
                    {h.amenities?.slice(0, 3).map((a) => (
                      <span key={a} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{a}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-indigo-600">₹{h.price?.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">per night</p>
                  <span className="inline-block mt-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                    Select
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HotelSearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12"><div className="h-32 bg-gray-200 rounded-xl animate-pulse" /></div>}>
      <HotelSearchContent />
    </Suspense>
  );
}
