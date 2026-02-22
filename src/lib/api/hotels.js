import { apiClient } from './axios';

const client = apiClient;

export async function searchHotels(params) {
  const { data } = await client.get('/api/hotels/search', { params });
  return data;
}

export async function getHotelById(id) {
  const { data } = await client.get(`/api/hotels/${id}`);
  return data;
}
