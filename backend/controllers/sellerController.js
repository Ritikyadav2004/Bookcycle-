const sellerService = require("../services/sellerService");
const cloudinaryService = require("../services/cloudinaryService");
const { sendSuccess } = require("../utils/response");
const AppError = require("../utils/appError");

// Helper to handle multiple image uploads to Cloudinary
const uploadFiles = async (files) => {
  const urls = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await cloudinaryService.uploadImage(file.buffer);
      urls.push(uploadResult.secure_url);
    }
  }
  return urls;
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await sellerService.getSellerProfile(req.user._id);
    return sendSuccess(res, "Seller profile retrieved successfully", { profile });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    // Check if an image file is uploaded for profile picture
    let profileImageUrl = undefined;
    if (req.file) {
      const uploadResult = await cloudinaryService.uploadImage(req.file.buffer, "seller_profiles");
      profileImageUrl = uploadResult.secure_url;
    }

    const updateData = { ...req.body };
    if (profileImageUrl) {
      updateData.profileImage = profileImageUrl;
    }

    const profile = await sellerService.updateSellerProfile(req.user._id, updateData);
    return sendSuccess(res, "Profile updated successfully", { profile });
  } catch (error) {
    next(error);
  }
};

const submitVerificationDetails = async (req, res, next) => {
  try {
    const { shopName, mobile, payoutDetails } = req.body;
    
    // Parse payoutDetails if it's sent as a stringified JSON
    let parsedPayoutDetails = payoutDetails;
    if (typeof payoutDetails === "string") {
      try {
        parsedPayoutDetails = JSON.parse(payoutDetails);
      } catch (err) {
        parsedPayoutDetails = payoutDetails;
      }
    }

    const profile = await sellerService.submitVerification(req.user._id, {
      shopName,
      mobile,
      payoutDetails: parsedPayoutDetails,
    });

    return sendSuccess(res, "Seller verification details submitted successfully", { profile });
  } catch (error) {
    next(error);
  }
};

const getMyListings = async (req, res, next) => {
  try {
    const listings = await sellerService.getOwnListings(req.user._id);
    return sendSuccess(res, "Listings retrieved successfully", { listings });
  } catch (error) {
    next(error);
  }
};

const createBookListing = async (req, res, next) => {
  try {
    // Process uploaded images
    const uploadedImages = req.files ? await uploadFiles(req.files) : [];
    
    const book = await sellerService.createListing(req.user._id, req.body, uploadedImages);
    return sendSuccess(res, "Book listing created successfully and is pending admin review", { book }, 201);
  } catch (error) {
    next(error);
  }
};

const updateBookListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deleteImages } = req.body;
    
    let deleteImageUrls = [];
    if (deleteImages) {
      deleteImageUrls = Array.isArray(deleteImages) ? deleteImages : [deleteImages];
    }

    const newImageUrls = req.files ? await uploadFiles(req.files) : [];

    const book = await sellerService.updateListing(
      req.user._id,
      id,
      req.body,
      newImageUrls,
      deleteImageUrls
    );

    return sendSuccess(res, "Book listing updated successfully and is pending admin re-review", { book });
  } catch (error) {
    next(error);
  }
};

const deleteBookListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await sellerService.deleteListing(req.user._id, id);
    return sendSuccess(res, "Book listing deleted successfully");
  } catch (error) {
    next(error);
  }
};

const resubmitBookListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await sellerService.resubmitListing(req.user._id, id);
    return sendSuccess(res, "Book listing resubmitted successfully for admin review", { book });
  } catch (error) {
    next(error);
  }
};

const getReceivedOrders = async (req, res, next) => {
  try {
    const orders = await sellerService.getReceivedOrders(req.user._id);
    return sendSuccess(res, "Received orders retrieved successfully", { orders });
  } catch (error) {
    next(error);
  }
};

const getReceivedOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await sellerService.getReceivedOrderDetails(req.user._id, id);
    return sendSuccess(res, "Order details retrieved successfully", { order });
  } catch (error) {
    next(error);
  }
};

const confirmOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body || {};
    const order = await sellerService.confirmReceivedOrder(req.user._id, id, note);
    return sendSuccess(res, "Order confirmed successfully", { order });
  } catch (error) {
    next(error);
  }
};

const packOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body || {};
    const order = await sellerService.packReceivedOrder(req.user._id, id, note);
    return sendSuccess(res, "Order packed successfully", { order });
  } catch (error) {
    next(error);
  }
};

const shipOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { courierName, trackingNumber, note } = req.body || {};
    const order = await sellerService.shipReceivedOrder(req.user._id, id, {
      courierName,
      trackingNumber,
      note,
    });
    return sendSuccess(res, "Order shipped successfully", { order });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await sellerService.getSellerAnalytics(req.user._id);
    return sendSuccess(res, "Seller analytics retrieved successfully", { analytics });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  submitVerificationDetails,
  getMyListings,
  createBookListing,
  updateBookListing,
  deleteBookListing,
  resubmitBookListing,
  getReceivedOrders,
  getReceivedOrderDetails,
  confirmOrder,
  packOrder,
  shipOrder,
  getAnalytics,
};
