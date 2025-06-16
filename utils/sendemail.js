const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, text) => {
  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.ADMIN_EMAIL || "kadavp0@gmail.com",
        pass: process.env.ADMIN_EMAIL_PASSWORD || "zwijegdpalowrxse",
      },
    });

    // Email options
    const mailOptions = {
      from: `"Raychem RPG Contact Form" <${process.env.ADMIN_EMAIL || "kadavp0@gmail.com"}>`,
      to,
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;