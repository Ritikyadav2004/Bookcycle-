const orderService = require("../services/orderService");
const { sendSuccess } = require("../utils/response");

const checkout = async (req, res, next) => {
  try {
    const data = await orderService.checkoutCart(req.user._id, req.body);
    return sendSuccess(res, "Checkout completed successfully", data, 201);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getBuyerOrders(req.user._id);
    return sendSuccess(res, "Orders retrieved successfully", { orders });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderDetails(id, req.user._id);
    return sendSuccess(res, "Order details retrieved successfully", { order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  getOrders,
  getOrder,
};
