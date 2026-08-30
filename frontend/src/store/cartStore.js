// Cart store using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { addToCart } from '../services/apiService';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],

      // Add item to cart
      addItem: async (book, quantity = 1) => {
        try {
          await addToCart({ bookId: book.id || book._id, quantity });
        } catch (e) {
          console.warn("Backend add to cart failed, proceeding with local cart:", e);
        }

        const items = get().items;
        const existing = items.find(item => item.id === book.id);

        if (existing) {
          set({
            items: items.map(item =>
              item.id === book.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
          toast.success('Updated quantity in cart');
        } else {
          set({ items: [...items, { ...book, quantity }] });
          toast.success('Added to cart!');
        }
      },

      // Remove item
      removeItem: (bookId) => {
        set({ items: get().items.filter(item => item.id !== bookId) });
        toast.success('Removed from cart');
      },

      // Update quantity
      updateQuantity: (bookId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(item =>
            item.id === bookId ? { ...item, quantity } : item
          ),
        });
      },

      // Save for later
      saveForLater: (bookId) => {
        const item = get().items.find(item => item.id === bookId);
        if (item) {
          set({
            items: get().items.filter(i => i.id !== bookId),
            savedItems: [...get().savedItems, item],
          });
          toast.success('Saved for later');
        }
      },

      // Move to cart from saved
      moveToCart: (bookId) => {
        const item = get().savedItems.find(item => item.id === bookId);
        if (item) {
          set({
            savedItems: get().savedItems.filter(i => i.id !== bookId),
            items: [...get().items, item],
          });
          toast.success('Moved to cart');
        }
      },

      // Clear cart
      clearCart: () => set({ items: [] }),

      // Get cart count
      getCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

      // Get subtotal
      getSubtotal: () => get().items.reduce(
        (total, item) => total + (item.sellingPrice * item.quantity), 0
      ),

      // Get delivery charge
      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 499 ? 0 : 49;
      },

      // Get platform fee
      getPlatformFee: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.02); // 2% platform fee
      },

      // Get estimated tax
      getTax: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.18);
      },

      // Get total
      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryCharge() + get().getPlatformFee() + get().getTax();
      },
    }),
    {
      name: 'bookcycle-cart',
    }
  )
);

export default useCartStore;
