const express = require('express');
  const router = express.Router();
  const { authMiddleware, restrictTo, upload } = require('../middlewares/auth');
  const { createSubcategory, getSubcategories, getSubcategoryBySlug, updateSubcategory, deleteSubcategory } = require('../controllers/subcategory.controllers');

  router.get('/', getSubcategories);
  router.get('/slug/:slug', getSubcategoryBySlug);
  router.post('/', authMiddleware, restrictTo('admin'), upload({ field: 'image' }), createSubcategory);
  router.put('/:id', authMiddleware, restrictTo('admin'), upload({ field: 'image' }), updateSubcategory);
  router.delete('/:id', authMiddleware, restrictTo('admin'), deleteSubcategory);

  module.exports = router;