const express = require('express');
const router = express.Router();

// Example admin routes
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard endpoint' });
});

router.get('/users', (req, res) => {
  res.json({ message: 'Manage users endpoint' });
});

module.exports = router;
