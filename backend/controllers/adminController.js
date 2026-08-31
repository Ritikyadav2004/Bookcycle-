const adminService = require("../services/adminService");
const { sendSuccess } = require("../utils/response");

const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getStats();
    return sendSuccess(res, "Dashboard stats retrieved successfully", { stats });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {}; // active, blocked, suspended
    const user = await adminService.updateUserStatus(id, status);
    return sendSuccess(res, `User status updated to ${status} successfully`, { user });
  } catch (error) {
    next(error);
  }
};

const verifySeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {}; // approved, rejected
    const seller = await adminService.verifySeller(id, status);
    return sendSuccess(res, `Seller verification request resolved: ${status}`, { seller });
  } catch (error) {
    next(error);
  }
};

const reviewBookListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body || {}; // approved, rejected
    const book = await adminService.reviewBookListing(id, status, rejectionReason);
    return sendSuccess(res, `Book listing review completed: ${status}`, { book });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await adminService.createCategory(req.body);
    return sendSuccess(res, "Category created successfully", { category }, 201);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await adminService.updateCategory(id, req.body);
    return sendSuccess(res, "Category updated successfully", { category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteCategory(id);
    return sendSuccess(res, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};

const getBuyers = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await adminService.getBuyers(page, limit);
    return sendSuccess(res, "Buyers retrieved successfully", result.buyers, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    });
  } catch (error) {
    next(error);
  }
};

const getSellers = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await adminService.getSellers(page, limit);
    return sendSuccess(res, "Sellers retrieved successfully", result.sellers, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    });
  } catch (error) {
    next(error);
  }
};

const getPendingVerifications = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await adminService.getPendingVerifications(page, limit);
    return sendSuccess(res, "Pending verifications retrieved successfully", result.sellers, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    });
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const { status } = req.query;
    const result = await adminService.getListings(page, limit, status);
    return sendSuccess(res, "Listings retrieved successfully", result.listings, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await adminService.getOrders(page, limit);
    return sendSuccess(res, "Orders retrieved successfully", result.orders, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await adminService.getTransactions(page, limit);
    return sendSuccess(res, "Transactions retrieved successfully", result.transactions, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    });
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await adminService.getReviews(page, limit);
    return sendSuccess(res, "Reviews retrieved successfully", result.reviews, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    });
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await adminService.getReports(page, limit);
    return sendSuccess(res, "Reports retrieved successfully", result.reports, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    });
  } catch (error) {
    next(error);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const settings = await adminService.getSettings();
    return sendSuccess(res, "Platform settings retrieved successfully", { settings });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await adminService.updateSettings(req.body);
    return sendSuccess(res, "Platform settings updated successfully", { settings });
  } catch (error) {
    next(error);
  }
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
