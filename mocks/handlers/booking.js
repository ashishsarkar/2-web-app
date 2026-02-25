import { http, HttpResponse } from 'msw';

export const bookingHandlers = [
  http.post('*/api/booking', () => {
    return HttpResponse.json({ id: 'b1', status: 'confirmed' });
  }),
  http.get('*/api/booking/:id', () => {
    return HttpResponse.json({ id: 'b1', status: 'confirmed' });
  }),
];
