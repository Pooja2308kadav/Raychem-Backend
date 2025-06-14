// routes/cart.routes.js - Fixed version
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const { addToCart, getCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cart.controller');

// Allow non-authenticated users to add to cart (handled by frontend local storage)
router.post('/', authMiddleware, addToCart);
// Allow non-authenticated users to get cart (handled by frontend local storage)  
router.get('/', authMiddleware, getCart);
// Operations below require authentication as they modify server-side cart
router.put('/', authMiddleware, updateCartItem);
// Non-authenticated users handle deletions via local storage; this route is for authenticated users only
router.delete('/:productId', authMiddleware, removeFromCart);
// Fixed: Change the route path for clear cart
router.delete('/', authMiddleware, clearCart); // Changed from '/cart' to '/'

module.exports = router;