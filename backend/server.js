require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");
const validateEnvironment = require("./config/env");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Validate environment variables first
    validateEnvironment();

    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`BookCycle server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();