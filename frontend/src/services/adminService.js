import { createResourceService, marketplaceSummary, mockOrders, mockUsers } from './mockServiceFactory';
import { mockBooks } from '../data/mockBooks';
import { delay } from '../utils/helpers';

const adminService = {
  users: createResourceService('user', mockUsers),
  listings: createResourceService('listing', mockBooks),
  orders: createResourceService('order', mockOrders),
  dashboard: async () => {
    await delay(250);
    return {
      ...marketplaceSummary,
      pendingApprovals: 12,
      completedOrders: 246,
      reports: 13,
    };
  },
};

export default adminService;
