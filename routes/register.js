// routes/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Register Page (GET Request)
router.get('/', (req, res) => {
    res.render('register', {
        title: 'Register',
        error: null // To pass any error message if there is one
    });
});

// Handle Register Form Submission (POST Request)
router.post('/', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password before saving to DB

    // Check if the username already exists in the database
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.render('register', { title: 'Register', error: "Database error!" });
        }

        if (user) {
            return res.render('register', { title: 'Register', error: "Username already exists!" });
        }

        // Insert the new user into the database
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
            if (err) {
                return res.render('register', { title: 'Register', error: "Failed to register user!" });
            }
            res.redirect('/login'); // Redirect to login page after successful registration
        });
    });
});

module.exports = router;
