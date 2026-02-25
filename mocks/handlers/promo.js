import { http, HttpResponse } from 'msw';

export const promoHandlers = [
  http.post('*/api/promo/validate', () => {
    return HttpResponse.json({ valid: true, savings: 500, code: 'FLAT500' });
  }),
];
