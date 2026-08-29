const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const predictionRoutes = require("./routes/predictionRoutes");
const db = require("./config/db");

const app = express();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const subscriptionPlanRoutes = require("./routes/subscriptionPlanRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const vipSectionSubscriptionRoutes = require("./routes/vipSectionSubscriptionRoutes");
const vipSectionPlanRoutes = require("./routes/vipSectionPlanRoutes");
const historyRoutes = require("./routes/historyRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentVerificationRoutes = require("./routes/paymentVerificationRoutes");
const paystackWebhookRoutes = require("./routes/paystackWebhookRoutes");
const manualPaymentRoutes = require("./routes/manualPaymentRoutes");

const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Body parser
app.use(
  express.json({
    limit: "100kb",

    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/predictions", predictionRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/subscriptions", subscriptionRoutes);

app.use("/api/subscription-plans", subscriptionPlanRoutes);

app.use("/api/sections", sectionRoutes);

app.use("/api/vip-subscriptions", vipSectionSubscriptionRoutes);

app.use("/api/vip-section-plans", vipSectionPlanRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/payment-verification", paymentVerificationRoutes);

app.use("/api/paystack-webhook", paystackWebhookRoutes);

app.use("/api/manual-payments", manualPaymentRoutes);


app.use("/api/history", historyRoutes);

// =================================
// TEST ROUTE
// =================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "ZeroTraceAnalytics Server Running 🚀",
  });
});

// =================================
// 404 API HANDLER
// =================================

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});

// =================================
// CENTRAL ERROR HANDLER
// =================================

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request payload is too large.",
    });
  }

  res.status(500).json({
    message: "Internal server error.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
