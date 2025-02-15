
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM blog_posts';
  const country = req.query.country; // Get the country from the query parameter

  if (country && country !== 'All') {  // Add filtering only if a country is selected and not 'All'
    sql += ` WHERE country = '${country}'`;
  }

  db.all(sql, (err, blogPosts) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.render('travel-guide.ejs', { blogPosts: blogPosts });
  });
});


module.exports = router;

