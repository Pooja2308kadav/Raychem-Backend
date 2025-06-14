const express = require('express');
const router = express.Router();
const { authMiddleware, restrictTo } = require('../middlewares/auth');
const { createLocation, getLocations, updateLocation, deleteLocation } = require('../controllers/location.controller');

router.post('/', authMiddleware, restrictTo('admin'), createLocation);
router.get('/', getLocations); // Public endpoint
router.put('/:id', authMiddleware, restrictTo('admin'), updateLocation);
router.delete('/:id', authMiddleware, restrictTo('admin'), deleteLocation);

module.exports = router;