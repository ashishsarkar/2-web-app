import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export const metadata = {
  title: 'Destinations | Flight & Hotel Booking',
  description: 'Explore popular destinations for flights and hotels across India.',
};

const DEST = [
  { name: 'Mumbai', code: 'BOM', desc: 'Financial capital' },
  { name: 'New Delhi', code: 'DEL', desc: 'Capital city' },
  { name: 'Goa', code: 'GOI', desc: 'Beaches & heritage' },
  { name: 'Bengaluru', code: 'BLR', desc: 'Tech hub' },
  { name: 'Chennai', code: 'MAA', desc: 'Culture & temples' },
  { name: 'Kolkata', code: 'CCU', desc: 'City of Joy' },
];

export default function DestinationsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
      <p className="text-gray-600 mb-8">Popular destinations for flights and hotels</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEST.map((d) => (
          <Link
            key={d.code}
            href={`${ROUTES.FLIGHT_SEARCH}?destination=${d.code}`}
            className="block p-6 bg-white rounded-xl shadow border border-gray-100 hover:shadow-lg transition"
          >
            <span className="text-4xl mb-3 block">✈</span>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{d.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{d.desc}</p>
            <span className="text-indigo-600 font-medium">View flights</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
