const reviewService = require("../services/reviewService");
const Order = require("../models/order");

describe("Buyer Review Service", () => {
  it("should fail review creation if no matching delivered order exists for that book", async () => {
    const originalFindOne = Order.findOne;
    Order.findOne = jest.fn().mockResolvedValue(null);

    await expect(
      reviewService.createReview("buyer123", {
        bookId: "book456",
        orderId: "order789",
        rating: 5,
        comment: "Great book!",
      })
    ).rejects.toThrow("You can only review books that you purchased and have been delivered.");

    Order.findOne = originalFindOne;
  });
});
