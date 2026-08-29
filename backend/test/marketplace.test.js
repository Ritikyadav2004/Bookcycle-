const bookService = require("../services/bookService");
const Book = require("../models/book");

describe("Buyer Marketplace Service", () => {
  it("should query approved and available books only", async () => {
    const originalCount = Book.countDocuments;
    const originalFind = Book.find;

    Book.countDocuments = jest.fn().mockResolvedValue(1);
    Book.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([
                { _id: "book1", title: "Test Book", approvalStatus: "approved", availabilityStatus: "available" }
              ])
            })
          })
        })
      })
    });

    const result = await bookService.queryBooks({});
    expect(Book.countDocuments).toHaveBeenCalledWith({
      approvalStatus: "approved",
      availabilityStatus: "available",
    });
    expect(result.books.length).toBe(1);

    Book.countDocuments = originalCount;
    Book.find = originalFind;
  });
});
