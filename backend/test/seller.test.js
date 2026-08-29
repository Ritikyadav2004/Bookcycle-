const sellerService = require("../services/sellerService");
const Book = require("../models/book");
const User = require("../models/user");
const Notification = require("../models/notification");

jest.mock("../services/cloudinaryService", () => ({
  uploadImage: jest.fn().mockResolvedValue({ secure_url: "http://mock-cloudinary-url.com/img.jpg" }),
  deleteImage: jest.fn().mockResolvedValue({}),
  getPublicIdFromUrl: jest.fn().mockReturnValue("mock-id"),
}));

describe("Seller Listing Workflow Service", () => {
  it("should create a book listing in pending status and trigger admin notifications", async () => {
    const originalCreate = Book.create;
    const originalFind = User.find;
    const originalInsert = Notification.insertMany;

    Book.create = jest.fn().mockResolvedValue({
      _id: "book123",
      title: "Clean Code",
      slug: "clean-code-1234",
      seller: "seller123",
      approvalStatus: "pending",
    });

    User.find = jest.fn().mockResolvedValue([{ _id: "admin123", role: "admin" }]);
    Notification.insertMany = jest.fn().mockResolvedValue([]);

    const bookData = {
      title: "Clean Code",
      author: "Robert C. Martin",
      condition: "New",
      originalPrice: 500,
      sellingPrice: 400,
      category: "category123",
    };

    const book = await sellerService.createListing("seller123", bookData, ["img1"]);
    
    expect(Book.create).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalledWith({ role: "admin" });
    expect(Notification.insertMany).toHaveBeenCalled();
    expect(book._id).toBe("book123");

    // Restore original functions
    Book.create = originalCreate;
    User.find = originalFind;
    Notification.insertMany = originalInsert;
  });
});
