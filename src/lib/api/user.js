import axios from 'axios';

const baseURL = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_API_BASE_URL || '';
const client = axios.create({ baseURL });

export async function getProfile() {
  const { data } = await client.get('/api/user/profile');
  return data;
}

export async function getMyBookings() {
  const { data } = await client.get('/api/user/bookings');
  return data;
}
