const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Register Page (GET Request)
router.get('/', (req, res) => {
    res.render('register', {
        title: 'Register',
        error: null
    });
});

// Handle Register Form Submission (POST Request)
router.post('/', (req, res) => {
    const { full_name, username, email, phone, password, confirm_password } = req.body;

    // Check if all required fields are provided
    if (!full_name || !username || !email || !phone || !password || !confirm_password) {
        return res.render('register', { title: 'Register', error: "All fields are required!" });
    }

    // Check if passwords match
    if (password !== confirm_password) {
        return res.render('register', { title: 'Register', error: "Passwords do not match!" });
    }

    // Hash the password before saving to DB
    const hashedPassword = bcrypt.hashSync(password, 10); 

    // Check if the username already exists
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            console.error("Database error:", err);
            return res.render('register', { title: 'Register', error: "Database error!" });
        }

        if (user) {
            return res.render('register', { title: 'Register', error: "Username already exists!" });
        }

        // Insert the user into the database
        const insertUserQuery = "INSERT INTO users (full_name, username, password, phone) VALUES (?, ?, ?, ?)";
        db.run(insertUserQuery, [full_name, username, hashedPassword, phone], function (err) {
            if (err) {
                console.error("Failed to register user:", err.message);
                return res.render('register', { title: 'Register', error: "Failed to register user!" });
            }

            console.log("Inserted user ID:", this.lastID); // Debugging output
            const userId = this.lastID; // Get the user_id of the newly inserted user

            // Insert email into email_accounts table
            const insertEmailQuery = "INSERT INTO email_accounts (email_address, user_id) VALUES (?, ?)";
            db.run(insertEmailQuery, [email, userId], (err) => {
                if (err) {
                    console.error("Failed to insert email:", err.message);
                    return res.render('register', { title: 'Register', error: "User created, but email registration failed!" });
                }

                // Store user in session so they are logged in
                req.session.user = { id: userId, username: username };

                console.log("User registered successfully:", username);
                res.redirect('/'); // Redirect user to home
            });
        });
    });
});

module.exports = router;
