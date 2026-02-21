import { http, HttpResponse } from 'msw';

export const userHandlers = [
  http.get('*/user/profile', () => {
    return HttpResponse.json({ id: '1', email: 'test@test.com', name: 'Test User' });
  }),
  http.get('*/user/bookings', () => {
    return HttpResponse.json({ bookings: [] });
  }),
];
