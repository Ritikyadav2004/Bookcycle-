const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");
const Category = require("../models/category");
const Notification = require("../models/notification");
const AppError = require("../utils/appError");

const getStats = async () => {
  const totalBuyers = await User.countDocuments({ role: "buyer" });
  const totalSellers = await User.countDocuments({ role: "seller" });
  const activeListings = await Book.countDocuments({ approvalStatus: "approved", availabilityStatus: "available" });
  const pendingReviews = await Book.countDocuments({ approvalStatus: "pending" });
  const totalOrders = await Order.countDocuments();

  const revenueAggregation = await Order.aggregate([
    { $match: { orderStatus: "Delivered" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

  return {
    totalBuyers,
    totalSellers,
    activeListings,
    pendingReviews,
    totalOrders,
    totalRevenue,
  };
};

const updateUserStatus = async (userId, accountStatus) => {
  if (!["active", "blocked", "suspended"].includes(accountStatus)) {
    throw new AppError("Invalid account status values", 400);
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  user.accountStatus = accountStatus;
  await user.save();

  return user;
};

const verifySeller = async (sellerId, status) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new AppError("Verification status must be approved or rejected", 400);
  }

  const seller = await User.findOne({ _id: sellerId, role: "seller" });
  if (!seller) throw new AppError("Seller not found", 404);

  seller.sellerVerificationStatus = status;
  await seller.save();

  // Notify seller of verification result
  await Notification.create({
    recipient: seller._id,
    title: `Verification Request ${status.toUpperCase()}`,
    message: `Your request for seller verification has been ${status} by the administrator.`,
    type: `SELLER_VERIFICATION_${status.toUpperCase()}`,
    relatedEntity: {
      entityId: seller._id,
      entityType: "User",
    },
  });

  return seller;
};

const reviewBookListing = async (bookId, status, rejectionReason = "") => {
  if (!["approved", "rejected"].includes(status)) {
    throw new AppError("Review status must be approved or rejected", 400);
  }

  const book = await Book.findById(bookId);
  if (!book) throw new AppError("Book listing not found", 404);

  book.approvalStatus = status;
  book.rejectionReason = status === "rejected" ? rejectionReason : "";
  await book.save();

  // Notify seller of book approval/rejection
  await Notification.create({
    recipient: book.seller,
    title: `Listing ${status.toUpperCase()}: ${book.title}`,
    message: status === "approved"
      ? `Your listing "${book.title}" has been approved and is now publicly searchable.`
      : `Your listing "${book.title}" was rejected. Reason: ${rejectionReason}`,
    type: `LISTING_${status.toUpperCase()}`,
    relatedEntity: {
      entityId: book._id,
      entityType: "Book",
    },
  });

  return book;
};

// Category CRUD
const createCategory = async ({ name, description, image }) => {
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

  const existing = await Category.findOne({ name });
  if (existing) throw new AppError("Category name already exists", 400);

  return Category.create({ name, slug, description, image });
};

const updateCategory = async (categoryId, data) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new AppError("Category not found", 404);

  const allowedFields = ["name", "description", "image", "status"];
  let nameChanged = false;

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      if (field === "name" && data.name !== category.name) {
        nameChanged = true;
      }
      category[field] = data[field];
    }
  });

  if (nameChanged) {
    const baseSlug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    category.slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  await category.save();
  return category;
};

const deleteCategory = async (categoryId) => {
  const result = await Category.deleteOne({ _id: categoryId });
  if (result.deletedCount === 0) throw new AppError("Category not found", 404);
};

const getBuyers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await User.countDocuments({ role: "buyer" });
  const buyers = await User.find({ role: "buyer" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { buyers, total, page, limit, pages: Math.ceil(total / limit) };
};

const getSellers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await User.countDocuments({ role: "seller" });
  const sellers = await User.find({ role: "seller" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { sellers, total, page, limit, pages: Math.ceil(total / limit) };
};

const getPendingVerifications = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await User.countDocuments({ role: "seller", sellerVerificationStatus: "pending" });
  const sellers = await User.find({ role: "seller", sellerVerificationStatus: "pending" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { sellers, total, page, limit, pages: Math.ceil(total / limit) };
};

const getListings = async (page = 1, limit = 10, approvalStatus = null) => {
  const skip = (page - 1) * limit;
  const query = {};
  if (approvalStatus) query.approvalStatus = approvalStatus;
  const total = await Book.countDocuments(query);
  const listings = await Book.find(query).populate("seller", "name shopName").sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { listings, total, page, limit, pages: Math.ceil(total / limit) };
};

const getOrders = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await Order.countDocuments();
  const orders = await Order.find().populate("buyer", "name email").populate("seller", "name shopName").sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { orders, total, page, limit, pages: Math.ceil(total / limit) };
};

const getTransactions = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await Transaction.countDocuments();
  const transactions = await Transaction.find().populate("buyer", "name email").populate("seller", "name shopName").sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { transactions, total, page, limit, pages: Math.ceil(total / limit) };
};

const getReviews = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await Review.countDocuments();
  const reviews = await Review.find().populate("buyer", "name").populate("book", "title").sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { reviews, total, page, limit, pages: Math.ceil(total / limit) };
};

const getReports = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await Report.countDocuments();
  const reports = await Report.find().populate("reportedBy", "name").populate("book", "title").sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { reports, total, page, limit, pages: Math.ceil(total / limit) };
};

let mockSettings = {
  platformFee: 10,
  deliveryChargePerSeller: 40,
  allowNewRegistrations: true,
};

const getSettings = async () => {
  return mockSettings;
};

const updateSettings = async (data) => {
  mockSettings = { ...mockSettings, ...data };
  return mockSettings;
};

module.exports = {
  getStats,
  updateUserStatus,
  verifySeller,
  reviewBookListing,
  createCategory,
  updateCategory,
  deleteCategory,
  getBuyers,
  getSellers,
  getPendingVerifications,
  getListings,
  getOrders,
  getTransactions,
  getReviews,
  getReports,
  getSettings,
  updateSettings,
};
