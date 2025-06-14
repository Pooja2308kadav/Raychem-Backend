const Brand = require('../models/Brand.model');

const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ message: 'Brand with this name already exists' });
    }

    const imagePath = req.file ? req.file.path : undefined;
    const brand = new Brand({ name, imagePath });
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    console.error('Error in createBrand:', err); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    console.error('Error in getBrands:', err); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const imagePath = req.file ? req.file.path : undefined;

    if (name) {
      const existingBrand = await Brand.findOne({ name, _id: { $ne: req.params.id } });
      if (existingBrand) {
        return res.status(400).json({ message: 'Brand with this name already exists' });
      }
    }

    const updates = { name };
    if (imagePath) updates.imagePath = imagePath;

    const brand = await Brand.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    console.error('Error in updateBrand:', err); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    console.error('Error in deleteBrand:', err); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBrand, getBrands, updateBrand, deleteBrand };