'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getBookingById } from '@/lib/api/booking';
import { ROUTES } from '@/lib/constants/routes';
import { useCurrencyStore } from '@/lib/store/currencyStore';

export default function BookingConfirmationPage() {
  const params = useParams();
  const id = params.id;
  const [booking, setBooking] = useState(null);
  const format = useCurrencyStore((s) => s.format);

  useEffect(() => {
    getBookingById(id).then(setBooking).catch(() => {});
  }, [id]);

  const downloadItinerary = () => {
    const item = booking?.item || booking?.flight || booking?.hotel;
    const lines = [
      `Booking: ${id}`,
      `Status: ${booking?.status || 'confirmed'}`,
      '',
      '--- Itinerary ---',
      item?.flight
        ? `Flight: ${item.flight.airline} ${item.flight.origin} → ${item.flight.destination} • ${format(item.flight.price)}`
        : item?.airline
          ? `Flight: ${item.airline} ${item.origin} → ${item.destination} • ${format(item.price)}`
          : '',
      item?.hotel
        ? `Hotel: ${item.hotel.name} - ${item.hotel.location} • ${format(item.hotel.price ?? item.hotel.rooms?.[0]?.price)}`
        : item?.name
          ? `Hotel: ${item.name} - ${item.location} • ${format(item.price)}`
          : '',
      '',
      `Total: ${format(booking?.total || item?.price || 0)}`,
    ].filter(Boolean);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `itinerary-${id}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadInvoice = () => {
    const item = booking?.item || booking?.flight || booking?.hotel;
    const lines = [
      `Invoice - Booking ${id}`,
      `Status: ${booking?.status || 'confirmed'}`,
      item?.flight ? `Flight: ${item.flight?.airline || item?.airline}` : '',
      item?.hotel ? `Hotel: ${item.hotel?.name || item?.name}` : '',
      `Amount: ${format(booking?.total || item?.price || 0)}`,
    ].filter(Boolean);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `invoice-${id}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-12">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your booking reference is <strong>{id}</strong></p>
        <p className="text-sm text-gray-500 mb-6">A confirmation has been sent to your email (mock).</p>
        <div className="flex gap-3 justify-center flex-wrap mb-8">
          <button
            onClick={downloadItinerary}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
          >
            Download Itinerary
          </button>
          <button
            onClick={downloadInvoice}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
          >
            Download Invoice
          </button>
        </div>
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
