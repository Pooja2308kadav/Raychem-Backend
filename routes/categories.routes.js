const express = require('express');
  const router = express.Router();
  const { authMiddleware, restrictTo, upload } = require('../middlewares/auth');
  const { createCategory, getCategories, getCategoryBySlug, updateCategory, deleteCategory } = require('../controllers/category.controllers');
  router.get('/', getCategories);
  router.get('/slug/:slug', getCategoryBySlug);
  router.post('/', authMiddleware, restrictTo('admin'), upload({ field: 'image' }), createCategory);
  router.put('/:id', authMiddleware, restrictTo('admin'), upload({ field: 'image' }), updateCategory);
  router.delete('/:id', authMiddleware, restrictTo('admin'), deleteCategory);

  module.exports = router;