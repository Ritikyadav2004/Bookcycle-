import api from './api';

const adminService = {
  // Get all book listings for moderation (optionally filtered by pending, approved, rejected)
  getListings: async ({ page = 1, limit = 50, status } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);

    const res = await api.get(`/admin/books?${params.toString()}`);
    return res.data || [];
  },

  // Review (Approve or Reject) a book listing
  reviewListing: async (bookId, status, rejectionReason = '') => {
    const res = await api.post(`/admin/books/${bookId}/review`, {
      status, // 'approved' or 'rejected'
      rejectionReason,
    });
    return res.data;
  },

  // Get Admin dashboard statistics
  dashboard: async () => {
    try {
      const res = await api.get('/admin/stats');
      return res.data?.stats || res.data;
    } catch {
      return {
        totalUsers: 0,
        totalBuyers: 0,
        totalSellers: 0,
        pendingSellerVerifications: 0,
        totalBooks: 0,
        pendingBookApprovals: 0,
        approvedBooks: 0,
        totalOrders: 0,
        totalSalesVolume: 0,
      };
    }
  },

  // Get users
  getBuyers: async () => {
    const res = await api.get('/admin/buyers');
    return res.data || [];
  },

  getSellers: async () => {
    const res = await api.get('/admin/sellers');
    return res.data || [];
  },

  // Verify a seller
  verifySeller: async (sellerId, status) => {
    const res = await api.post(`/admin/sellers/${sellerId}/verify`, { status });
    return res.data;
  },
};

export default adminService;
