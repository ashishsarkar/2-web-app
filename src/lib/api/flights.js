import { apiClient } from './axios';

const client = apiClient;

export async function searchFlights(params) {
  const { data } = await client.get('/api/flights/search', { params });
  return data;
}

export async function getFlightById(id) {
  const { data } = await client.get(`/api/flights/${id}`);
  return data;
}
