'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function BookingConfirmationPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-12">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your booking reference is <strong>{id}</strong></p>
        <p className="text-sm text-gray-500 mb-8">A confirmation has been sent to your email (mock).</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href={ROUTES.MY_BOOKINGS}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            View My Bookings
          </Link>
          <Link
            href={ROUTES.HOME}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"
          >
            Book Another
          </Link>
        </div>
      </div>
    </div>
  );
}
