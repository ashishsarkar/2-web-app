import { http, HttpResponse } from 'msw';

export const hotelHandlers = [
  http.get('*/hotels/search', () => {
    return HttpResponse.json({ hotels: [] });
  }),
  http.get('*/hotels/:id', () => {
    return HttpResponse.json({ id: '1', name: 'Hotel', location: 'Mumbai' });
  }),
];
