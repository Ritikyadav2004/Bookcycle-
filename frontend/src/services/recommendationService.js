import { getRecommendedBooks } from '../data/mockBooks';
import { delay } from '../utils/helpers';

const recommendationService = {
  list: async () => {
    await delay(250);
    return getRecommendedBooks();
  },
};

export default recommendationService;
