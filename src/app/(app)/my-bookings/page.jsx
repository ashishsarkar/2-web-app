'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyBookings } from '@/lib/api/user';
import { ROUTES } from '@/lib/constants/routes';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-600 mb-4">You have no bookings yet.</p>
          <Link href={ROUTES.HOME} className="text-indigo-600 font-medium">
            Search flights or hotels
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Link
              key={b.id}
              href={ROUTES.BOOKING_CONFIRMATION(b.id)}
              className="block bg-white rounded-xl p-6 shadow border border-gray-100 hover:shadow-md"
            >
              <div className="flex justify-between">
                <span className="font-semibold">{b.id}</span>
                <span className="text-indigo-600">{b.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
