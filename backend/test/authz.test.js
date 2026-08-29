const { restrictTo } = require("../middleware/authMiddleware");

describe("Authorization Middlewares", () => {
  it("should restrictTo middleware correctly reject unauthorized roles and pass authorized roles", () => {
    const mockReq = { user: { role: "buyer" } };
    const mockRes = {};
    const mockNext = jest.fn();

    // Restrict to seller only
    restrictTo("seller")(mockReq, mockRes, mockNext);
    
    // Should pass an error to next()
    expect(mockNext).toHaveBeenCalled();
    const errorPassed = mockNext.mock.calls[0][0];
    expect(errorPassed).toBeDefined();
    expect(errorPassed.statusCode).toBe(403);

    const mockNextSuccess = jest.fn();
    // Restrict to buyer (our user's role)
    restrictTo("buyer")(mockReq, mockRes, mockNextSuccess);
    
    // Should call next() with no parameters
    expect(mockNextSuccess).toHaveBeenCalledWith();
  });
});
