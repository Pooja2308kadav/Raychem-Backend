const Enquiry = require('../models/Enquiry.model');
const Product = require('../models/Product.model');

const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'name, email, phone, and message are required' });
    }

    // Create enquiry without userId for general contact form
    const enquiry = new Enquiry({ name, email, phone, message });
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (err) {
    console.error('Error in createEnquiry:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createEnquiryFromCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if the request is for bulk enquiries (has 'enquiries' array)
    if (req.body.enquiries && Array.isArray(req.body.enquiries)) {
      const enquiriesData = req.body.enquiries;

      // Validate that the enquiries array is not empty
      if (enquiriesData.length === 0) {
        return res.status(400).json({ message: 'Enquiries array cannot be empty' });
      }

      // Validate each enquiry in the array
      const requiredFields = ['productId', 'name', 'email', 'phone', 'message'];
      for (let i = 0; i < enquiriesData.length; i++) {
        const enquiry = enquiriesData[i];
        const missingFields = requiredFields.filter(field => !enquiry[field]);
        if (missingFields.length > 0) {
          return res.status(400).json({
            message: `Missing required fields in enquiry at index ${i}: ${missingFields.join(', ')}`
          });
        }
      }

      // Validate all productIds in a single query
      const productIds = enquiriesData.map(enquiry => enquiry.productId);
      const products = await Product.find({ _id: { $in: productIds } });
      const foundProductIds = products.map(product => product._id.toString());
      const invalidProductIds = productIds.filter(id => !foundProductIds.includes(id));

      if (invalidProductIds.length > 0) {
        return res.status(404).json({
          message: `Products not found for the following IDs: ${invalidProductIds.join(', ')}`
        });
      }

      // Prepare enquiries for bulk insertion
      const enquiriesToSave = enquiriesData.map(enquiry => ({
        userId,
        productId: enquiry.productId,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        message: enquiry.message,
        status: 'pending'
      }));

      // Bulk insert all enquiries
      const createdEnquiries = await Enquiry.insertMany(enquiriesToSave);

      // Populate productId for the response
      await Enquiry.populate(createdEnquiries, { path: 'productId' });

      res.status(201).json(createdEnquiries);
    } else {
      // Handle single enquiry (existing logic)
      const { productId, name, email, phone, message } = req.body;

      if (!productId || !name || !email || !phone || !message) {
        return res.status(400).json({ message: 'productId, name, email, phone, and message are required' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const enquiry = new Enquiry({ userId, productId, name, email, phone, message });
      await enquiry.save();
      await enquiry.populate('productId');
      res.status(201).json(enquiry);
    }
  } catch (err) {
    console.error('Error in createEnquiryFromCart:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserEnquiries = async (req, res) => {
  try {
    const userId = req.user.id;
    const enquiries = await Enquiry.find({ userId }).populate('productId');
    res.status(200).json(enquiries);
  } catch (err) {
    console.error('Error in getUserEnquiries:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEnquiriesFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const enquiries = await Enquiry.find({
      userId,
      productId: { $ne: null }
    })
      .populate('productId')
      .populate('userId', 'email');
    console.log('Cart enquiries:', enquiries);
    res.status(200).json(enquiries);
  } catch (err) {
    console.error('Error in getEnquiriesFromCart:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('userId', 'email')
      .populate('productId')
      .sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (err) {
    console.error('Error in getAllEnquiries:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEnquiryStatus = async (req, res) => {
  try {
    const { enquiryId, status } = req.body;

    if (!enquiryId || !status) {
      return res.status(400).json({ message: 'enquiryId and status are required' });
    }

    if (!['pending', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    enquiry.status = status;
    enquiry.updatedAt = Date.now();
    await enquiry.save();
    await enquiry.populate('productId');
    res.status(200).json(enquiry);
  } catch (err) {
    console.error('Error in updateEnquiryStatus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createEnquiry, createEnquiryFromCart, getUserEnquiries, getEnquiriesFromCart, getAllEnquiries, updateEnquiryStatus };