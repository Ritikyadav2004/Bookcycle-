const Book = require("../models/book");
const User = require("../models/user");
const Order = require("../models/order");

const getRecommendations = async (userId, limit = 10) => {
  const user = await User.findById(userId).populate("wishlist").populate("browsingHistory");
  if (!user) return [];

  // 1) Compile purchase history to exclude already bought items and gather interests
  const orders = await Order.find({ buyer: userId, orderStatus: "Delivered" }).populate("items.book");
  
  const purchasedBookIds = [];
  const interestCategories = new Set();
  const interestGenres = new Set();
  const interestAuthors = new Set();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.book) {
        purchasedBookIds.push(item.book._id.toString());
        if (item.book.category) interestCategories.add(item.book.category.toString());
        if (item.book.genre) interestGenres.add(item.book.genre);
        if (item.book.author) interestAuthors.add(item.book.author);
      }
    });
  });

  // Extract from Wishlist
  const wishlistBookIds = [];
  user.wishlist.forEach((book) => {
    wishlistBookIds.push(book._id.toString());
    if (book.category) interestCategories.add(book.category.toString());
    if (book.genre) interestGenres.add(book.genre);
    if (book.author) interestAuthors.add(book.author);
  });

  // Extract from Browsing History
  const historyBookIds = [];
  user.browsingHistory.forEach((book) => {
    historyBookIds.push(book._id.toString());
    if (book.category) interestCategories.add(book.category.toString());
    if (book.genre) interestGenres.add(book.genre);
    if (book.author) interestAuthors.add(book.author);
  });

  // Combine exclusions: purchased books, current wishlist items, and seller's own listings
  const excludeIds = [...purchasedBookIds, ...wishlistBookIds];
  const queryExclusions = {
    _id: { $nin: excludeIds },
    seller: { $ne: userId },
    approvalStatus: "approved",
    availabilityStatus: "available",
  };

  let recommendedBooks = [];

  // 2) If user has active interests, search matches
  if (interestCategories.size > 0 || interestGenres.size > 0 || interestAuthors.size > 0) {
    const interestQuery = {
      ...queryExclusions,
      $or: [
        { category: { $in: Array.from(interestCategories) } },
        { genre: { $in: Array.from(interestGenres) } },
        { author: { $in: Array.from(interestAuthors) } },
      ],
    };

    recommendedBooks = await Book.find(interestQuery)
      .populate("category", "name slug")
      .populate("seller", "name shopName")
      .sort({ averageRating: -1, views: -1 })
      .limit(limit);
  }

  // 3) Fallback Engine: If matching list is small, pad with popular/new releases
  if (recommendedBooks.length < limit) {
    const existingIds = recommendedBooks.map((b) => b._id.toString());
    const fallbackExclusions = {
      ...queryExclusions,
      _id: { $nin: [...excludeIds, ...existingIds] },
    };

    const remainingLimit = limit - recommendedBooks.length;
    const fallbackBooks = await Book.find(fallbackExclusions)
      .populate("category", "name slug")
      .populate("seller", "name shopName")
      .sort({ views: -1, createdAt: -1 })
      .limit(remainingLimit);

    recommendedBooks.push(...fallbackBooks);
  }

  return recommendedBooks;
};

module.exports = {
  getRecommendations,
};
