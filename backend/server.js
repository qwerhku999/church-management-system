// ===============================
// Fix MongoDB Atlas SRV DNS Issue
// ===============================

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

// ===============================
// Load and Validate Environment
// ===============================

require("dotenv").config();

const { validateEnv } = require("./config/env");

validateEnv();

// ===============================
// Register Mongoose Models
// ===============================

require("./models/User");
require("./models/Member");
require("./models/Ministry");
require("./models/Event");
require("./models/Attendance");

// ===============================
// Load App
// ===============================

const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

// ===============================
// Connect MongoDB
// ===============================

connectDB();

// ===============================
// Start Server
// ===============================

const server = app.listen(PORT, () => {
  console.log(`MinistryFlow API running on port ${PORT}`);
});

// ===============================
// Handle Unhandled Promise Rejections
// ===============================

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);

  server.close(() => {
    process.exit(1);
  });
});

// ===============================
// Handle Uncaught Exceptions
// ===============================

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// ===============================
// Graceful Shutdown
// ===============================

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");

  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});