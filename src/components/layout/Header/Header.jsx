'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/lib/store/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">✈ Book</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href={ROUTES.FLIGHT_SEARCH} className="text-gray-600 hover:text-indigo-600 font-medium">
              Flights
            </Link>
            <Link href={ROUTES.HOTEL_SEARCH} className="text-gray-600 hover:text-indigo-600 font-medium">
              Hotels
            </Link>
            <Link href={ROUTES.MY_BOOKINGS} className="text-gray-600 hover:text-indigo-600 font-medium">
              My Bookings
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href={ROUTES.PROFILE} className="text-gray-600 hover:text-indigo-600 font-medium">
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN} className="text-gray-600 hover:text-indigo-600 font-medium">
                  Login
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
