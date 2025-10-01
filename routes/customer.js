const express = require('express');
const router = express.Router();

// Example customer routes
router.get('/orders', (req, res) => {
  res.json({ message: 'Customer orders endpoint' });
});

router.post('/order', (req, res) => {
  res.json({ message: 'Place order endpoint' });
});

module.exports = router;
