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

    // Here, you can save the message to a database or send an email
    console.log(`New Contact Message: Name: ${name}, Email: ${email}, Message: ${message}`);

    res.render('contact', { title: "Contact Us", success: "Your message has been sent!", error: null });
});

module.exports = router;
