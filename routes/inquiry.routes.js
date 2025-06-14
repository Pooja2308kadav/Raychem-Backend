const express = require("express");
const router = express.Router();
const Inquiry = require("../models/inquiry.model");
const sendEmail = require("../utils/sendemail");

// POST /inquiries - Create a new inquiry and send email to admin
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    // Create new inquiry
    const inquiry = new Inquiry({
      name,
      email,
      phone,
      message,
    });

    // Save inquiry to database
    await inquiry.save();

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const subject = `New Inquiry from ${name}`;
    const text = `
      New Inquiry Received:
      Name: ${name}
      Email: ${email}
      Phone: ${phone || "Not provided"}
      Message: ${message}
    `;

    await sendEmail(adminEmail, subject, text);

    res.status(201).json({ message: "Inquiry submitted successfully" });
  } catch (error) {
    console.error("Error in inquiry route:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

module.exports = router;