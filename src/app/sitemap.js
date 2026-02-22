import { ROUTES } from '@/lib/constants/routes';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default function sitemap() {
  const staticRoutes = [
    ROUTES.HOME,
    ROUTES.FLIGHT_SEARCH,
    ROUTES.HOTEL_SEARCH,
    ROUTES.BUNDLE_SEARCH,
    ROUTES.MY_BOOKINGS,
    ROUTES.PROFILE,
    ROUTES.WISHLIST,
    ROUTES.PRICE_ALERTS,
    ROUTES.SAVED_SEARCHES,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.PARTNER_DEMO,
    ROUTES.HELP_CENTRE,
    ROUTES.CONTACT_US,
    ROUTES.PRIVACY_POLICY,
    ROUTES.TERMS_OF_SERVICE,
    ROUTES.DESTINATIONS,
    ROUTES.DEALS,
  ];

  const flights = ['f1', 'f2', 'f3', 'f4', 'f5'];
  const hotels = ['h1', 'h2', 'h3', 'h4', 'h5'];

  return [
    ...staticRoutes.map((path) => ({ url: `${BASE}${path}`, lastModified: new Date(), changeFrequency: 'weekly', priority: path === '/' ? 1 : 0.8 })),
    ...flights.map((id) => ({ url: `${BASE}/flights/${id}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 })),
    ...hotels.map((id) => ({ url: `${BASE}/hotels/${id}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 })),
  ];
}
