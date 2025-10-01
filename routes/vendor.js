const express = require('express');
const router = express.Router();

// Example vendor routes
router.get('/profile', (req, res) => {
  res.json({ message: 'Vendor profile endpoint' });
});

router.post('/product', (req, res) => {
  res.json({ message: 'Add product endpoint' });
});

module.exports = router;
