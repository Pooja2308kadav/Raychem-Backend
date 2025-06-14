const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const { login, signup, getCurrentUser } = require('../controllers/auth.controller');

// Existing routes (e.g., login, signup)
router.post('/login', login);
router.post('/signup', signup);

// Add the /me route to get the current authenticated user
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;