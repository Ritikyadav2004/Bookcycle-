const Book = require("../models/book");
const User = require("../models/user");
const AppError = require("../utils/appError");

const queryBooks = async (query) => {
  const {
    search,
    author,
    isbn,
    category,
    genre,
    condition,
    language,
    sellerLocation,
    minPrice,
    maxPrice,
    sortBy,
    page = 1,
    limit = 10,
  } = query;

  const mongoQuery = {
    approvalStatus: "approved",
    availabilityStatus: "available",
  };

  // Case-insensitive query matches
  if (search) {
    mongoQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }
  if (author) mongoQuery.author = { $regex: author, $options: "i" };
  if (isbn) mongoQuery.isbn = isbn;
  if (category) mongoQuery.category = category;
  if (genre) mongoQuery.genre = { $regex: genre, $options: "i" };
  if (condition) mongoQuery.condition = condition;
  if (language) mongoQuery.language = { $regex: language, $options: "i" };
  if (sellerLocation) mongoQuery.sellerLocation = { $regex: sellerLocation, $options: "i" };

  if (minPrice || maxPrice) {
    mongoQuery.sellingPrice = {};
    if (minPrice) mongoQuery.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) mongoQuery.sellingPrice.$lte = Number(maxPrice);
  }

  // Sorting
  let sort = { createdAt: -1 }; // newest fallback
  if (sortBy === "price_asc") sort = { sellingPrice: 1 };
  if (sortBy === "price_desc") sort = { sellingPrice: -1 };
  if (sortBy === "rating_desc") sort = { averageRating: -1 };

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Book.countDocuments(mongoQuery);
  const books = await Book.find(mongoQuery)
    .populate("category", "name slug")
    .populate("seller", "name shopName")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  return {
    books,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getBookDetails = async (bookId, userId = null) => {
  const book = await Book.findOne({ _id: bookId, approvalStatus: "approved" })
    .populate("category", "name slug")
    .populate("seller", "name shopName averageRating");
    
  if (!book) throw new AppError("Book not found or unapproved", 404);

  // Increment views
  book.views += 1;
  await book.save();

  // If user is authenticated, append to recently viewed (history stack of 10 items max)
  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      // Remove duplicate if exists
      user.browsingHistory = user.browsingHistory.filter((id) => id.toString() !== bookId);
      // Prepend to top
      user.browsingHistory.unshift(bookId);
      // Keep last 10
      if (user.browsingHistory.length > 10) {
        user.browsingHistory.pop();
      }
      await user.save();
    }
  }

  return book;
};

const toggleWishlist = async (userId, bookId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const bookExists = await Book.exists({ _id: bookId, approvalStatus: "approved" });
  if (!bookExists) throw new AppError("Active approved book not found", 404);

  const index = user.wishlist.indexOf(bookId);
  let added = false;
  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(bookId);
    added = true;
  }

  await user.save();
  return { wishlist: user.wishlist, added };
};

const getWishlist = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "wishlist",
    match: { approvalStatus: "approved", availabilityStatus: "available" },
    populate: { path: "seller", select: "name shopName" }
  });
  if (!user) throw new AppError("User not found", 404);
  return user.wishlist;
};

const getRecentlyViewed = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "browsingHistory",
    populate: { path: "seller", select: "name shopName" }
  });
  if (!user) throw new AppError("User not found", 404);
  return user.browsingHistory;
};

module.exports = {
  queryBooks,
  getBookDetails,
  toggleWishlist,
  getWishlist,
  getRecentlyViewed,
};
