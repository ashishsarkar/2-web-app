import { http, HttpResponse } from 'msw';

export const bookingHandlers = [
  http.post('*/booking', () => {
    return HttpResponse.json({ id: 'b1', status: 'confirmed' });
  }),
  http.get('*/booking/:id', () => {
    return HttpResponse.json({ id: 'b1', status: 'confirmed' });
  }),
];
