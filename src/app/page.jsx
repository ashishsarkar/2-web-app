import Link from 'next/link';
import SearchWidget from '@/components/shared/SearchWidget/SearchWidget';
import { ROUTES } from '@/lib/constants/routes';

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col">
      <section className="bg-gradient-to-b from-indigo-600 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Flights & Hotels
          </h1>
          <p className="text-xl text-indigo-100 mb-8">
            Find the best deals on flights and hotels. Search, compare, and book in minutes.
          </p>
          <SearchWidget />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Mumbai', code: 'BOM', type: 'flight' },
              { name: 'New Delhi', code: 'DEL', type: 'flight' },
              { name: 'Goa', code: 'GOI', type: 'flight' },
            ].map((d) => (
              <Link
                key={d.code}
                href={`${ROUTES.FLIGHT_SEARCH}?destination=${d.code}`}
                className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100"
              >
                <span className="text-3xl mb-2 block">✈</span>
                <h3 className="font-semibold text-gray-900">{d.name}</h3>
                <p className="text-sm text-gray-500">Flights from ₹2,800</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
