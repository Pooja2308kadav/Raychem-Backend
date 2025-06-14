const path = require('path'); // Add this to work with file paths
const slugify = require('slugify');
const Category = require('../models/Category.model');

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    // Transform the file path to a relative path
    const imagePath = req.file ? `uploads/${path.basename(req.file.path)}` : undefined;
    const category = new Category({ name, slug, imagePath, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Error in createCategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;

    // Transform the file path to a relative path
    const imagePath = req.file ? `uploads/${path.basename(req.file.path)}` : undefined;

    if (slug) {
      const existingCategory = await Category.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }

    const updates = {};
    if (name) updates.name = name;
    if (slug) updates.slug = slug;
    if (description) updates.description = description;
    if (imagePath) updates.imagePath = imagePath;

    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error('Error in updateCategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// The rest of the functions (getCategories, getCategoryBySlug, deleteCategory) remain unchanged
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Error in getCategories:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error('Error in getCategoryBySlug:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Error in deleteCategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createCategory, getCategories, getCategoryBySlug, updateCategory, deleteCategory };