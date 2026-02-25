import { http, HttpResponse } from 'msw';

export const confirmationHandlers = [
  http.get('*/api/confirmations/log', ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const confirmations = [
      { booking_id: 'BK123', status: 'confirmed', type: 'flight', total: 3500, created_at: '2025-02-20T10:00:00Z' },
      { booking_id: 'BK456', status: 'confirmed', type: 'hotel', total: 8000, created_at: '2025-02-20T09:00:00Z' },
    ].slice(0, limit);
    return HttpResponse.json({ confirmations });
  }),
];
