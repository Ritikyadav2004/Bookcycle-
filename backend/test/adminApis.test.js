const adminService = require("../services/adminService");
const User = require("../models/user");

describe("Admin Additional Listing APIs", () => {
  it("should successfully fetch buyers page items", async () => {
    const originalCount = User.countDocuments;
    const originalFind = User.find;

    User.countDocuments = jest.fn().mockResolvedValue(2);
    User.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        { _id: "user1", name: "Buyer 1", role: "buyer" },
        { _id: "user2", name: "Buyer 2", role: "buyer" },
      ]),
    });

    const result = await adminService.getBuyers(1, 10);

    expect(User.countDocuments).toHaveBeenCalledWith({ role: "buyer" });
    expect(result.buyers.length).toBe(2);

    User.countDocuments = originalCount;
    User.find = originalFind;
  });
});
