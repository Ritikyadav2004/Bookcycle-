const Cart = require("../models/cart");
const Book = require("../models/book");
const AppError = require("../utils/appError");

// Helper to calculate totals from database values
const calculateCartTotals = (items) => {
  let subtotal = 0;
  let discount = 0;
  const sellerGroups = {};

  items.forEach((item) => {
    const bookPrice = item.book.sellingPrice;
    const originalPrice = item.book.originalPrice;
    const discountAmt = Math.max(0, originalPrice - bookPrice) * item.quantity;
    
    subtotal += bookPrice * item.quantity;
    discount += discountAmt;

    // Group items by seller to compute seller-specific shipping or order divisions
    const sellerId = item.seller.toString();
    if (!sellerGroups[sellerId]) {
      sellerGroups[sellerId] = [];
    }
    sellerGroups[sellerId].push(item);
  });

  // Business Rules for Platform Fees & Delivery
  const platformFee = items.length > 0 ? 10 : 0; // Flat 10 rupee fee if cart is not empty
  
  // Delivery Charge: 40 rupees per unique seller shipping group
  const uniqueSellersCount = Object.keys(sellerGroups).length;
  const deliveryCharge = uniqueSellersCount * 40;

  const totalAmount = subtotal + platformFee + deliveryCharge;

  return {
    subtotal,
    discount,
    platformFee,
    deliveryCharge,
    totalAmount,
    sellerGroups,
  };
};

const getCart = async (buyerId) => {
  let cart = await Cart.findOne({ buyer: buyerId })
    .populate({
      path: "items.book",
      match: { approvalStatus: "approved" }, // retrieve only approved books
    });

  if (!cart) {
    cart = await Cart.create({ buyer: buyerId, items: [] });
  }

  // Filter out any unapproved books that might have been matched as null during populate
  cart.items = cart.items.filter((item) => item.book !== null);

  const totals = calculateCartTotals(cart.items);

  return {
    cart,
    totals,
  };
};

const addToCart = async (buyerId, bookId, quantity = 1) => {
  const book = await Book.findById(bookId);
  if (!book || book.approvalStatus !== "approved") {
    throw new AppError("Book not found or unapproved", 404);
  }

  // Prevent self-purchase
  if (book.seller.toString() === buyerId.toString()) {
    throw new AppError("Sellers cannot purchase their own books", 400);
  }

  // Prevent adding quantity above stock
  if (quantity > book.quantity) {
    throw new AppError(`Only ${book.quantity} copies are currently in stock`, 400);
  }

  if (book.quantity <= 0) {
    throw new AppError("This book is out of stock", 400);
  }

  let cart = await Cart.findOne({ buyer: buyerId });
  if (!cart) {
    cart = await Cart.create({ buyer: buyerId, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (item) => item.book.toString() === bookId.toString()
  );

  if (existingIndex > -1) {
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > book.quantity) {
      throw new AppError(`Cannot add more. Total would exceed available stock of ${book.quantity}`, 400);
    }
    cart.items[existingIndex].quantity = newQty;
  } else {
    cart.items.push({
      book: bookId,
      seller: book.seller,
      quantity,
      unitPrice: book.sellingPrice,
    });
  }

  await cart.save();
  return getCart(buyerId);
};

const updateCartItemQuantity = async (buyerId, bookId, quantity) => {
  if (quantity < 1) {
    throw new AppError("Quantity must be at least 1", 400);
  }

  const book = await Book.findById(bookId);
  if (!book || book.approvalStatus !== "approved") {
    throw new AppError("Book not found or unapproved", 404);
  }

  if (quantity > book.quantity) {
    throw new AppError(`Cannot update quantity. Only ${book.quantity} copies in stock`, 400);
  }

  const cart = await Cart.findOne({ buyer: buyerId });
  if (!cart) throw new AppError("Cart not found", 404);

  const existingIndex = cart.items.findIndex(
    (item) => item.book.toString() === bookId.toString()
  );

  if (existingIndex === -1) {
    throw new AppError("Item not found in cart", 404);
  }

  cart.items[existingIndex].quantity = quantity;
  await cart.save();

  return getCart(buyerId);
};

const removeFromCart = async (buyerId, bookId) => {
  const cart = await Cart.findOne({ buyer: buyerId });
  if (!cart) throw new AppError("Cart not found", 404);

  cart.items = cart.items.filter(
    (item) => item.book.toString() !== bookId.toString()
  );

  await cart.save();
  return getCart(buyerId);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
};
