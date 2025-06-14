const path = require('path');
const slugify = require('slugify');
const Subcategory = require('../models/Subcategory.model');
const Category = require('../models/Category.model'); // Add this import

const createSubcategory = async (req, res) => {
  try {
    const { name, categoryId, description } = req.body;
    if (!categoryId) {
      return res.status(400).json({ message: 'categoryId is required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid categoryId' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existingSubcategory = await Subcategory.findOne({ slug });
    if (existingSubcategory) {
      return res.status(400).json({ message: 'Subcategory with this name already exists' });
    }

    // const imagePath = req.file ? req.file.path : undefined;
        const imagePath = req.file ? `uploads/${path.basename(req.file.path)}` : undefined;
    
    const subcategory = new Subcategory({ name, slug, categoryId, imagePath, description });
    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    console.error('Error in createSubcategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Other functions remain unchanged
const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const query = categoryId ? { categoryId } : {};
    const subcategories = await Subcategory.find(query).populate('categoryId');
    res.json(subcategories);
  } catch (err) {
    console.error('Error in getSubcategories:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubcategoryBySlug = async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ slug: req.params.slug }).populate('categoryId');
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(subcategory);
  } catch (err) {
    console.error('Error in getSubcategoryBySlug:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { name, categoryId, description } = req.body;
    const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;
    // const imagePath = req.file ? req.file.path : undefined;
        const imagePath = req.file ? `uploads/${path.basename(req.file.path)}` : undefined;
    

    if (slug) {
      const existingSubcategory = await Subcategory.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingSubcategory) {
        return res.status(400).json({ message: 'Subcategory with this name already exists' });
      }
    }

    const updates = {};
    if (name) updates.name = name;
    if (slug) updates.slug = slug;
    if (categoryId) updates.categoryId = categoryId;
    if (description) updates.description = description;
    if (imagePath) updates.imagePath = imagePath;

    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(subcategory);
  } catch (err) {
    console.error('Error in updateSubcategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    res.json({ message: 'Subcategory deleted' });
  } catch (err) {
    console.error('Error in deleteSubcategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createSubcategory, getSubcategories, getSubcategoryBySlug, updateSubcategory, deleteSubcategory };