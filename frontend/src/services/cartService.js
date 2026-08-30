import { createResourceService } from './mockServiceFactory';
import { mockBooks } from '../data/mockBooks';

const cartService = createResourceService('cart', mockBooks.slice(0, 3));

export default cartService;
