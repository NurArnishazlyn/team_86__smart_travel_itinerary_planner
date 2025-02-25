const express = require('express');
const router = express.Router();

// Route for /hotels
router.get('/', (req, res) => {
    res.render('hotels'); // This will render hotels.ejs
});

module.exports = router;