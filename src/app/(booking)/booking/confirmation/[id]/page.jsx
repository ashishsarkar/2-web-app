'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getBookingById } from '@/lib/api/booking';
import { getConfirmationsLog } from '@/lib/api/confirmations';
import { ROUTES } from '@/lib/constants/routes';
import { useCurrencyStore } from '@/lib/store/currencyStore';
import { useAuthStore } from '@/lib/store/authStore';
import { generateInvoicePDF, generateItineraryPDF } from '@/lib/utils/pdf';
import FlightItinerary from '@/components/booking/FlightItinerary';

function buildPdfItem(booking) {
  if (!booking) return null;
  if (booking.item) return booking.item;
  if (booking.type === 'bundle' && (booking.flight || booking.hotel)) {
    return { flight: booking.flight, hotel: booking.hotel };
  }
  if (booking.flight) return { flight: booking.flight };
  if (booking.hotel) return { hotel: booking.hotel };
  return null;
}

function getItemTotal(item) {
  if (!item) return 0;
  if (item.flight && item.hotel) {
    return (item.flight.price ?? 0) + (item.hotel.price ?? item.hotel.rooms?.[0]?.price ?? 0);
  }
  return item.price ?? item.flight?.price ?? item.hotel?.price ?? item.hotel?.rooms?.[0]?.price ?? 0;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const id = params.id;
  const [booking, setBooking] = useState(null);
  const [confirmationsLog, setConfirmationsLog] = useState([]);
  const format = useCurrencyStore((s) => s.format);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    getBookingById(id)
      .then((data) => setBooking(data))
      .catch(() => setBooking(null));
  }, [id]);

  useEffect(() => {
    getConfirmationsLog(10)
      .then((res) => setConfirmationsLog(res?.confirmations || []))
      .catch(() => setConfirmationsLog([]));
  }, [id]);

  const downloadItinerary = async () => {
    const item = buildPdfItem(booking);
    const total = booking?.total ?? getItemTotal(item);
    const flightForPdf = booking?.flight ?? item?.flight ?? (item?.airline ? item : null);
    const ok = await generateItineraryPDF({
      id,
      status: booking?.status || 'confirmed',
      item,
      total,
      format,
      passengerName: user?.name || 'Guest',
      seat: flightForPdf?.seat || booking?.seat,
      bookingDate: booking?.createdAt,
      paymentStatus: 'Approved',
    });
    if (ok !== false) return;
    const f = item?.flight || (item?.airline ? item : null);
    const h = item?.hotel || (item?.name ? item : null);
    const tot = booking?.total ?? f?.price ?? h?.price ?? h?.rooms?.[0]?.price ?? 0;
    const lines = [
      `Booking: ${id}`,
      `Status: ${booking?.status || 'confirmed'}`,
      '',
      '--- Itinerary ---',
      f ? `Flight: ${f.airline} ${f.origin} → ${f.destination} • ${format(f.price ?? tot)}` : '',
      h ? `Hotel: ${h.name} - ${h.location} • ${format(h.price ?? h.rooms?.[0]?.price ?? 0)}` : '',
      '',
      `Total: ${format(tot)}`,
    ].filter(Boolean);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `itinerary-${id}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadInvoice = async () => {
    const item = buildPdfItem(booking);
    const ok = await generateInvoicePDF({
      id,
      status: booking?.status || 'confirmed',
      item,
      total: booking?.total ?? getItemTotal(item),
      format,
      passengerName: user?.name || 'Guest',
    });
    if (ok !== false) return;
    const lines = [
      `Invoice - Booking ${id}`,
      `Status: ${booking?.status || 'confirmed'}`,
      item?.flight ? `Flight: ${item.flight?.airline || item?.airline}` : '',
      item?.hotel ? `Hotel: ${item.hotel?.name || item?.name}` : '',
      `Amount: ${format(booking?.total ?? getItemTotal(item))}`,
    ].filter(Boolean);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `invoice-${id}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const item = buildPdfItem(booking);
  const flight = booking?.flight ?? item?.flight ?? (item?.airline ? item : null);
  const hotel = booking?.hotel ?? item?.hotel ?? (item?.name && item?.location ? item : null);
  const isFlight = !!flight;
  const isHotel = !!hotel;
  const hasItinerary = isFlight || isHotel;

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">✅</div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
        <p className="text-gray-600 mt-1">Your booking reference is <strong>{id}</strong></p>
      </div>
      {hasItinerary ? (
        <div className="mb-8 space-y-6">
          {isFlight && (
            <FlightItinerary
              bookingId={id}
              flight={flight}
              passengerName={user?.name || 'Guest'}
              seat={flight?.seat}
              bookingDate={booking?.createdAt}
              paymentStatus="Approved"
            />
          )}
          {isHotel && (
            <div className="bg-white shadow border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Hotel Details</h3>
              </div>
              <div className="px-6 py-4 space-y-2">
                <p className="font-medium text-gray-900">{hotel.name}</p>
                <p className="text-gray-600">{hotel.location}</p>
                {hotel.room?.name && (
                  <p className="text-sm text-gray-500">Room: {hotel.room.name}</p>
                )}
                {format && (
                  <p className="text-indigo-600 font-medium mt-2">
                    {format(hotel.price ?? hotel.rooms?.[0]?.price ?? 0)} total
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-12 text-center mb-8">
          <p className="text-gray-500">Itinerary details will appear here once your booking is loaded. You can download the itinerary PDF below.</p>
        </div>
      )}

      {confirmationsLog.length > 0 && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <h3 className="font-semibold text-emerald-800 mb-2">Confirmation pipeline</h3>
          <p className="text-sm text-emerald-700 mb-2">
            Your booking was published to Kafka and queued for confirmation. Recent confirmations processed:
          </p>
          <ul className="text-sm space-y-1 max-h-24 overflow-y-auto">
            {confirmationsLog.slice(0, 5).map((c, i) => (
              <li key={i} className={c.booking_id === id ? 'font-medium text-emerald-900' : 'text-emerald-700'}>
                {c.booking_id} — {c.type} — {c.created_at ? new Date(c.created_at).toLocaleString() : ''}
                {c.booking_id === id && ' (this booking)'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3 justify-center flex-wrap mb-6">
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
  );
}
