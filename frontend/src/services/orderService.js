import api from './api';

export const orderService = {
  list: async () => {
    try {
      const res = await api.get('/orders');
      // The response structure is: data: { orders: [...] }
      return res.orders || res.data?.orders || [];
    } catch (e) {
      console.warn("Backend orders list fetch failed, using fallback:", e);
      return [];
    }
  },
  get: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.order || res.data?.order || res;
  },
  create: async (payload) => {
    return api.post('/orders/checkout', payload);
  }
};

export default orderService;
