import api from './api';

const sellerService = {
  // Get seller's own listings with approval statuses (pending, approved, rejected)
  getBooks: async () => {
    const res = await api.get('/seller/books');
    return res.data?.books || res.data || [];
  },

  // Create a new listing with multipart form data (images + book fields)
  createListing: async (formData) => {
    const res = await api.post('/seller/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Update an existing listing
  updateListing: async (bookId, formData) => {
    const res = await api.put(`/seller/books/${bookId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Delete a listing
  deleteListing: async (bookId) => {
    const res = await api.delete(`/seller/books/${bookId}`);
    return res.data;
  },

  // Resubmit a rejected listing
  resubmitListing: async (bookId) => {
    const res = await api.post(`/seller/books/${bookId}/resubmit`);
    return res.data;
  },

  // Seller dashboard analytics
  dashboard: async () => {
    try {
      const res = await api.get('/seller/analytics');
      return res.data?.analytics || res.data;
    } catch {
      return {
        totalBooks: 0,
        pendingListings: 0,
        approvedListings: 0,
        rejectedListings: 0,
        soldBooks: 0,
        ordersReceived: 0,
        totalRevenue: 0,
      };
    }
  },

  // Seller received orders
  getOrders: async () => {
    const res = await api.get('/seller/orders');
    return res.data?.orders || res.data || [];
  },
};

export default sellerService;
