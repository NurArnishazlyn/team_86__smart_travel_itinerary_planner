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

router.get('/:postId', (req, res) => {
  const postId = req.params.postId;
  const sql = `SELECT * FROM blog_posts WHERE post_id = ${postId}`; // SQL with parameterization

  db.get(sql, (err, post) => { // Use db.get for single row result
      if (err) {
          console.error(err);
          return res.status(500).send('Database error');
      }
      if (!post) {   // Handle case where no post is found
          return res.status(404).render('guides-details.ejs', { post: null }); // Or redirect, as needed
      }
      res.render('guides-details.ejs', { post: post });
  });
});

module.exports = router;

