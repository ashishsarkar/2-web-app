/**
 * In-memory store for mock data (bookings, wallet).
 * Persists only for the lifetime of the server process.
 */
export const mockBookingsStore = new Map();
export const mockWalletStore = new Map();
