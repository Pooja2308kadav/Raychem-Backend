// const path = require('path'); // Add this to work with file paths
// const slugify = require('slugify');
// const Product = require('../models/Product.model');
// const Category = require('../models/Category.model');
// const Subcategory = require('../models/Subcategory.model');
// const Brand = require('../models/Brand.model');

// const createProduct = async (req, res) => {
//   try {
//     const { name, categoryId, subcategoryId, brandId, description } = req.body;

//     if (!categoryId || !subcategoryId || !brandId) {
//       return res.status(400).json({ message: 'categoryId, subcategoryId, and brandId are required' });
//     }

//     const category = await Category.findById(categoryId);
//     if (!category) return res.status(400).json({ message: 'Invalid categoryId' });

//     const subcategory = await Subcategory.findById(subcategoryId);
//     if (!subcategory) return res.status(400).json({ message: 'Invalid subcategoryId' });

//     const brand = await Brand.findById(brandId);
//     if (!brand) return res.status(400).json({ message: 'Invalid brandId' });

//     const slug = slugify(name, { lower: true, strict: true });
//     const existingProduct = await Product.findOne({ slug });
//     if (existingProduct) {
//       return res.status(400).json({ message: 'Product with this name already exists' });
//     }

//     // Store relative image paths
//     const imagePaths = req.files ? req.files.map(file => `uploads/${path.basename(file.path)}`) : [];

//     const product = new Product({
//       name,
//       slug,
//       categoryId,
//       subcategoryId,
//       brandId,
//       imagePaths,
//       description,
//     });

//     await product.save();
//     res.status(201).json(product);
//   } catch (err) {
//     console.error('Error in createProduct:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getProducts = async (req, res) => {
//   try {
//     const { categoryId, subcategoryId, brandId } = req.query;
//     const query = {};
//     if (categoryId) query.categoryId = categoryId;
//     if (subcategoryId) query.subcategoryId = subcategoryId;
//     if (brandId) query.brandId = brandId;

//     const products = await Product.find(query)
//       .populate('categoryId')
//       .populate('subcategoryId')
//       .populate('brandId');

//     res.json(products);
//   } catch (err) {
//     console.error('Error in getProducts:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getProductBySlug = async (req, res) => {
//   try {
//     const product = await Product.findOne({ slug: req.params.slug })
//       .populate('categoryId')
//       .populate('subcategoryId')
//       .populate('brandId');

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.json(product);
//   } catch (err) {
//     console.error('Error in getProductBySlug:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     const { name, categoryId, subcategoryId, brandId, description, imagesToKeep } = req.body;
//     const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;

//     if (categoryId) {
//       const category = await Category.findById(categoryId);
//       if (!category) return res.status(400).json({ message: 'Invalid categoryId' });
//     }

//     if (subcategoryId) {
//       const subcategory = await Subcategory.findById(subcategoryId);
//       if (!subcategory) return res.status(400).json({ message: 'Invalid subcategoryId' });
//     }

//     if (brandId) {
//       const brand = await Brand.findById(brandId);
//       if (!brand) return res.status(400).json({ message: 'Invalid brandId' });
//     }

//     if (slug) {
//       const existingProduct = await Product.findOne({ slug, _id: { $ne: req.params.id } });
//       if (existingProduct) {
//         return res.status(400).json({ message: 'Product with this name already exists' });
//       }
//     }

//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     // Handle image removal
//     if (imagesToKeep) {
//       const imagesToKeepArray = JSON.parse(imagesToKeep);
//       const imagesToRemove = product.imagePaths.filter(path => !imagesToKeepArray.includes(path));
//       const fs = require('fs').promises;
//       for (const imagePath of imagesToRemove) {
//         // Since imagePath is now relative (e.g., uploads/filename.jpg), resolve it to the full path for deletion
//         const fullPath = path.join(__dirname, '..', imagePath);
//         await fs.unlink(fullPath).catch(err => console.error(`Failed to delete image ${fullPath}:`, err));
//       }
//       product.imagePaths = imagesToKeepArray;
//     }

//     const updates = {};
//     if (name) updates.name = name;
//     if (slug) updates.slug = slug;
//     if (categoryId) updates.categoryId = categoryId;
//     if (subcategoryId) updates.subcategoryId = subcategoryId;
//     if (brandId) updates.brandId = brandId;
//     if (description) updates.description = description;

//     if (req.files && req.files.length > 0) {
//       // Store relative paths for new images
//       const newImagePaths = req.files.map(file => `uploads/${path.basename(file.path)}`);
//       updates.imagePaths = [...(product.imagePaths || []), ...newImagePaths];
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, { new: true })
//       .populate('categoryId')
//       .populate('subcategoryId')
//       .populate('brandId');
//     res.json(updatedProduct);
//   } catch (err) {
//     console.error('Error in updateProduct:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     // Delete associated images
//     if (product.imagePaths && product.imagePaths.length > 0) {
//       const fs = require('fs').promises;
//       for (const imagePath of product.imagePaths) {
//         // Since imagePath is now relative (e.g., uploads/filename.jpg), resolve it to the full path for deletion
//         const fullPath = path.join(__dirname, '..', imagePath);
//         await fs.unlink(fullPath).catch(err => console.error(`Failed to delete image ${fullPath}:`, err));
//       }
//     }

//     res.json({ message: 'Product deleted' });
//   } catch (err) {
//     console.error('Error in deleteProduct:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { createProduct, getProducts, getProductBySlug, updateProduct, deleteProduct };

