const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Generates a secure token
const nodemailer = require('nodemailer'); // Sends emails
const router = express.Router();

// Forgot Password Page (GET)
router.get('/', (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password', error: null, success: null });
});

// Handle Forgot Password Request (POST)
router.post('/', (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) {
            return res.render('forgot-password', { title: 'Forgot Password', error: "Database error!", success: null });
        }

        if (!user) {
            return res.render('forgot-password', { title: 'Forgot Password', error: "Email not found!", success: null });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

        // Store the token in the database
        db.run("UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?", [resetToken, tokenExpiration, email], (err) => {
            if (err) {
                return res.render('forgot-password', { title: 'Forgot Password', error: "Failed to generate reset link!", success: null });
            }

            // Send reset email
            const resetLink = `http://localhost:3000/forgot-password/${resetToken}`;
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'your_email@gmail.com', // Replace with your email
                    pass: 'your_email_password'  // Use environment variables for security
                }
            });

            const mailOptions = {
                from: 'your_email@gmail.com',
                to: email,
                subject: 'Password Reset',
                text: `Click the link to reset your password: ${resetLink}`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return res.render('forgot-password', { title: 'Forgot Password', error: "Failed to send email!", success: null });
                }
                res.render('forgot-password', { title: 'Forgot Password', error: null, success: "Password reset link sent to your email!" });
            });
        });
    });
});

// Reset Password Page (GET)
router.get('/:token', (req, res) => {
    const { token } = req.params;

    db.get("SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?", [token, Date.now()], (err, user) => {
        if (err || !user) {
            return res.render('reset-password', { title: "Reset Password", error: "Invalid or expired token!", success: null });
        }
        res.render('reset-password', { title: "Reset Password", error: null, success: null, token });
    });
});

// Handle Reset Password (POST)
router.post('/:token', (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.render('reset-password', { title: "Reset Password", error: "Passwords do not match!", success: null, token });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
        return res.render('reset-password', { title: "Reset Password", error: "Password does not meet requirements!", success: null, token });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.run("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?", [hashedPassword, token], (err) => {
        if (err) {
            return res.render('reset-password', { title: "Reset Password", error: "Failed to reset password!", success: null });
        }
        res.render('reset-password', { title: "Reset Password", error: null, success: "Password reset successfully! You can now log in." });
    });
});

module.exports = router;
