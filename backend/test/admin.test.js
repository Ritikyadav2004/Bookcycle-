const adminService = require("../services/adminService");
const Book = require("../models/book");
const Notification = require("../models/notification");

describe("Admin Listing Management Service", () => {
  it("should successfully review a book listing and create seller notification", async () => {
    const originalFindById = Book.findById;
    const originalNotify = Notification.create;

    Book.findById = jest.fn().mockResolvedValue({
      _id: "book123",
      title: "Clean Code",
      seller: "seller123",
      approvalStatus: "pending",
      save: jest.fn().mockResolvedValue(true),
    });

    Notification.create = jest.fn().mockResolvedValue({});

    const result = await adminService.reviewBookListing("book123", "approved");

    expect(Book.findById).toHaveBeenCalledWith("book123");
    expect(result.approvalStatus).toBe("approved");
    expect(Notification.create).toHaveBeenCalled();

    // Restore originals
    Book.findById = originalFindById;
    Notification.create = originalNotify;
  });
});
