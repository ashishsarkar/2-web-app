import { http, HttpResponse } from 'msw';

export const chatHandlers = [
  http.post('*/api/chat', () => {
    return HttpResponse.json({ message: 'Mock chat response' });
  }),
];
