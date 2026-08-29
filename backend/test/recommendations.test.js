const recommendationService = require("../services/recommendationService");
const Book = require("../models/book");
const User = require("../models/user");
const Order = require("../models/order");

describe("Recommendation Service", () => {
  it("should pull fallback recommendations if user has no browsing or wishlist history", async () => {
    const originalFindById = User.findById;
    const originalFindOrders = Order.find;
    const originalFindBooks = Book.find;

    User.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      wishlist: [],
      browsingHistory: [],
    });

    Order.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });

    Book.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        { _id: "book1", title: "Fallback Book", views: 100 }
      ]),
    });

    const recommendations = await recommendationService.getRecommendations("buyer123", 5);

    expect(User.findById).toHaveBeenCalled();
    expect(recommendations.length).toBe(1);
    expect(recommendations[0].title).toBe("Fallback Book");

    User.findById = originalFindById;
    Order.find = originalFindOrders;
    Book.find = originalFindBooks;
  });
});
