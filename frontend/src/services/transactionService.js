import { createResourceService } from './mockServiceFactory';

const transactionService = createResourceService('transaction', [
  { id: 'TXN-9001', amount: 642, status: 'completed', method: 'cod' },
  { id: 'TXN-9002', amount: 389, status: 'completed', method: 'upi' },
  { id: 'TXN-9003', amount: 510, status: 'pending', method: 'card' },
]);

export default transactionService;
