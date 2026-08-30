import { createResourceService } from './mockServiceFactory';
import { mockBooks } from '../data/mockBooks';

const wishlistService = createResourceService('wishlist', mockBooks.slice(4, 10));

export default wishlistService;
