import { apiClient } from './axios';

const client = apiClient;

export async function sendChatMessage(message) {
  const { data } = await client.post('/api/chat', { message });
  return data;
}
