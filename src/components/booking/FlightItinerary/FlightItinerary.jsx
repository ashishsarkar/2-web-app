'use client';

const BRAND = 'Book Flights';

function formatTime(iso) {
  if (!iso) return '--:--';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDate(iso) {
  if (!iso) return '--';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ' ');
}

function getCheckInClose(departureTime) {
  if (!departureTime) return '--:--';
  const d = new Date(departureTime);
  d.setMinutes(d.getMinutes() - 60);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function BarcodeIcon() {
  return (
    <svg viewBox="0 0 80 50" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {[2,5,8,10,13,16,18,21,24,27,29,32,35,37,40,43,46,48,51,54,56,59,62,65,67,70,73,75,78].map((x, i) => (
        <rect key={i} x={x} y="4" width={i % 3 === 0 ? 2 : 1} height={i % 5 === 0 ? 42 : 38} fill="#1e1b4b" />
      ))}
    </svg>
  );
}

export default function FlightItinerary({ bookingId, flight, passengerName = 'Guest', seat, bookingDate, paymentStatus = 'Approved' }) {
  const airline = flight?.airline || BRAND;
  const pnr = bookingId || '--';
  const status = 'CONFIRMED';
  const dateOfBooking = bookingDate
    ? formatDate(bookingDate) + ' ' + new Date(bookingDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' (UTC)'
    : '--';
  const aircraft = flight?.aircraft || 'A320';
  const prefix = (flight?.airline || '').includes('Air India') ? 'AI' : 'BK';
  const flightNum = flight?.id ? `${prefix} ${String(flight.id).replace(/\D/g, '').slice(0, 4) || '6251'}` : `${prefix} 6251`;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow border border-gray-200 overflow-hidden rounded-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-indigo-900 tracking-tight">{BRAND}</span>
          <span className="text-xs text-gray-400 font-normal">({airline})</span>
        </div>
        <span className="text-sm text-gray-600">PNR / Booking Ref.: <strong>{pnr}</strong></span>
      </div>

      {/* Booking Status */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
            <p className="font-bold text-gray-900">{status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Date of Booking*</p>
            <p className="font-bold text-gray-900">{dateOfBooking}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Status</p>
            <p className="font-bold text-gray-900">{paymentStatus}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          *Booking Date reflects in UTC (Universal Time Coordinated), all other timings mentioned are as per Local Time.
        </p>
      </div>

      {/* Passenger & Flight Status */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-100 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">{BRAND} Passenger - 1/1</span>
        <button type="button" className="px-4 py-2 bg-indigo-900 text-white text-sm font-semibold rounded hover:bg-indigo-800 transition-colors">
          Flight Status
        </button>
      </div>

      {/* Flight(s) section header */}
      <div className="px-6 py-3 bg-gray-100 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">{BRAND} Flight(s)</span>
      </div>

      {/* Passenger details with barcode */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-6">
        <div className="w-28 h-14 flex-shrink-0">
          <BarcodeIcon />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{passengerName}</p>
          {flight?.origin && flight?.destination && (
            <p className="text-xs text-gray-500 mt-0.5">{flight.origin} → {flight.destination}</p>
          )}
        </div>
      </div>

      {/* Flight schedule table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-gray-500 font-medium whitespace-nowrap">Date</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium whitespace-nowrap">From (Terminal)</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium whitespace-nowrap">Departs</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium whitespace-nowrap">Flight Number<br /><span className="font-normal">(Aircraft type)</span></th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium whitespace-nowrap">Check-in/Bag<br /><span className="font-normal">drop closes</span></th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium whitespace-nowrap">To (Terminal)</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium whitespace-nowrap">Arrives</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium whitespace-nowrap">Via</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 text-gray-900 whitespace-nowrap">{flight ? formatDate(flight.departureTime) : '--'}</td>
              <td className="px-6 py-4 text-gray-900">{flight?.originCity || flight?.origin || '--'}</td>
              <td className="px-6 py-4 text-gray-900 font-semibold">{formatTime(flight?.departureTime)}</td>
              <td className="px-6 py-4 text-gray-900">{flightNum}<br /><span className="text-gray-500">({aircraft})</span></td>
              <td className="px-6 py-4 text-gray-900">{getCheckInClose(flight?.departureTime)}</td>
              <td className="px-6 py-4 text-gray-900">{flight?.destinationCity ? `${flight.destinationCity} (T1)` : (flight?.destination || '--')}</td>
              <td className="px-6 py-4 text-gray-900 font-semibold">{formatTime(flight?.arrivalTime)}</td>
              <td className="px-6 py-4 text-gray-500">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Seats and Additional Services */}
      <div className="px-6 py-3 bg-gray-100 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Seats and Additional Services</span>
      </div>
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 mb-4 text-sm font-semibold text-gray-700">
          <span>{flight?.origin || '---'}</span>
          <span className="text-lg">→</span>
          <span className="text-indigo-900 font-bold">{flight?.destination || '---'}</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500 font-medium w-1/3"></th>
              <th className="text-left py-2 text-gray-500 font-medium">Passenger Name</th>
              <th className="text-left py-2 text-gray-500 font-medium">Seat</th>
              <th className="text-left py-2 text-gray-500 font-medium">Services Purchased</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 text-gray-400 text-xs">{flight?.origin} → {flight?.destination}</td>
              <td className="py-3 text-gray-900 font-medium">{passengerName}</td>
              <td className="py-3 text-gray-900 font-semibold">{seat || '—'}</td>
              <td className="py-3 text-gray-500">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 bg-indigo-50 border-t border-indigo-100">
        <p className="text-xs text-indigo-700">
          Please carry a valid photo ID for check-in. Web check-in opens 48 hours before departure.
        </p>
      </div>
    </div>
  );
}
