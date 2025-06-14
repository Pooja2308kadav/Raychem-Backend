const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { authMiddleware, restrictTo } = require('../middlewares/auth');
const { createCertification, getCertifications, getCertificationBySlug, getCertificationFile, updateCertification, deleteCertification } = require('../controllers/certification.controller')  ;

// Apply express-fileupload middleware to routes that handle file uploads
router.use(fileUpload());

router.get('/', getCertifications);
router.get('/slug/:slug', getCertificationBySlug);
router.get('/file/:id', getCertificationFile);
router.post('/', authMiddleware, restrictTo('admin'), createCertification);
router.put('/:id', authMiddleware, restrictTo('admin'), updateCertification);
router.delete('/:id', authMiddleware, restrictTo('admin'), deleteCertification);

module.exports = router;