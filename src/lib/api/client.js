const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const apiBase = typeof window !== 'undefined' ? '/api' : baseURL || '/api';

export function getApiBase() {
  return apiBase;
}
