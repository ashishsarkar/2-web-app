import { http, HttpResponse } from 'msw';

export const flightHandlers = [
  http.get('*/flights/search', () => {
    return HttpResponse.json({ flights: [] });
  }),
  http.get('*/flights/:id', () => {
    return HttpResponse.json({ id: '1', origin: 'DEL', destination: 'BOM' });
  }),
];
