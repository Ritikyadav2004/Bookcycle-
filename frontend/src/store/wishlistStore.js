// Wishlist store using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Toggle wishlist
      toggleItem: (book) => {
        const items = get().items;
        const exists = items.find(item => item.id === book.id);

        if (exists) {
          set({ items: items.filter(item => item.id !== book.id) });
          toast.success('Removed from wishlist');
        } else {
          set({ items: [...items, book] });
          toast.success('Added to wishlist!', { icon: '❤️' });
        }
      },

      // Remove item
      removeItem: (bookId) => {
        set({ items: get().items.filter(item => item.id !== bookId) });
        toast.success('Removed from wishlist');
      },

      // Check if item in wishlist
      isInWishlist: (bookId) => {
        return get().items.some(item => item.id === bookId);
      },

      // Get count
      getCount: () => get().items.length,

      // Clear wishlist
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'bookcycle-wishlist',
    }
  )
);

export default useWishlistStore;
