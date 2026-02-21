import axios from 'axios';

const baseURL = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_API_BASE_URL || '';
const client = axios.create({ baseURL });

export async function searchHotels(params) {
  const { data } = await client.get('/api/hotels/search', { params });
  return data;
}

export async function getHotelById(id) {
  const { data } = await client.get(`/api/hotels/${id}`);
  return data;
}
