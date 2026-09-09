const mongoose = require("mongoose");
const User = require("../models/user");
const Book = require("../models/book");
const Category = require("../models/category");
const Order = require("../models/order");
const Notification = require("../models/notification");
const AppError = require("../utils/appError");
const cloudinaryService = require("./cloudinaryService");

// Helper to notify admins about new listings
const notifyAdminsOfNewListing = async (book) => {
  try {
    const admins = await User.find({ role: "admin" });
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      title: "New Book Listing Submitted",
      message: `A new book listing "${book.title}" was submitted by seller ${book.seller}. Review is pending.`,
      type: "LISTING_SUBMITTED",
      relatedEntity: {
        entityId: book._id,
        entityType: "Book",
      },
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error("Failed to notify admins of new listing:", err.message);
  }
};

const getSellerProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("Seller not found", 404);
  return user;
};

const updateSellerProfile = async (userId, data) => {
  const allowedFields = ["name", "profileImage", "shopName", "address", "city", "state", "postalCode", "payoutDetails"];
  const updateData = {};
  
  Object.keys(data).forEach((key) => {
    if (allowedFields.includes(key)) {
      updateData[key] = data[key];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  return user;
};

const submitVerification = async (userId, verificationData) => {
  const { shopName, mobile, payoutDetails } = verificationData;

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  user.shopName = shopName || user.shopName;
  user.mobile = mobile || user.mobile;
  user.payoutDetails = payoutDetails || user.payoutDetails;
  user.sellerVerificationStatus = "pending";

  await user.save();

  // Notify admins of verification request
  try {
    const admins = await User.find({ role: "admin" });
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      title: "Seller Verification Request",
      message: `Seller "${user.name}" has submitted verification details for approval.`,
      type: "SELLER_VERIFICATION_SUBMITTED",
      relatedEntity: {
        entityId: user._id,
        entityType: "User",
      },
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error("Admin verification notification failed:", err.message);
  }

  return user;
};

const createListing = async (userId, bookData, imageUrls) => {
  const {
    title,
    author,
    isbn,
    category,
    genre,
    publisher,
    edition,
    publicationYear,
    language,
    description,
    condition,
    defects,
    originalPrice,
    sellingPrice,
    quantity,
    sellerLocation,
    deliveryMethods,
  } = bookData;

  // Generate unique slug
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const slug = `${baseSlug}-${randomSuffix}`;

  // Resolve category if slug or name passed instead of ObjectId
  let categoryId = category;
  if (!mongoose.Types.ObjectId.isValid(category)) {
    const foundCategory = await Category.findOne({
      $or: [
        { slug: category?.toString().toLowerCase() },
        { name: new RegExp(`^${category}$`, "i") }
      ]
    });
    if (foundCategory) {
      categoryId = foundCategory._id;
    } else {
      const defaultCategory = await Category.findOne({});
      if (defaultCategory) categoryId = defaultCategory._id;
    }
  }

  // Normalize condition
  const conditionMap = {
    "new": "New",
    "like-new": "Like New",
    "like new": "Like New",
    "very-good": "Very Good",
    "very good": "Very Good",
    "good": "Good",
    "fair": "Acceptable",
    "acceptable": "Acceptable",
  };
  const normalizedCondition = conditionMap[condition?.toString().toLowerCase()] || condition || "Good";

  // Enforce pending listing status on creation
  const book = await Book.create({
    title,
    slug,
    author,
    isbn,
    category: categoryId,
    genre,
    publisher,
    edition,
    publicationYear,
    language,
    description,
    condition: normalizedCondition,
    defects,
    originalPrice,
    sellingPrice,
    quantity: quantity || 1,
    images: imageUrls || [],
    seller: userId,
    sellerLocation,
    deliveryMethods,
    approvalStatus: "pending",
    availabilityStatus: (quantity && quantity > 0) ? "available" : "out_of_stock",
  });

  await notifyAdminsOfNewListing(book);

  return book;
};

const updateListing = async (userId, bookId, bookData, newImageUrls = [], deleteImageUrls = []) => {
  const book = await Book.findOne({ _id: bookId, seller: userId });
  if (!book) {
    throw new AppError("Book listing not found or you are not the owner", 404);
  }

  // Handle image deletions
  if (deleteImageUrls && deleteImageUrls.length > 0) {
    for (const url of deleteImageUrls) {
      const publicId = cloudinaryService.getPublicIdFromUrl(url);
      if (publicId) {
        try {
          await cloudinaryService.deleteImage(publicId);
        } catch (err) {
          console.error(`Failed to delete image ${publicId} from Cloudinary:`, err.message);
        }
      }
      book.images = book.images.filter((img) => img !== url);
    }
  }

  // Handle new images
  if (newImageUrls && newImageUrls.length > 0) {
    book.images.push(...newImageUrls);
  }

  // Update text/numeric fields
  const updatableFields = [
    "title", "author", "isbn", "category", "genre", "publisher", "edition", 
    "publicationYear", "language", "description", "condition", "defects", 
    "originalPrice", "sellingPrice", "quantity", "sellerLocation", "deliveryMethods"
  ];

  let titleChanged = false;
  updatableFields.forEach((field) => {
    if (bookData[field] !== undefined) {
      if (field === "title" && bookData.title !== book.title) {
        titleChanged = true;
      }
      book[field] = bookData[field];
    }
  });

  // Re-generate slug if title changed
  if (titleChanged) {
    const baseSlug = book.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    book.slug = `${baseSlug}-${randomSuffix}`;
  }

  // Re-evaluate stock availability status
  if (book.quantity > 0) {
    book.availabilityStatus = "available";
  } else {
    book.availabilityStatus = "out_of_stock";
  }

  // Reset status to pending on edit for verification
  book.approvalStatus = "pending";
  book.rejectionReason = "";

  await book.save();

  // Notify admins of listing update
  await notifyAdminsOfNewListing(book);

  return book;
};

const deleteListing = async (userId, bookId) => {
  const book = await Book.findOne({ _id: bookId, seller: userId });
  if (!book) {
    throw new AppError("Book listing not found or you are not the owner", 404);
  }

  // Delete all hosted images on Cloudinary
  if (book.images && book.images.length > 0) {
    for (const url of book.images) {
      const publicId = cloudinaryService.getPublicIdFromUrl(url);
      if (publicId) {
        try {
          await cloudinaryService.deleteImage(publicId);
        } catch (err) {
          console.error(`Failed to delete image ${publicId} on Cloudinary:`, err.message);
        }
      }
    }
  }

  await Book.deleteOne({ _id: bookId });
};

const resubmitListing = async (userId, bookId) => {
  const book = await Book.findOne({ _id: bookId, seller: userId });
  if (!book) {
    throw new AppError("Book listing not found or you are not the owner", 404);
  }

  if (book.approvalStatus !== "rejected") {
    throw new AppError("Only rejected listings can be resubmitted directly", 400);
  }

  book.approvalStatus = "pending";
  book.rejectionReason = "";
  await book.save();

  await notifyAdminsOfNewListing(book);

  return book;
};

const getOwnListings = async (userId) => {
  return Book.find({ seller: userId }).sort({ createdAt: -1 });
};

const getReceivedOrders = async (sellerId) => {
  return Order.find({ seller: sellerId })
    .populate("items.book")
    .populate("buyer", "name email mobile")
    .sort({ createdAt: -1 });
};

const getReceivedOrderDetails = async (sellerId, orderId) => {
  const order = await Order.findOne({ _id: orderId, seller: sellerId })
    .populate("items.book")
    .populate("buyer", "name email mobile");
  if (!order) throw new AppError("Order not found or not owned by you", 404);
  return order;
};

const confirmReceivedOrder = async (sellerId, orderId, note = "") => {
  const order = await Order.findOne({ _id: orderId, seller: sellerId });
  if (!order) throw new AppError("Order not found", 404);

  if (order.orderStatus !== "Placed") {
    throw new AppError("Order can only be confirmed if status is Placed", 400);
  }

  order.orderStatus = "Confirmed";
  order.statusHistory.push({
    status: "Confirmed",
    note: note || "Order confirmed by seller",
  });
  await order.save();

  // Notify buyer
  await Notification.create({
    recipient: order.buyer,
    title: "Order Confirmed",
    message: `Your order ${order.orderNumber} has been confirmed by the seller.`,
    type: "ORDER_CONFIRMED",
    relatedEntity: { entityId: order._id, entityType: "Order" },
  });

  return order;
};

const packReceivedOrder = async (sellerId, orderId, note = "") => {
  const order = await Order.findOne({ _id: orderId, seller: sellerId });
  if (!order) throw new AppError("Order not found", 404);

  if (order.orderStatus !== "Confirmed") {
    throw new AppError("Order must be Confirmed before packing", 400);
  }

  order.orderStatus = "Packed";
  order.statusHistory.push({
    status: "Packed",
    note: note || "Order packed by seller",
  });
  await order.save();

  // Notify buyer
  await Notification.create({
    recipient: order.buyer,
    title: "Order Packed",
    message: `Your order ${order.orderNumber} has been packed.`,
    type: "ORDER_PACKED",
    relatedEntity: { entityId: order._id, entityType: "Order" },
  });

  return order;
};

const shipReceivedOrder = async (sellerId, orderId, { courierName, trackingNumber, note = "" }) => {
  if (!courierName || !trackingNumber) {
    throw new AppError("Courier name and tracking number are required to ship order", 400);
  }

  const order = await Order.findOne({ _id: orderId, seller: sellerId });
  if (!order) throw new AppError("Order not found", 404);

  if (order.orderStatus !== "Packed") {
    throw new AppError("Order must be Packed before shipping", 400);
  }

  order.orderStatus = "Shipped";
  order.courierName = courierName;
  order.trackingNumber = trackingNumber;
  order.statusHistory.push({
    status: "Shipped",
    note: note || `Shipped via ${courierName}. Tracking: ${trackingNumber}`,
  });
  await order.save();

  // Notify buyer
  await Notification.create({
    recipient: order.buyer,
    title: "Order Shipped",
    message: `Your order ${order.orderNumber} has been shipped via ${courierName}. Tracking ID: ${trackingNumber}.`,
    type: "ORDER_SHIPPED",
    relatedEntity: { entityId: order._id, entityType: "Order" },
  });

  return order;
};

const getSellerAnalytics = async (sellerId) => {
  const totalReceived = await Order.countDocuments({ seller: sellerId });
  const completedOrders = await Order.find({ seller: sellerId, orderStatus: "Delivered" });
  
  const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalSales = completedOrders.reduce((acc, order) => {
    return acc + order.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  // Group by category counts
  const categorySales = await Order.aggregate([
    { $match: { seller: new mongoose.Types.ObjectId(sellerId), orderStatus: "Delivered" } },
    { $unwind: "$items" },
    { $lookup: { from: "books", localField: "items.book", foreignField: "_id", as: "bookDetails" } },
    { $unwind: "$bookDetails" },
    { $group: { _id: "$bookDetails.category", count: { $sum: "$items.quantity" } } },
    { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "categoryDetails" } },
    { $unwind: "$categoryDetails" },
    { $project: { categoryName: "$categoryDetails.name", count: 1 } }
  ]);

  return {
    totalReceived,
    totalSales,
    totalRevenue,
    categorySales,
  };
};

module.exports = {
  getSellerProfile,
  updateSellerProfile,
  submitVerification,
  createListing,
  updateListing,
  deleteListing,
  resubmitListing,
  getOwnListings,
  getReceivedOrders,
  getReceivedOrderDetails,
  confirmReceivedOrder,
  packReceivedOrder,
  shipReceivedOrder,
  getSellerAnalytics,
};
