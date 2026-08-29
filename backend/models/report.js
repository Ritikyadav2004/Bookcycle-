const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      default: null,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reason: {
      type: String,
      required: [true, "Report reason is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    evidence: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Dismissed"],
      default: "Pending",
    },
    adminResponse: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ reportedBy: 1 });
reportSchema.index({ status: 1 });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
