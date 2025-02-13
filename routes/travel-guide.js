
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    db.all('SELECT * FROM blog_posts', (err, blogPosts) => {  // Replace with your actual DB query
        if (err) {
          console.error(err);
          return res.status(500).send('Database error');
        }
        res.render('travel-guide.ejs', { blogPosts: blogPosts });
      });
    });

module.exports = router;
