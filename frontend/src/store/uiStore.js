// UI store using Zustand
import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Mobile menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Sidebar
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  collapseSidebar: () => set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  // Mobile filter drawer
  isFilterDrawerOpen: false,
  toggleFilterDrawer: () => set(state => ({ isFilterDrawerOpen: !state.isFilterDrawerOpen })),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),

  // Page loader
  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),

  // Modals
  activeModal: null,
  modalData: null,
  openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Quick view
  quickViewBook: null,
  openQuickView: (book) => set({ quickViewBook: book }),
  closeQuickView: () => set({ quickViewBook: null }),

  // Search
  isSearchOpen: false,
  toggleSearch: () => set(state => ({ isSearchOpen: !state.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false }),

  // Notifications
  isNotificationsOpen: false,
  toggleNotifications: () => set(state => ({ isNotificationsOpen: !state.isNotificationsOpen })),
  closeNotifications: () => set({ isNotificationsOpen: false }),

  // View mode (grid/list)
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Theme (future use)
  theme: 'light',
  toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));

export default useUIStore;
