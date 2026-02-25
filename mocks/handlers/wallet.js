import { http, HttpResponse } from 'msw';

export const walletHandlers = [
  http.get('*/api/wallet', () => {
    return HttpResponse.json({ balance: 500 });
  }),
  http.post('*/api/wallet', () => {
    return HttpResponse.json({ balance: 500 });
  }),
];
