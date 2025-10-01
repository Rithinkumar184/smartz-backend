// routes/notifications.js
const express = require('express');
const router = express.Router();
// assume you have some DB helper, replace with your DB code
const db = require('../db'); // replace with your DB client

// POST /api/notifications/register-token
router.post('/register-token', async (req, res) => {
  try {
    const { userId, token } = req.body;
    if (!userId || !token) return res.status(400).json({ error: 'userId and token required' });

    // Example: store as single token column (or you can store in tokens table)
    await db.query(
      'UPDATE users SET device_token = $1 WHERE id = $2',
      [token, userId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
