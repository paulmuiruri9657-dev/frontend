import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface RecentlyViewedStore {
    recentlyViewed: Product[];
    addRecentlyViewed: (product: Product) => void;
    clearRecentlyViewed: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
    persist(
        (set) => ({
            recentlyViewed: [],
            addRecentlyViewed: (product) => set((state) => {
                // Remove the product if it already exists so we can move it to the front
                const filtered = state.recentlyViewed.filter(p => p._id !== product._id);
                // Store the latest 12 items securely in browser local storage
                return { recentlyViewed: [product, ...filtered].slice(0, 12) };
            }),
            clearRecentlyViewed: () => set({ recentlyViewed: [] })
        }),
        {
            name: 'recently-viewed-storage',
        }
    )
);
