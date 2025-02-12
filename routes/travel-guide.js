
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('travel-guide', { title: 'Travel Guide' });
});

module.exports = router;
