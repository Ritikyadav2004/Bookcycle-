const orderService = require("../services/orderService");
const Cart = require("../models/cart");

describe("Buyer Order Service", () => {
  it("should fail checkout if cart is empty", async () => {
    const originalFindOne = Cart.findOne;
    Cart.findOne = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue({ items: [] }),
    });

    const checkoutData = {
      paymentMethod: "COD",
      shippingAddress: {
        fullName: "Test Buyer",
        addressLine: "Line 1",
        city: "City",
        state: "State",
        postalCode: "123456",
      },
    };

    await expect(orderService.checkoutCart("buyer123", checkoutData)).rejects.toThrow(
      "Your cart is empty"
    );

    Cart.findOne = originalFindOne;
  });
});
