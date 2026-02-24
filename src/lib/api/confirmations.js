import { apiClient } from './axios';

/**
 * Fetch recent confirmation log entries (from RabbitMQ consumer → Redis).
 * Used on booking confirmation page to show that the confirmation was queued/sent.
 */
export async function getConfirmationsLog(limit = 10) {
  const { data } = await apiClient.get('/api/confirmations/log', { params: { limit } });
  return data;
}
