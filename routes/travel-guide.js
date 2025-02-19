const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  let sql = `
    SELECT bp.post_id, bp.title, bp.content, bp.country, bpi.image_path, u.username, 
           COUNT(DISTINCT likes.user_id) AS like_count,
           COUNT(DISTINCT comments.comment_id) AS comment_count  -- Count comments
    FROM blog_posts AS bp
    LEFT JOIN blog_post_images AS bpi ON bp.post_id = bpi.post_id
    LEFT JOIN users AS u ON bp.user_id = u.user_id
    LEFT JOIN blog_post_likes AS likes ON bp.post_id = likes.post_id
    LEFT JOIN blog_post_comments AS comments ON bp.post_id = comments.post_id -- Join with comments table
    GROUP BY bp.post_id, bp.title, bp.content, bp.country, bpi.image_path, u.username`;


  const country = req.query.country;

  if (country && country !== 'All') {
    sql += ` WHERE bp.country = '${country}'`;
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

