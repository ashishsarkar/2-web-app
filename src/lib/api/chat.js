import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
});

export async function sendChatMessage(message) {
  const { data } = await client.post('/api/chat', { message });
  return data;
}
