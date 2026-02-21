import axios from 'axios';

const baseURL = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_API_BASE_URL || '';
const client = axios.create({ baseURL });

export async function searchFlights(params) {
  const { data } = await client.get('/api/flights/search', { params });
  return data;
}

export async function getFlightById(id) {
  const { data } = await client.get(`/api/flights/${id}`);
  return data;
}
