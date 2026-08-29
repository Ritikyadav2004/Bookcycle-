const cartService = require("../services/cartService");
const { sendSuccess } = require("../utils/response");

const getCart = async (req, res, next) => {
  try {
    const data = await cartService.getCart(req.user._id);
    return sendSuccess(res, "Cart details retrieved successfully", data);
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;
    const qty = quantity ? Number(quantity) : 1;
    const data = await cartService.addToCart(req.user._id, bookId, qty);
    return sendSuccess(res, "Item added to cart successfully", data);
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const data = await cartService.updateCartItemQuantity(req.user._id, bookId, Number(quantity));
    return sendSuccess(res, "Cart item quantity updated successfully", data);
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const data = await cartService.removeFromCart(req.user._id, bookId);
    return sendSuccess(res, "Item removed from cart successfully", data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
};
