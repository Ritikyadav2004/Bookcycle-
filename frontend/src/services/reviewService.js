import { createResourceService } from './mockServiceFactory';

const reviewService = createResourceService('review', [
  { id: 'REV-1', rating: 5, comment: 'Accurate condition and quick delivery.' },
  { id: 'REV-2', rating: 4, comment: 'Good pricing and helpful seller.' },
]);

export default reviewService;
