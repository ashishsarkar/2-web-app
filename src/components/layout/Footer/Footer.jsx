import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Book</h3>
            <p className="text-sm text-gray-600">Your trusted flight and hotel booking platform.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link href={ROUTES.FLIGHT_SEARCH} className="text-gray-600 hover:text-indigo-600">Flights</Link></li>
              <li><Link href={ROUTES.HOTEL_SEARCH} className="text-gray-600 hover:text-indigo-600">Hotels</Link></li>
              <li><Link href={ROUTES.MY_BOOKINGS} className="text-gray-600 hover:text-indigo-600">My Bookings</Link></li>
              <li><Link href={ROUTES.PARTNER_DEMO} className="text-gray-600 hover:text-indigo-600">Partner Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href={ROUTES.HELP_CENTRE} className="text-gray-600 hover:text-indigo-600">Help Centre</Link></li>
              <li><Link href={ROUTES.CONTACT_US} className="text-gray-600 hover:text-indigo-600">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href={ROUTES.PRIVACY_POLICY} className="text-gray-600 hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link href={ROUTES.TERMS_OF_SERVICE} className="text-gray-600 hover:text-indigo-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Book. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
