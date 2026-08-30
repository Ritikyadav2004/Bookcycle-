import { delay, paginate } from '../utils/helpers';
import { mockBooks } from '../data/mockBooks';

export const mockOrders = [
  { id: 'ORD-2401', status: 'shipped', total: 642, buyer: 'Aarav Mehta', seller: 'Priya Patel', city: 'Delhi' },
  { id: 'ORD-2402', status: 'delivered', total: 389, buyer: 'Nisha Rao', seller: 'Amit Kumar', city: 'Pune' },
  { id: 'ORD-2403', status: 'pending', total: 510, buyer: 'Kabir Khan', seller: 'Sneha Gupta', city: 'Mumbai' },
];

export const mockUsers = [
  { id: 'USR-101', name: 'Aarav Mehta', role: 'buyer', status: 'active', city: 'Delhi' },
  { id: 'USR-102', name: 'Priya Patel', role: 'seller', status: 'verified', city: 'Mumbai' },
  { id: 'USR-103', name: 'Amit Kumar', role: 'seller', status: 'pending', city: 'Bengaluru' },
];

export const createResourceService = (resourceName, seedData = []) => ({
  list: async (params = {}) => {
    await delay(250);
    const { page = 1, limit = 12 } = params;
    return paginate(seedData, page, limit);
  },
  get: async (id) => {
    await delay(200);
    const record = seedData.find((item) => item.id === id);
    if (!record) throw new Error(`${resourceName} not found`);
    return record;
  },
  create: async (payload) => {
    await delay(300);
    return { id: `${resourceName.toUpperCase()}-${Date.now()}`, ...payload };
  },
  update: async (id, payload) => {
    await delay(300);
    return { id, ...payload };
  },
  remove: async (id) => {
    await delay(250);
    return { id, success: true };
  },
});

export const marketplaceSummary = {
  books: mockBooks.length,
  orders: mockOrders.length,
  users: mockUsers.length,
  revenue: 42860,
};
