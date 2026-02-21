import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  flightSearch: null,
  hotelSearch: null,
  setFlightSearch: (params) => set({ flightSearch: params }),
  setHotelSearch: (params) => set({ hotelSearch: params }),
  clearSearch: () => set({ flightSearch: null, hotelSearch: null }),
}));
