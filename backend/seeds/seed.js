require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");
const Book = require("../models/book");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
const Review = require("../models/review");
const Notification = require("../models/notification");
const RefreshToken = require("../models/refreshToken");
const Address = require("../models/address");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected for seeding...");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

const purgeDatabase = async () => {
  console.log("Purging existing data...");
  await User.deleteMany({});
  await Book.deleteMany({});
  await Category.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});
  await Transaction.deleteMany({});
  await Review.deleteMany({});
  await Notification.deleteMany({});
  await RefreshToken.deleteMany({});
  await Address.deleteMany({});
  console.log("Data purge complete.");
};

const seed = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL: Cannot run seed script in production environment!");
    process.exit(1);
  }

  await connectDatabase();
  await purgeDatabase();

  try {
    console.log("Starting seeding process...");

    // 1) Seed Admin User
    const adminUser = await User.create({
      name: "Portal Administrator",
      email: "admin@bookcycle.com",
      mobile: "9999999999",
      password: "adminpassword123", // Hashes automatically via pre-save hook
      role: "admin",
      accountStatus: "active",
      emailVerified: true,
    });

    // 2) Seed Sellers (5 users)
    const sellers = [];
    for (let i = 1; i <= 5; i++) {
      const seller = await User.create({
        name: `Seller John ${i}`,
        email: `seller${i}@test.com`,
        mobile: `888888888${i}`,
        password: "sellerpassword123",
        role: "seller",
        shopName: `John's Bookstore Vol ${i}`,
        address: `${i}23 Seller Lane`,
        city: "New Delhi",
        state: "Delhi",
        postalCode: "110001",
        accountStatus: "active",
        emailVerified: true,
        sellerVerificationStatus: i % 2 === 0 ? "approved" : "pending",
      });
      sellers.push(seller);
    }

    // 3) Seed Buyers (5 users)
    const buyers = [];
    for (let i = 1; i <= 5; i++) {
      const buyer = await User.create({
        name: `Buyer Alice ${i}`,
        email: `buyer${i}@test.com`,
        mobile: `777777777${i}`,
        password: "buyerpassword123",
        role: "buyer",
        address: `${i}45 Buyer Boulevard`,
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        accountStatus: "active",
        emailVerified: true,
      });
      buyers.push(buyer);
    }

    // 4) Seed Categories (10 categories)
    const categoryNames = [
      "Fiction", "Non-Fiction", "Science & Tech", "History", 
      "Biography", "Self-Help", "Poetry", "Academic", 
      "Mystery & Thriller", "Children's Books"
    ];
    
    const categories = [];
    for (const name of categoryNames) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const category = await Category.create({
        name,
        slug,
        description: `All second-hand titles belonging to the ${name} genre.`,
        status: "active",
      });
      categories.push(category);
    }

    // 5) Seed Books (27 books)
    console.log("Seeding books...");
    const books = [];
    const bookTitles = [
      "The Great Gatsby", "To Kill a Mockingbird", "A Brief History of Time",
      "Sapiens", "Steve Jobs Biography", "Atomic Habits", "The Waste Land",
      "Calculus Volume 1", "Sherlock Holmes Complete Collection", "Harry Potter and the Sorcerer's Stone",
      "Pride and Prejudice", "1984", "Cosmos", "Guns Germs and Steel",
      "Einstein: His Life and Universe", "Think and Grow Rich", "Selected Poems of Robert Frost",
      "Introduction to Algorithms", "Gone Girl", "The Hobbit", "Moby Dick",
      "Animal Farm", "The Selfish Gene", "The Rise and Fall of the Third Reich",
      "Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future", "Deep Work", "Leaves of Grass"
    ];

    const conditions = ["New", "Like New", "Very Good", "Good", "Acceptable"];
    const approvalStatuses = ["approved", "pending", "rejected"];

    for (let i = 0; i < bookTitles.length; i++) {
      const title = bookTitles[i];
      const categoryIndex = i % categories.length;
      const sellerIndex = i % sellers.length;
      
      const originalPrice = 200 + (i * 20);
      const sellingPrice = Math.round(originalPrice * 0.7); // 30% off
      
      // Rotate statuses
      let approvalStatus = "approved";
      if (i === 15 || i === 18) approvalStatus = "pending";
      if (i === 20 || i === 22) approvalStatus = "rejected";

      const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const slug = `${baseSlug}-${1000 + i}`;

      const book = await Book.create({
        title,
        slug,
        author: `Author ${i + 1}`,
        isbn: `978-0-12-345678-${i}`,
        category: categories[categoryIndex]._id,
        genre: categories[categoryIndex].name,
        publisher: `Publisher House ${i}`,
        edition: `${(i % 3) + 1}nd Edition`,
        publicationYear: 2010 + (i % 15),
        language: "English",
        description: `A well-kept copy of ${title}. Perfect reading condition.`,
        condition: conditions[i % conditions.length],
        originalPrice,
        sellingPrice,
        quantity: i % 7 === 0 ? 0 : (i % 3) + 1, // some out of stock
        images: [`http://res.cloudinary.com/demo/image/upload/v12345/book-${i}.jpg`],
        seller: sellers[sellerIndex]._id,
        sellerLocation: sellers[sellerIndex].city,
        approvalStatus,
        rejectionReason: approvalStatus === "rejected" ? "Missing details or poor cover photo quality" : "",
        availabilityStatus: (i % 7 === 0) ? "out_of_stock" : "available",
        views: 10 + (i * 5),
        averageRating: approvalStatus === "approved" ? 3 + (i % 3) : 0,
      });
      books.push(book);
    }

    // 6) Seed Addresses
    const address = await Address.create({
      user: buyers[0]._id,
      fullName: "Alice Cooper",
      mobile: "9876543210",
      addressLine: "Room 102, H-Block",
      landmark: "Near central Library",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      isDefault: true,
    });

    // 7) Seed Carts (Add an item to buyer 1's cart)
    const availableBook = books.find((b) => b.approvalStatus === "approved" && b.quantity > 0 && b.seller.toString() !== buyers[0]._id.toString());
    if (availableBook) {
      await Cart.create({
        buyer: buyers[0]._id,
        items: [{
          book: availableBook._id,
          seller: availableBook.seller,
          quantity: 1,
          unitPrice: availableBook.sellingPrice,
        }],
      });
    }

    // 8) Seed Order & Transaction (Delivered order to allow review seeding)
    console.log("Seeding orders...");
    const purchaseBook = books.find((b) => b.approvalStatus === "approved" && b.quantity > 0 && b.seller.toString() !== buyers[1]._id.toString());
    if (purchaseBook) {
      const order = await Order.create({
        orderNumber: "BC-ORD-SEED-111",
        buyer: buyers[1]._id,
        items: [{
          book: purchaseBook._id,
          quantity: 1,
          price: purchaseBook.sellingPrice,
        }],
        seller: purchaseBook.seller,
        shippingAddress: {
          fullName: "Alice Cooper",
          mobile: "9876543210",
          addressLine: "Flat 102, Sector 12",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
        },
        subtotal: purchaseBook.sellingPrice,
        deliveryCharge: 40,
        platformFee: 10,
        totalAmount: purchaseBook.sellingPrice + 50,
        paymentMethod: "UPI",
        paymentStatus: "Completed",
        orderStatus: "Delivered",
        statusHistory: [
          { status: "Placed", note: "Order placed" },
          { status: "Confirmed", note: "Confirmed" },
          { status: "Shipped", note: "Shipped" },
          { status: "Delivered", note: "Delivered to buyer" }
        ],
      });

      await Transaction.create({
        transactionId: "TXN-SEED-999",
        order: order._id,
        buyer: buyers[1]._id,
        seller: purchaseBook.seller,
        amount: order.totalAmount,
        platformCommission: Math.round(purchaseBook.sellingPrice * 0.1),
        sellerAmount: order.totalAmount - Math.round(purchaseBook.sellingPrice * 0.1),
        paymentMethod: "UPI",
        paymentStatus: "Completed",
      });

      // Seed Review
      await Review.create({
        buyer: buyers[1]._id,
        seller: purchaseBook.seller,
        book: purchaseBook._id,
        order: order._id,
        rating: 5,
        comment: "Excellent book condition. The pages are crisp!",
        status: "Approved",
      });
    }

    // 9) Seed Notification
    await Notification.create({
      recipient: buyers[0]._id,
      title: "Welcome to BookCycle",
      message: "Start buying or listing second-hand books today!",
      type: "WELCOME",
    });

    console.log("Database seeded successfully!");
    
    // Print Dev Credentials
    console.log("\n===========================================");
    console.log("DEVELOPMENT DEMO CREDENTIALS:");
    console.log("-------------------------------------------");
    console.log(`Admin User:   admin@bookcycle.com / adminpassword123`);
    console.log(`Seller User:  seller1@test.com    / sellerpassword123`);
    console.log(`Buyer User:   buyer1@test.com     / buyerpassword123`);
    console.log("===========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
