const express = require('express');
const router = express.Router();
const { authMiddleware, restrictTo } = require('../middlewares/auth');
const { createEnquiry, createEnquiryFromCart, getUserEnquiries, getEnquiriesFromCart, getAllEnquiries, updateEnquiryStatus } = require('../controllers/Enquiry.controller');

router.post('/',  createEnquiry);
router.post('/from-cart', authMiddleware, createEnquiryFromCart);
router.get('/', authMiddleware, getUserEnquiries);
router.get('/from-cart', authMiddleware, getEnquiriesFromCart);
router.get('/all', authMiddleware, restrictTo('admin'), getAllEnquiries);
router.put('/status', authMiddleware, restrictTo('admin'), updateEnquiryStatus);

module.exports = router;