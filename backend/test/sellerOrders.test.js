const sellerService = require("../services/sellerService");
const Order = require("../models/order");
const Notification = require("../models/notification");

describe("Seller Order Management Service", () => {
  it("should allow confirming received orders in Placed status and trigger notification", async () => {
    const originalFindOne = Order.findOne;
    const originalNotify = Notification.create;

    Order.findOne = jest.fn().mockResolvedValue({
      _id: "order123",
      orderNumber: "BC-ORD-1234",
      orderStatus: "Placed",
      buyer: "buyer456",
      statusHistory: [],
      save: jest.fn().mockResolvedValue(true),
    });

    Notification.create = jest.fn().mockResolvedValue({});

    const order = await sellerService.confirmReceivedOrder("seller789", "order123");

    expect(Order.findOne).toHaveBeenCalled();
    expect(order.orderStatus).toBe("Confirmed");
    expect(Notification.create).toHaveBeenCalled();

    Order.findOne = originalFindOne;
    Notification.create = originalNotify;
  });
});
