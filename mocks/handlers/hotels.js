import { http, HttpResponse } from 'msw';

export const hotelHandlers = [
  http.get('*/api/hotels/search', () => {
    return HttpResponse.json({ hotels: [] });
  }),
  http.get('*/api/hotels/:id', () => {
    return HttpResponse.json({ id: '1', name: 'Hotel', location: 'Mumbai' });
  }),
];
