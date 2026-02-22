import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set) => ({
      flights: [],
      hotels: [],
      addFlight: (flight) =>
        set((s) => ({
          flights: s.flights.some((f) => f.id === flight.id) ? s.flights : [...s.flights, flight],
        })),
      removeFlight: (id) => set((s) => ({ flights: s.flights.filter((f) => f.id !== id) })),
      addHotel: (hotel) =>
        set((s) => ({
          hotels: s.hotels.some((h) => h.id === hotel.id) ? s.hotels : [...s.hotels, hotel],
        })),
      removeHotel: (id) => set((s) => ({ hotels: s.hotels.filter((h) => h.id !== id) })),
      isFlightSaved: (id) => useWishlistStore.getState().flights.some((f) => f.id === id),
      isHotelSaved: (id) => useWishlistStore.getState().hotels.some((h) => h.id === id),
    }),
    { name: 'booking-wishlist' }
  )
);
