// const express = require('express');
// const router = express.Router();
// const { authMiddleware, restrictTo, upload } = require('../middlewares/auth');
// const { createProduct, getProducts, getProductBySlug, updateProduct, deleteProduct } = require('../controllers/product.controller');

// router.get('/', getProducts);
// router.get('/slug/:slug', getProductBySlug);
// router.post('/', authMiddleware, restrictTo('admin'), upload({ multiple: true, field: 'images', maxCount: 5 }), createProduct);
// router.put('/:id', authMiddleware, restrictTo('admin'), upload({ multiple: true, field: 'images', maxCount: 5 }), updateProduct);
// router.delete('/:id', authMiddleware, restrictTo('admin'), deleteProduct);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { authMiddleware, restrictTo, upload } = require('../middlewares/auth');
const { createProduct, getProducts, getProductBySlug, updateProduct, deleteProduct } = require('../controllers/product.controller');

// Define upload fields for images and datasheet
const uploadFields = upload({
  fields: [
    { name: 'images', maxCount: 5 },
    { name: 'datasheet', maxCount: 1 },
  ],
});

router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.post('/', authMiddleware, restrictTo('admin'), uploadFields, createProduct);
router.put('/:id', authMiddleware, restrictTo('admin'), uploadFields, updateProduct);
router.delete('/:id', authMiddleware, restrictTo('admin'), deleteProduct);

module.exports = router;