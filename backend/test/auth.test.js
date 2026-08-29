const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/user");
const connectDatabase = require("../config/database");

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDatabase();
    }
    await User.deleteMany({ email: /@test\.com$/ });
  });

  afterAll(async () => {
    await User.deleteMany({ email: /@test\.com$/ });
    await mongoose.connection.close();
  });

  const testUser = {
    name: "Test Buyer",
    email: "buyer@test.com",
    mobile: "1234567890",
    password: "password123",
    role: "buyer",
  };

  it("should register a new buyer user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it("should fail to register a user with an existing email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should log in the registered user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
