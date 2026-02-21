import { create } from 'zustand';

export const useCheckoutStore = create((set) => ({
  booking: null,
  setBooking: (data) => set({ booking: data }),
  clearCheckout: () => set({ booking: null }),
}));
