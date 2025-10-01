const express = require('express');
const router = express.Router();

// Example: GET all orders (existing)
router.get('/orders', (req, res) => {
  res.json({ message: 'Customer orders endpoint' });
});

// ✅ POST /order — create a new order with Socket.IO emit
router.post('/order', async (req, res) => {
  try {
    const { customerId, vendorId, items } = req.body;

    // 🗂️ Save order into DB here (replace with your DB logic)
    // Example: mock order object
    const order = {
      id: Date.now(), // mock order ID
      customerId,
      vendorId,
      items,
      status: "pending",
    };

    // ✅ Get io instance from server
    const io = req.app.get("io");

    // ✅ Notify vendor in real-time
    if (io) {
      io.to(`vendor_${vendorId}`).emit("new_order", order);
      console.log(`📦 Notified vendor_${vendorId} about new order`);
    }

    // ✅ (Optional) FCM push notification to vendor/customer
    // You can call sendNotificationToToken() here if using Firebase

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
