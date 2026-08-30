import { createResourceService, mockOrders } from './mockServiceFactory';
import { getBooksBySeller } from '../data/mockBooks';
import { delay } from '../utils/helpers';

const sellerService = {
  ...createResourceService('seller', mockOrders),
  dashboard: async (sellerId = 's1') => {
    await delay(250);
    return {
      totalBooks: getBooksBySeller(sellerId).length,
      pendingListings: 6,
      approvedListings: 28,
      rejectedListings: 2,
      soldBooks: 86,
      ordersReceived: mockOrders.length,
      totalRevenue: 42860,
    };
  },
};

export default sellerService;
