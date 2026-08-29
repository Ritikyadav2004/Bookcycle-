const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Flagged"],
      default: "Approved",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique review per buyer/book/order combination
reviewSchema.index({ buyer: 1, book: 1, order: 1 }, { unique: true });
reviewSchema.index({ book: 1 });
reviewSchema.index({ seller: 1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
