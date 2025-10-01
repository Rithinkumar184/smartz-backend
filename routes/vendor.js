const express = require('express');
const router = express.Router();

// Example: GET vendor profile (existing)
router.get('/profile', (req, res) => {
  res.json({ message: 'Vendor profile endpoint' });
});

// Example: POST add product (existing)
router.post('/product', (req, res) => {
  res.json({ message: 'Add product endpoint' });
});

// ✅ POST /order/status — update order status with Socket.IO emit
router.post('/order/status', async (req, res) => {
  try {
    const { orderId, customerId, status } = req.body;

    // 🗂️ Update order status in DB here (replace with your DB logic)
    const updatedOrder = {
      id: orderId,
      customerId,
      status,
    };

    // ✅ Get io instance from server
    const io = req.app.get("io");

    // ✅ Notify customer in real-time
    if (io) {
      io.to(`user_${customerId}`).emit("order_update", {
        orderId,
        status,
      });
      console.log(`📦 Notified user_${customerId} about order #${orderId} status change`);
    }

    // ✅ (Optional) FCM push notification to customer
    // You can call sendNotificationToToken(customerToken, ...) here

    res.json({ success: true, updatedOrder });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
