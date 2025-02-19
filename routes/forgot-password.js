const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Forgot Password Page (GET)
router.get('/', (req, res) => {
    res.render('forgot-password', {
        title: 'Forgot Password',
        error: null,
        success: null
    });
});

// Handle Forgot Password Form Submission (POST)
router.post('/', (req, res) => {
    const { username, newPassword } = req.body;
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Check if the username exists
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.render('forgot-password', { title: 'Forgot Password', error: "Database error!", success: null });
        }

        if (!user) {
            return res.render('forgot-password', { title: 'Forgot Password', error: "Username not found!", success: null });
        }

        // Update the user's password in the database
        db.run("UPDATE users SET password = ? WHERE username = ?", [hashedPassword, username], (err) => {
            if (err) {
                return res.render('forgot-password', { title: 'Forgot Password', error: "Failed to reset password!", success: null });
            }
            res.render('forgot-password', { title: 'Forgot Password', error: null, success: "Password reset successfully! You can now log in with your new password." });
        });
    });
});

module.exports = router;
