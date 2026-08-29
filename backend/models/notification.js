const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true, // e.g. 'LISTING_SUBMITTED', 'LISTING_APPROVED', 'NEW_ORDER', etc.
    },
    relatedEntity: {
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      entityType: {
        type: String, // e.g. 'Book', 'Order', 'User'
        default: null,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1 });
notificationSchema.index({ isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
