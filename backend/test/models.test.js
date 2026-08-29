const User = require("../models/user");
const Category = require("../models/category");
const Book = require("../models/book");

describe("Database Models Schema Validation", () => {
  it("should fail validation for User if required fields are missing", () => {
    const user = new User({});
    const err = user.validateSync();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.mobile).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should fail validation for Category if name or slug is missing", () => {
    const category = new Category({});
    const err = category.validateSync();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.slug).toBeDefined();
  });

  it("should fail validation for Book if required fields are missing", () => {
    const book = new Book({});
    const err = book.validateSync();
    expect(err.errors.title).toBeDefined();
    expect(err.errors.slug).toBeDefined();
    expect(err.errors.author).toBeDefined();
    expect(err.errors.category).toBeDefined();
    expect(err.errors.condition).toBeDefined();
    expect(err.errors.originalPrice).toBeDefined();
    expect(err.errors.sellingPrice).toBeDefined();
    expect(err.errors.seller).toBeDefined();
  });
});
