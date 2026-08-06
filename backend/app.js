const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const { getAllowedOrigins } = require("./config/env");
const logger = require("./utils/logger");

const app = express();
const allowedOrigins = getAllowedOrigins();

// =====================================
// Security Middleware
// =====================================

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =====================================
// Body Parser
// =====================================

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// =====================================
// Logger
// =====================================

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// =====================================
// Static Files
// =====================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================================
// API Documentation
// =====================================

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs.json", (req, res) => res.json(swaggerSpec));

// =====================================
// API ROUTES
// =====================================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/finance", require("./routes/financeRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/ministries", require("./routes/ministryRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/prayers", require("./routes/prayerRoutes"));
app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// =====================================
// Health Check
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MinistryFlow API running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "ministryflow-api",
    timestamp: new Date().toISOString(),
  });
});

// =====================================
// 404 Handler
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================
// Global Error Handler
// =====================================

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  logger.error(err.stack || err.message || err);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && isProduction ? "Server Error" : err.message || "Server Error",
    error: isProduction ? {} : { message: err.message },
  });
});

module.exports = app;
