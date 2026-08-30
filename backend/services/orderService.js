const mongoose = require("mongoose");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
const Book = require("../models/book");
const Cart = require("../models/cart");
const Notification = require("../models/notification");
const AppError = require("../utils/appError");
const paymentService = require("./paymentService");
const crypto = require("crypto");

const checkoutCart = async (buyerId, checkoutData) => {
  const { paymentMethod, paymentDetails, shippingAddress } = checkoutData;

  if (!paymentMethod || paymentMethod.toUpperCase() !== "COD") {
    throw new AppError("Only Cash on Delivery (COD) payment method is allowed", 400);
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
    throw new AppError("Shipping address is incomplete", 400);
  }

  // 1) Fetch and validate cart
  const cart = await Cart.findOne({ buyer: buyerId }).populate("items.book");
  if (!cart || cart.items.length === 0) {
    throw new AppError("Your cart is empty", 400);
  }

  // Double check stock availability and prices
  for (const item of cart.items) {
    const book = await Book.findById(item.book._id);
    if (!book || book.approvalStatus !== "approved") {
      throw new AppError(`Book "${item.book.title}" is no longer available`, 400);
    }
    if (book.quantity < item.quantity) {
      throw new AppError(`Insufficient stock for "${book.title}". Available: ${book.quantity}`, 400);
    }
    // Sync price
    item.unitPrice = book.sellingPrice;
  }

  // 2) Group items by seller
  const sellerGroups = {};
  cart.items.forEach((item) => {
    const sellerId = item.seller.toString();
    if (!sellerGroups[sellerId]) {
      sellerGroups[sellerId] = [];
    }
    sellerGroups[sellerId].push(item);
  });

  const createdOrders = [];
  const createdTransactions = [];

  // Use session if database supports replica sets, otherwise simple loop
  // For local/Atlas configurations, we will do atomic operations and loop
  for (const sellerId of Object.keys(sellerGroups)) {
    const items = sellerGroups[sellerId];
    
    // Recalculate totals for this seller's group
    let subtotal = 0;
    let discount = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.book._id);
      
      // Safe stock reduction
      const updatedBook = await Book.findOneAndUpdate(
        { _id: item.book._id, quantity: { $gte: item.quantity } },
        { 
          $inc: { quantity: -item.quantity, soldCount: item.quantity }
        },
        { new: true }
      );

      if (!updatedBook) {
        throw new AppError(`Checkout failed: Stock for "${book.title}" changed during checkout. Please try again.`, 400);
      }

      // Check if stock became zero to change status
      if (updatedBook.quantity === 0) {
        updatedBook.availabilityStatus = "out_of_stock";
        await updatedBook.save();
      }

      subtotal += book.sellingPrice * item.quantity;
      discount += Math.max(0, book.originalPrice - book.sellingPrice) * item.quantity;
      
      orderItems.push({
        book: item.book._id,
        quantity: item.quantity,
        price: book.sellingPrice,
      });
    }

    const deliveryCharge = 40; // 40 per seller order group
    const platformFee = 10; // 10 per seller order group
    const totalAmount = subtotal + deliveryCharge + platformFee;

    // Process Mock Payment
    const paymentResult = await paymentService.processMockPayment({
      amount: totalAmount,
      method: paymentMethod,
      details: paymentDetails,
    });

    const orderNumber = `BC-ORD-${Date.now().toString().substring(6)}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // Create Order
    const order = await Order.create({
      orderNumber,
      buyer: buyerId,
      items: orderItems,
      seller: sellerId,
      shippingAddress,
      subtotal,
      deliveryCharge,
      platformFee,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentResult.status,
      orderStatus: "Placed",
      statusHistory: [{
        status: "Placed",
        note: "Order has been placed successfully",
      }],
    });

    // Create Transaction Log
    const platformCommission = Math.round(subtotal * 0.1); // 10% commission
    const sellerAmount = totalAmount - platformCommission;

    const transaction = await Transaction.create({
      transactionId: paymentResult.transactionId,
      order: order._id,
      buyer: buyerId,
      seller: sellerId,
      amount: totalAmount,
      platformCommission,
      sellerAmount,
      paymentMethod,
      paymentStatus: paymentResult.status,
    });

    // Notify seller of the new order
    await Notification.create({
      recipient: sellerId,
      title: "New Order Received",
      message: `You have received a new order ${orderNumber} for ${orderItems.length} book(s).`,
      type: "NEW_ORDER",
      relatedEntity: {
        entityId: order._id,
        entityType: "Order",
      },
    });

    createdOrders.push(order);
    createdTransactions.push(transaction);
  }

  // Clear cart on successful checkout
  cart.items = [];
  await cart.save();

  return {
    orders: createdOrders,
    transactions: createdTransactions,
  };
};

const getBuyerOrders = async (buyerId) => {
  return Order.find({ buyer: buyerId })
    .populate("items.book")
    .populate("seller", "name shopName")
    .sort({ createdAt: -1 });
};

const getOrderDetails = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate("items.book")
    .populate("seller", "name shopName mobile")
    .populate("buyer", "name email mobile");

  if (!order) throw new AppError("Order not found", 404);

  // Assert user is either the buyer or the seller
  if (order.buyer._id.toString() !== userId.toString() && order.seller._id.toString() !== userId.toString()) {
    throw new AppError("Unauthorized access to order details", 403);
  }

  return order;
};

module.exports = {
  checkoutCart,
  getBuyerOrders,
  getOrderDetails,
};
