const slugify = require('slugify');
const Certification = require('../models/Certifications.model');
const path = require('path');
const fs = require('fs');

const createCertification = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    const file = req.files.file;
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existingCertification = await Certification.findOne({ slug });
    if (existingCertification) {
      return res.status(400).json({ message: 'Certification with this name already exists' });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join('uploads', fileName);
    await file.mv(filePath);

    const certification = new Certification({ name, slug, description, filePath });
    await certification.save();
    res.status(201).json(certification);
  } catch (err) {
    console.error('Error in createCertification:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (err) {
    console.error('Error in getCertifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCertificationBySlug = async (req, res) => {
  try {
    const certification = await Certification.findOne({ slug: req.params.slug });
    if (!certification) return res.status(404).json({ message: 'Certification not found' });
    res.json(certification);
  } catch (err) {
    console.error('Error in getCertificationBySlug:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCertificationFile = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification not found' });

    const filePath = path.resolve(certification.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error('Error in getCertificationFile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCertification = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;
    let filePath;

    if (req.files && req.files.file) {
      const file = req.files.file;
      if (file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: 'Only PDF files are allowed' });
      }
      const fileName = `${Date.now()}-${file.name}`;
      filePath = path.join('uploads', fileName);
      await file.mv(filePath);
    }

    if (slug) {
      const existingCertification = await Certification.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingCertification) {
        return res.status(400).json({ message: 'Certification with this name already exists' });
      }
    }

    const updates = {};
    if (name) updates.name = name;
    if (slug) updates.slug = slug;
    if (description) updates.description = description;
    if (filePath) updates.filePath = filePath;

    const certification = await Certification.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!certification) return res.status(404).json({ message: 'Certification not found' });
    res.json(certification);
  } catch (err) {
    console.error('Error in updateCertification:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification not found' });

    // Delete the file from the filesystem
    if (certification.filePath && fs.existsSync(certification.filePath)) {
      await fs.promises.unlink(certification.filePath);
    }

    res.json({ message: 'Certification deleted' });
  } catch (err) {
    console.error('Error in deleteCertification:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createCertification, getCertifications, getCertificationBySlug, getCertificationFile, updateCertification, deleteCertification };