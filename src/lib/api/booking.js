import axios from 'axios';

const baseURL = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_API_BASE_URL || '';
const client = axios.create({ baseURL });

export async function createBooking(payload) {
  const { data } = await client.post('/api/booking', payload);
  return data;
}

export async function getBookingById(id) {
  const { data } = await client.get(`/api/booking/${id}`);
  return data;
}

export async function cancelBooking(id) {
  const { data } = await client.patch(`/api/booking/${id}`, { status: 'cancelled' });
  return data;
}
