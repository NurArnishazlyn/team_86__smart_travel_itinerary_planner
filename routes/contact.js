const express = require('express');
const router = express.Router();

// Contact Page (GET Request)
router.get('/', (req, res) => {
    res.render('contact', { title: "Contact Us", success: null, error: null });
});

// Handle Contact Form Submission (POST Request)
router.post('/', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.render('contact', { title: "Contact Us", success: null, error: "All fields are required!" });
    }

    // Insert the contact message into the database.
    global.db.run(
        "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
        [name, email, message],
        function(err) {
            if (err) {
                console.error("Failed to save contact message:", err);
                return res.render('contact', { title: "Contact Us", success: null, error: "Failed to send message. Please try again later." });
            } else {
                console.log(`New Contact Message: Name: ${name}, Email: ${email}, Message: ${message}`);
                return res.render('contact', { title: "Contact Us", success: "Your message has been sent!", error: null });
            }
        }
    );
});

module.exports = router;
