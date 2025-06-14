const express = require('express');
  const router = express.Router();
  const { authMiddleware, restrictTo, upload } = require('../middlewares/auth');
  const { createBrand, getBrands, updateBrand, deleteBrand } = require('../controllers/brand.controller');

  router.get('/', getBrands);
  router.post('/', authMiddleware, restrictTo('admin'), upload({ field: 'image' }), createBrand);
  router.put('/:id', authMiddleware, restrictTo('admin'), upload({ field: 'image' }), updateBrand);
  router.delete('/:id', authMiddleware, restrictTo('admin'), deleteBrand);

  module.exports = router;