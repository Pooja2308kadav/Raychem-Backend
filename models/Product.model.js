// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   slug: { type: String, required: true, unique: true },
//   categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
//   subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
//   brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
//   description: { type: String },
//   imagePaths: [{ type: String }], // Changed to array for multiple images
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Product', productSchema);



const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  description: { type: String },
  shortDescription: { type: String }, // Added for short description
  keyFeatures: [{ type: String }], // Array for key features
  datasheet: { type: String }, // Path to datasheet file
  specifications: { type: Map, of: String }, // Key-value pairs for specifications
  imagePaths: [{ type: String }], // Existing field for multiple images
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);