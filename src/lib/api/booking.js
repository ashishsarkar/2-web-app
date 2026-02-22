import { apiClient } from './axios';

const client = apiClient;

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
