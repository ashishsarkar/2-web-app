'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyBookings } from '@/lib/api/user';
import { cancelBooking } from '@/lib/api/booking';
import { ROUTES } from '@/lib/constants/routes';
import { useCurrencyStore } from '@/lib/store/currencyStore';
import { useAuthStore } from '@/lib/store/authStore';
import { generateInvoicePDF, generateItineraryPDF } from '@/lib/utils/pdf';

const CHECKIN_BASE = 'https://checkin.example.com';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const format = useCurrencyStore((s) => s.format);
  const user = useAuthStore((s) => s.user);

  const loadBookings = () => {
    getMyBookings()
      .then((res) => setBookings(res.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      const res = await cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled', refundStatus: res.refundStatus } : b)));
    } catch {
      alert('Could not cancel.');
    } finally {
      setCancelling(null);
    }
  };

  const getItem = (b) => b.item || (b.type === 'bundle' && (b.flight || b.hotel) ? { flight: b.flight, hotel: b.hotel } : null) || (b.flight ? { flight: b.flight } : null) || (b.hotel ? { hotel: b.hotel } : null);
  const getTotal = (b) => {
    if (b.total != null) return b.total;
    const item = getItem(b);
    if (!item) return 0;
    if (item.flight && item.hotel) return (item.flight.price ?? 0) + (item.hotel.price ?? item.hotel.rooms?.[0]?.price ?? 0);
    return item.price ?? item.flight?.price ?? item.hotel?.price ?? item.hotel?.rooms?.[0]?.price ?? 0;
  };

  const downloadInvoice = async (b) => {
    const item = getItem(b);
    const ok = await generateInvoicePDF({
      id: b.id,
      status: b.status,
      item,
      total: getTotal(b),
      format,
      passengerName: user?.name || 'Guest',
    });
    if (ok !== false) return;
    const lines = [
      `Booking: ${b.id}`,
      `Status: ${b.status}`,
      item?.airline ? `Flight: ${item.airline} ${item.origin} → ${item.destination}` : '',
      item?.name ? `Hotel: ${item.name} - ${item.location}` : '',
      `Amount: ${format(getTotal(b))}`,
    ].filter(Boolean);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `invoice-${b.id}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

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
          {bookings.map((b) => {
            const item = b.item || b.flight || b.hotel;
            const isFlight = !!item?.airline || !!(typeof item === 'object' && item?.flight);
            const canCheckIn = isFlight && b.status === 'confirmed';

            return (
              <div
                key={b.id}
                className={`bg-white rounded-xl p-6 shadow border ${
                  b.status === 'cancelled' ? 'border-gray-200 opacity-60' : 'border-gray-100'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <span className="font-semibold">{b.id}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-sm ${
                      b.status === 'cancelled' ? 'bg-gray-200 text-gray-600' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {b.status}
                    </span>
                    {b.status === 'cancelled' && b.refundStatus && (
                      <span className="ml-2 px-2 py-0.5 rounded text-sm bg-amber-100 text-amber-800">
                        Refund {b.refundStatus}
                      </span>
                    )}
                    {item && (
                      <p className="text-gray-600 mt-1">
                        {item.flight && item.hotel
                          ? `Bundle: ${item.flight.airline} + ${item.hotel.name}`
                          : isFlight
                            ? `${item.airline} • ${item.origin} → ${item.destination}`
                            : `${item.name} • ${item.location}`}
                      </p>
                    )}
                    {item?.price != null && (
                      <p className="text-indigo-600 font-medium mt-1">{format(b.total ?? item.price)}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {canCheckIn && (
                      <a
                        href={`${CHECKIN_BASE}/${b.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Check-in
                      </a>
                    )}
                    {b.status !== 'cancelled' && (
                      <>
                        <button
                          type="button"
                          onClick={async () => {
                            const item = getItem(b);
                            const ok = await generateItineraryPDF({ id: b.id, status: b.status, item, total: getTotal(b), format });
                            if (ok !== false) return;
                            const f = item?.flight || (item?.airline ? item : null);
                            const h = item?.hotel || (item?.name ? item : null);
                            const lines = [`Booking: ${b.id}`, `Status: ${b.status}`, f ? `Flight: ${f.airline} ${f.origin} → ${f.destination}` : '', h ? `Hotel: ${h.name} - ${h.location}` : '', `Total: ${format(getTotal(b))}`].filter(Boolean);
                            const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = `itinerary-${b.id}.txt`;
                            a.click();
                            URL.revokeObjectURL(a.href);
                          }}
                          className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Download itinerary
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadInvoice(b)}
                          className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Download invoice
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel(b.id)}
                          disabled={!!cancelling}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                        >
                          {cancelling === b.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </>
                    )}
                    <Link
                      href={ROUTES.BOOKING_CONFIRMATION(b.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
