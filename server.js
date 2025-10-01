// server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const vendorRoutes = require("./routes/vendor");
const customerRoutes = require("./routes/customer");
const deliveryRoutes = require("./routes/delivery");
const adminRoutes = require("./routes/admin");

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173", // allow local dev (Vite/React)
      "https://customer.smartz.com",
      "https://vendor.smartz.com",
      "https://delivery.smartz.com",
      "https://admin.smartz.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 Smartz Backend is running!");
});

// ✅ HTTP + Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ for production, restrict origins
    methods: ["GET", "POST"],
  },
});

// ✅ Make io available in routes
app.set("io", io);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Socket.IO connection
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // Join personal room (for notifications)
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`📌 User ${userId} joined room`);
  });

  // Handle order updates
  socket.on("orderUpdate", (data) => {
    console.log("📦 Order update:", data);
    io.to(data.userId).emit("orderNotification", data);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
