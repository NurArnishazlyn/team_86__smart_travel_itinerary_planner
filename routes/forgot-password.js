const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your email from .env
        pass: process.env.EMAIL_PASS   // Your App Password from .env
    }
});

// Function to send password reset email
async function sendResetEmail(email, resetLink) {
    console.log("📩 Preparing to send email to:", email);
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetLink}`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return false;
    }
}

router.get('/', (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' });
});

// Forgot Password Route
router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    console.log("📩 Sending email to:", email);

    const resetLink = `http://localhost:3000/reset-password?email=${email}`;

    const emailSent = await sendResetEmail(email, resetLink);
    if (emailSent) {
        res.json({ success: "Password reset email sent successfully!" });
    } else {
        res.status(500).json({ error: "Failed to send reset email" });
    }
});

// Export the router
module.exports = router;
