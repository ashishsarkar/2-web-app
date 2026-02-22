import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSavedSearchesStore = create(
  persist(
    (set) => ({
      searches: [],
      addSearch: (search) =>
        set((s) => {
          const exists = s.searches.some(
            (x) =>
              x.type === search.type &&
              (search.type === 'flight'
                ? x.origin === search.origin && x.destination === search.destination
                : x.location === search.location)
          );
          if (exists) return s;
          return {
            searches: [{ ...search, id: Date.now() }, ...s.searches].slice(0, 20),
          };
        }),
      removeSearch: (id) => set((s) => ({ searches: s.searches.filter((x) => x.id !== id) })),
    }),
    { name: 'booking-saved-searches' }
  )
);
