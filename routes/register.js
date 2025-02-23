const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Regular expressions for validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

// Register Page (GET Request)
router.get('/', (req, res) => {
    res.render('register', {
        title: 'Register',
        error: null // Pass any error message if there is one
    });
});

// Handle Register Form Submission (POST Request)
router.post('/', (req, res) => {
    const { full_name, username, email, phone, password, confirm_password } = req.body;

    // Check if all required fields are provided
    if (!full_name || !username || !email || !phone || !password || !confirm_password) {
        return res.render('register', { title: 'Register', error: "All fields are required!" });
    }

    // Validate Username
    if (username.length < 3) {
        return res.render('register', { title: 'Register', error: "Username must be at least 3 characters long!" });
    }

    // Validate Email
    if (!emailRegex.test(email)) {
        return res.render('register', { title: 'Register', error: "Invalid email format!" });
    }

    // Validate Phone Number
    if (!phoneRegex.test(phone)) {
        return res.render('register', { title: 'Register', error: "Invalid phone number format!" });
    }

    // Validate Password
    if (!passwordRegex.test(password)) {
        return res.render('register', {
            title: 'Register',
            error: "Password must be:<br>- At least 8 characters long<br>- Include an uppercase letter<br>- Include a lowercase letter<br>- Include a number<br>- Include a special character (@$!%*?&)"
        });
    }

    // Validate Passwords Match
    if (password !== confirm_password) {
        return res.render('register', { title: 'Register', error: "Passwords do not match!" });
    }

    // Hash the password before saving to DB
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if the username already exists
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.render('register', { title: 'Register', error: "Database error!" });
        }

        if (user) {
            return res.render('register', { title: 'Register', error: "Username already exists!" });
        }

        // Insert the new user into the database
        const insertUserQuery = "INSERT INTO users (full_name, username, password, phone) VALUES (?, ?, ?, ?)";
        db.run(insertUserQuery, [full_name, username, hashedPassword, phone], function (err) {
            if (err) {
                return res.render('register', { title: 'Register', error: "Failed to register user!" });
            }

            const userId = this.lastID; // Get the last inserted user ID

            // Insert email into email_accounts table
            const insertEmailQuery = "INSERT INTO email_accounts (email_address, user_id) VALUES (?, ?)";
            db.run(insertEmailQuery, [email, userId], (err) => {
                if (err) {
                    console.error("Failed to insert email:", err.message);
                    return res.render('register', { title: 'Register', error: "User created, but email registration failed!" });
                }

                // Store user in session so they are logged in
                req.session.user = { id: userId, username: username };

                // Redirect user to login page
                res.redirect('/login');
            });
        });
    });
});

module.exports = router;
