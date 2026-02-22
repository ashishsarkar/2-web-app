import { apiClient } from './axios';

const client = apiClient;

export async function getProfile() {
  const { data } = await client.get('/api/user/profile');
  return data;
}

export async function getMyBookings() {
  const { data } = await client.get('/api/user/bookings');
  return data;
}
