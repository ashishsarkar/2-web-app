import { apiClient } from './axios';

/**
 * Search locations (cities, airports, states, countries) via Elasticsearch.
 * @param {string} q - Search query
 * @param {{ type?: string, size?: number }} [options]
 * @returns {Promise<{ query: string, total: number, results: Array }>}
 */
export async function searchLocations(q, { type, size = 8 } = {}) {
  const params = { q, size };
  if (type) params.type = type;
  const { data } = await apiClient.get('/api/locations/search', { params });
  return data;
}
