import { ROUTES } from './routes';

describe('ROUTES', () => {
  it('has static routes', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.FLIGHT_SEARCH).toBe('/flights/search');
    expect(ROUTES.HOTEL_SEARCH).toBe('/hotels/search');
    expect(ROUTES.CHECKOUT).toBe('/checkout');
    expect(ROUTES.MY_BOOKINGS).toBe('/my-bookings');
    expect(ROUTES.LOGIN).toBe('/auth/login');
    expect(ROUTES.REGISTER).toBe('/auth/register');
    expect(ROUTES.PRIVACY_POLICY).toBe('/privacy');
    expect(ROUTES.TERMS_OF_SERVICE).toBe('/terms');
  });

  it('FLIGHT_DETAIL returns path with id', () => {
    expect(ROUTES.FLIGHT_DETAIL('f123')).toBe('/flights/f123');
  });

  it('HOTEL_DETAIL returns path with id', () => {
    expect(ROUTES.HOTEL_DETAIL('h456')).toBe('/hotels/h456');
  });

  it('BOOKING_CONFIRMATION returns path with id', () => {
    expect(ROUTES.BOOKING_CONFIRMATION('BK123')).toBe('/booking/confirmation/BK123');
  });
});
