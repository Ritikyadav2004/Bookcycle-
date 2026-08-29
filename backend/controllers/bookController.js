const bookService = require("../services/bookService");
const { sendSuccess } = require("../utils/response");

const browseBooks = async (req, res, next) => {
  try {
    const { books, pagination } = await bookService.queryBooks(req.query);
    return sendSuccess(res, "Books retrieved successfully from marketplace", books, 200, pagination);
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;
    const book = await bookService.getBookDetails(id, userId);
    return sendSuccess(res, "Book details retrieved successfully", { book });
  } catch (error) {
    next(error);
  }
};

const wishlistToggle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { wishlist, added } = await bookService.toggleWishlist(req.user._id, id);
    const message = added ? "Book added to wishlist" : "Book removed from wishlist";
    return sendSuccess(res, message, { wishlist });
  } catch (error) {
    next(error);
  }
};

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await bookService.getWishlist(req.user._id);
    return sendSuccess(res, "User wishlist retrieved successfully", { wishlist });
  } catch (error) {
    next(error);
  }
};

const getRecent = async (req, res, next) => {
  try {
    const recent = await bookService.getRecentlyViewed(req.user._id);
    return sendSuccess(res, "Recently viewed books retrieved successfully", { recent });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  browseBooks,
  getBook,
  wishlistToggle,
  getWishlist,
  getRecent,
};
