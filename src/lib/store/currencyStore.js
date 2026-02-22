import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const RATES = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 };
const SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

export const useCurrencyStore = create(
  persist(
    (set) => ({
      currency: 'INR',
      setCurrency: (currency) => set({ currency }),
      convert: (amountInr) => {
        const { currency } = useCurrencyStore.getState();
        return Math.round(amountInr * (RATES[currency] || 1));
      },
      format: (amountInr) => {
        const { currency } = useCurrencyStore.getState();
        const amount = Math.round(amountInr * (RATES[currency] || 1));
        const sym = SYMBOLS[currency] || '₹';
        return `${sym}${amount.toLocaleString()}`;
      },
    }),
    { name: 'booking-currency' }
  )
);
