import { http, HttpResponse } from 'msw';

export const flightHandlers = [
  http.get('*/api/flights/search', () => {
    return HttpResponse.json({ flights: [] });
  }),
  http.get('*/api/flights/:id', () => {
    return HttpResponse.json({ id: '1', origin: 'DEL', destination: 'BOM' });
  }),
];
