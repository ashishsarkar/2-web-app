import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export const metadata = {
  title: 'Deals | Flight & Hotel Booking',
  description: 'Hot deals on flights and hotels. Save up to 25% on bookings.',
};

const DEALS = [
  { id: 1, title: 'Mumbai–Goa', subtitle: 'Flights from ₹3,200', discount: '15% off', type: 'flight', link: `${ROUTES.FLIGHT_SEARCH}?origin=BOM&destination=GOI` },
  { id: 2, title: 'Delhi–Bengaluru', subtitle: 'Flights from ₹4,500', discount: '10% off', type: 'flight', link: `${ROUTES.FLIGHT_SEARCH}?origin=DEL&destination=BLR` },
  { id: 3, title: 'Goa Hotels', subtitle: 'Beach stays from ₹8,000', discount: '20% off', type: 'hotel', link: `${ROUTES.HOTEL_SEARCH}?location=Goa` },
  { id: 4, title: 'Mumbai Hotels', subtitle: 'City stays from ₹7,500', discount: '25% off', type: 'hotel', link: `${ROUTES.HOTEL_SEARCH}?location=Mumbai` },
  { id: 5, title: 'Flight + Hotel Bundle', subtitle: 'Combined savings', discount: 'Extra 5%', type: 'bundle', link: ROUTES.BUNDLE_SEARCH },
];

export default function DealsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hot Deals</h1>
      <p className="text-gray-600 mb-8">Limited-time offers on flights and hotels</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEALS.map((d) => (
          <Link
            key={d.id}
            href={d.link}
            className="block p-6 bg-white rounded-xl shadow border border-gray-100 hover:shadow-lg transition relative overflow-hidden"
          >
            <span className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
              {d.discount}
            </span>
            <span className="text-3xl mb-3 block">{d.type === 'flight' ? '✈' : d.type === 'hotel' ? '🏨' : '🎫'}</span>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{d.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{d.subtitle}</p>
            <span className="text-indigo-600 font-medium">View deal →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
