const cartService = require("../services/cartService");
const Book = require("../models/book");

describe("Buyer Cart Service", () => {
  it("should prevent adding own books to cart", async () => {
    const originalFindById = Book.findById;
    Book.findById = jest.fn().mockResolvedValue({
      _id: "book1",
      seller: "seller123",
      approvalStatus: "approved",
      quantity: 5,
    });

    await expect(cartService.addToCart("seller123", "book1", 1)).rejects.toThrow(
      "Sellers cannot purchase their own books"
    );

    Book.findById = originalFindById;
  });

  it("should prevent adding quantity exceeding stock", async () => {
    const originalFindById = Book.findById;
    Book.findById = jest.fn().mockResolvedValue({
      _id: "book1",
      seller: "seller123",
      approvalStatus: "approved",
      quantity: 2,
    });

    await expect(cartService.addToCart("buyer456", "book1", 5)).rejects.toThrow(
      "Only 2 copies are currently in stock"
    );

    Book.findById = originalFindById;
  });
});