const path = require('path');
const slugify = require('slugify');
const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const Subcategory = require('../models/Subcategory.model');
const Brand = require('../models/Brand.model');

const createProduct = async (req, res) => {
  try {
    const { name, categoryId, subcategoryId, brandId, description, shortDescription, keyFeatures, specifications } = req.body;

    if (!categoryId || !subcategoryId || !brandId) {
      return res.status(400).json({ message: 'categoryId, subcategoryId, and brandId are required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: 'Invalid categoryId' });

    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) return res.status(400).json({ message: 'Invalid subcategoryId' });

    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(400).json({ message: 'Invalid brandId' });

    const slug = slugify(name, { lower: true, strict: true });
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this name already exists' });
    }

    // Store relative image paths
    const imagePaths = req.files.images ? req.files.images.map(file => `uploads/${path.basename(file.path)}`) : [];

    // Store datasheet path
    const datasheetPath = req.files.datasheet ? `uploads/${path.basename(req.files.datasheet[0].path)}` : null;

    // Parse specifications if provided
    const parsedSpecifications = specifications ? JSON.parse(specifications) : {};

    // Parse keyFeatures if provided
    const parsedKeyFeatures = keyFeatures ? JSON.parse(keyFeatures) : [];

    const product = new Product({
      name,
      slug,
      categoryId,
      subcategoryId,
      brandId,
      description,
      shortDescription,
      keyFeatures: parsedKeyFeatures,
      datasheet: datasheetPath,
      specifications: parsedSpecifications,
      imagePaths,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error in createProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, categoryId, subcategoryId, brandId, description, shortDescription, keyFeatures, specifications, imagesToKeep } = req.body;
    const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) return res.status(400).json({ message: 'Invalid categoryId' });
    }

    if (subcategoryId) {
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) return res.status(400).json({ message: 'Invalid subcategoryId' });
    }

    if (brandId) {
      const brand = await Brand.findById(brandId);
      if (!brand) return res.status(400).json({ message: 'Invalid brandId' });
    }

    if (slug) {
      const existingProduct = await Product.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this name already exists' });
      }
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Handle image removal
    if (imagesToKeep) {
      const imagesToKeepArray = JSON.parse(imagesToKeep);
      const imagesToRemove = product.imagePaths.filter(path => !imagesToKeepArray.includes(path));
      const fs = require('fs').promises;
      for (const imagePath of imagesToRemove) {
        const fullPath = path.join(__dirname, '..', imagePath);
        await fs.unlink(fullPath).catch(err => console.error(`Failed to delete image ${fullPath}:`, err));
      }
      product.imagePaths = imagesToKeepArray;
    }

    // Handle new images
    if (req.files.images && req.files.images.length > 0) {
      const newImagePaths = req.files.images.map(file => `uploads/${path.basename(file.path)}`);
      product.imagePaths = [...(product.imagePaths || []), ...newImagePaths];
    }

    // Handle datasheet upload
    if (req.files.datasheet) {
      // Delete old datasheet if it exists
      if (product.datasheet) {
        const oldDatasheetPath = path.join(__dirname, '..', product.datasheet);
        await require('fs').promises.unlink(oldDatasheetPath).catch(err => console.error(`Failed to delete datasheet ${oldDatasheetPath}:`, err));
      }
      product.datasheet = `uploads/${path.basename(req.files.datasheet[0].path)}`;
    }

    const updates = {};
    if (name) updates.name = name;
    if (slug) updates.slug = slug;
    if (categoryId) updates.categoryId = categoryId;
    if (subcategoryId) updates.subcategoryId = subcategoryId;
    if (brandId) updates.brandId = brandId;
    if (description) updates.description = description;
    if (shortDescription) updates.shortDescription = shortDescription;
    if (keyFeatures) updates.keyFeatures = JSON.parse(keyFeatures);
    if (specifications) updates.specifications = JSON.parse(specifications);
    if (product.imagePaths) updates.imagePaths = product.imagePaths;
    if (product.datasheet) updates.datasheet = product.datasheet;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('categoryId')
      .populate('subcategoryId')
      .populate('brandId');
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error in updateProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Existing getProducts, getProductBySlug, and deleteProduct remain unchanged
const getProducts = async (req, res) => {
  try {
    const { categoryId, subcategoryId, brandId } = req.query;
    const query = {};
    if (categoryId) query.categoryId = categoryId;
    if (subcategoryId) query.subcategoryId = subcategoryId;
    if (brandId) query.brandId = brandId;

    const products = await Product.find(query)
      .populate('categoryId')
      .populate('subcategoryId')
      .populate('brandId');

    res.json(products);
  } catch (err) {
    console.error('Error in getProducts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('categoryId')
      .populate('subcategoryId')
      .populate('brandId');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error in getProductBySlug:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete associated images and datasheet
    if (product.imagePaths && product.imagePaths.length > 0) {
      const fs = require('fs').promises;
      for (const imagePath of product.imagePaths) {
        const fullPath = path.join(__dirname, '..', imagePath);
        await fs.unlink(fullPath).catch(err => console.error(`Failed to delete image ${fullPath}:`, err));
      }
    }
    if (product.datasheet) {
      const datasheetPath = path.join(__dirname, '..', product.datasheet);
      await fs.unlink(datasheetPath).catch(err => console.error(`Failed to delete datasheet ${datasheetPath}:`, err));
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error in deleteProduct:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProduct, getProducts, getProductBySlug, updateProduct, deleteProduct };