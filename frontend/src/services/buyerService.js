import { createResourceService, mockOrders } from './mockServiceFactory';
import { getRecommendedBooks } from '../data/mockBooks';
import { delay } from '../utils/helpers';

const buyerService = {
  ...createResourceService('buyer', mockOrders),
  dashboard: async () => {
    await delay(250);
    return {
      cartCount: 3,
      wishlistCount: 8,
      activeOrders: 2,
      completedOrders: 14,
      totalSpent: 6840,
      recommendations: getRecommendedBooks(),
      recentPurchases: mockOrders,
    };
  },
};

export default buyerService;
