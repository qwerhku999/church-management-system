const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const app = express();


// ===============================
// Security Middleware
// ===============================

app.use(helmet());

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],
  })
);


// ===============================
// Body Parser
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ===============================
// Logger
// ===============================

app.use(morgan("dev"));


// ===============================
// Uploads
// ===============================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ===============================
// API Routes
// ===============================

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/users",
  require("./routes/userRoutes")
);

app.use(
  "/api/members",
  require("./routes/memberRoutes")
);

app.use(
  "/api/attendance",
  require("./routes/attendanceRoutes")
);

app.use(
  "/api/events",
  require("./routes/eventRoutes")
);

app.use(
  "/api/donations",
  require("./routes/donationRoutes")
);

app.use(
  "/api/finance",
  require("./routes/financeRoutes")
);

app.use(
  "/api/ministries",
  require("./routes/ministryRoutes")
);

app.use(
  "/api/announcements",
  require("./routes/announcementRoutes")
);

app.use(
  "/api/notifications",
  require("./routes/notificationRoutes")
);

app.use(
  "/api/documents",
  require("./routes/documentRoutes")
);

app.use(
  "/api/prayers",
  require("./routes/prayerRoutes")
);

app.use(
  "/api/visitors",
  require("./routes/visitorRoutes")
);

app.use(
  "/api/reports",
  require("./routes/reportRoutes")
);


// ===============================
// Health Check
// ===============================

app.get("/", (req,res)=>{
  res.json({
    success:true,
    message:"MinistryFlow API running 🚀"
  });
});


// ===============================
// 404
// ===============================

app.use((req,res)=>{
  res.status(404).json({
    success:false,
    message:"Route not found"
  });
});


// ===============================
// Error Handler
// ===============================

app.use((err,req,res,next)=>{

  console.error(err);

  res.status(
    err.status || 500
  ).json({
    success:false,
    message:
      err.message ||
      "Server Error"
  });

});


module.exports = app;