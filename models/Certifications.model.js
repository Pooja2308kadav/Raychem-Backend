const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  filePath: { type: String }, // Changed from imagePath to filePath for PDFs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certification', certificationSchema);