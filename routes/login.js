// routes/login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Login Page (GET Request)
router.get('/', (req, res) => {
    res.render('login', {
        title: 'Login',
        error: null // To pass any error message if there is one
    });
});

// Handle Login Form Submission (POST Request)
router.post('/', (req, res) => {
    const { username, password } = req.body; // Destructure the data from the form

    // Query the database to find the user by username
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.render('login', { title: 'Login', error: "Database error!" });
        }

        // If no user is found or password is incorrect
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.render('login', { title: 'Login', error: "Invalid username or password!" });
        }

        // Store user session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        
        res.redirect('/'); // Redirect to the home page after successful login
    });
});

module.exports = router;
