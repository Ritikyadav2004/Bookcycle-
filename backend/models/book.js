const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Book slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    genre: {
      type: String,
      trim: true,
      default: "",
    },
    publisher: {
      type: String,
      trim: true,
      default: "",
    },
    edition: {
      type: String,
      trim: true,
      default: "",
    },
    publicationYear: {
      type: Number,
      default: null,
    },
    language: {
      type: String,
      trim: true,
      default: "English",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Very Good", "Good", "Acceptable"],
      required: [true, "Condition is required"],
    },
    defects: {
      type: String,
      trim: true,
      default: "",
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      default: 1,
      min: [0, "Quantity cannot be negative"],
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
    },
    sellerLocation: {
      type: String,
      trim: true,
      default: "",
    },
    deliveryMethods: {
      type: [String],
      default: ["Courier"],
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "out_of_stock", "sold_out"],
      default: "available",
    },
    views: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ isbn: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ genre: 1 });
bookSchema.index({ seller: 1 });
bookSchema.index({ approvalStatus: 1 });
bookSchema.index({ createdAt: -1 });

// compound text index for search support
bookSchema.index({ title: "text", author: "text", description: "text" });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
