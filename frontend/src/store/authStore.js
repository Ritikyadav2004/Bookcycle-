// Auth store using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null, // 'buyer', 'seller', 'admin'
      isLoading: false,

      // Login action
      login: (userData, role, token) => {
        const finalToken = token || userData?.token || (typeof userData === 'object' ? userData.token : null);
        const finalRole = role || userData?.role || (typeof userData === 'object' ? userData.role : null) || 'buyer';
        set({
          user: userData,
          token: finalToken,
          isAuthenticated: Boolean(finalToken && !finalToken.startsWith('mock-token-')),
          role: finalRole,
        });
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: null,
        });
      },

      // Update profile
      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      // Set loading
      setLoading: (loading) => set({ isLoading: loading }),

      // Check role
      isBuyer: () => get().role === 'buyer',
      isSeller: () => get().role === 'seller',
      isAdmin: () => get().role === 'admin',
    }),
    {
      name: 'bookcycle-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
);

export default useAuthStore;
