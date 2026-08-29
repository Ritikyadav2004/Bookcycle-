const crypto = require("crypto");
const AppError = require("../utils/appError");

/**
 * Mock payment engine for college project scope
 * @param {Object} paymentData 
 * @returns {Promise<Object>}
 */
const processMockPayment = async ({ amount, method, details }) => {
  const transactionId = `TXN-${crypto.randomBytes(12).toString("hex").toUpperCase()}`;
  
  if (method === "COD") {
    return {
      success: true,
      transactionId,
      status: "Pending",
      message: "Cash on delivery order recorded",
    };
  }

  if (method === "UPI") {
    const { upiId } = details || {};
    if (!upiId || !upiId.includes("@")) {
      throw new AppError("Invalid UPI ID format", 400);
    }
    return {
      success: true,
      transactionId,
      status: "Completed",
      message: "UPI transaction successful",
    };
  }

  if (method === "Card") {
    const { cardNumber, expiry, cvv } = details || {};
    if (!cardNumber || cardNumber.length < 15 || !cvv || cvv.length < 3) {
      throw new AppError("Invalid Card details format", 400);
    }
    
    // Simulate transaction status: do not capture or store card/CVV data
    return {
      success: true,
      transactionId,
      status: "Completed",
      message: "Card transaction authorized successfully",
    };
  }

  throw new AppError("Unsupported payment method", 400);
};

module.exports = {
  processMockPayment,
};
