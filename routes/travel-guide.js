const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const userId = req.session.user?.id; // Get the user ID, if logged in

  let sql = `
    SELECT bp.post_id, bp.title, bp.content, bp.country, bpi.image_path, u.username, 
           COUNT(DISTINCT likes.user_id) AS like_count,
           COUNT(DISTINCT comments.comment_id) AS comment_count,
           CASE WHEN user_likes.user_id IS NOT NULL THEN 1 ELSE 0 END AS user_liked
    FROM blog_posts AS bp
    LEFT JOIN blog_post_images AS bpi ON bp.post_id = bpi.post_id
    LEFT JOIN users AS u ON bp.user_id = u.user_id
    LEFT JOIN blog_post_likes AS likes ON bp.post_id = likes.post_id
    LEFT JOIN blog_post_comments AS comments ON bp.post_id = comments.post_id
    LEFT JOIN blog_post_likes AS user_likes ON bp.post_id = user_likes.post_id AND user_likes.user_id = ? 
    GROUP BY bp.post_id, bp.title, bp.content, bp.country, bpi.image_path, u.username
    `;

  const country = req.query.country;
  const queryParams = [userId]; // Parameters for the SQL query

  if (country && country !== 'All') {
    sql += ` HAVING bp.country = ?`; // Modify the condition to use HAVING
    queryParams.push(country);
  }
  console.log(sql);
  console.log(queryParams);

  db.all(sql, queryParams, (err, blogPosts) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    // Add the liked property to all posts even if there is no user connected
    blogPosts.forEach((post) => {
        post.liked = post.user_liked === 1;
    });

    res.render('travel-guide.ejs', { blogPosts: blogPosts, user: req.session.user });
  });
});



router.get('/:id', (req, res) => {
  const postId = req.params.id;
  let sql = `
    SELECT bp.title, bp.content, bp.country, bpi.image_path, u.username,
           group_concat(c.comment_text, '<br>') AS comments  -- Concatenate comments
    FROM blog_posts AS bp
    LEFT JOIN blog_post_images AS bpi ON bp.post_id = bpi.post_id
    LEFT JOIN users AS u ON bp.user_id = u.user_id
    LEFT JOIN blog_post_comments AS c ON bp.post_id = c.post_id
    WHERE bp.post_id = ?
    GROUP BY bp.post_id, bp.title, bp.content, bp.country, bpi.image_path, u.username`;


  

  db.get(sql, [postId], (err, post) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    } else if (!post) {
      // ... handle post not found
    } else {
      console.log(post.image_path);
      res.render('guides-details.ejs', { post: post, user: req.session.user });
    }
  });
});


router.post('/:id/like', (req, res) => {
  const postId = req.params.id;
  const user = req.session.user;
  const userId = req.session.user.id; // Get the user ID from the session
  console.log(userId);
  console.log(postId);
  console.log(user);



  if (!userId) {
    return res.status(401).send('Unauthorized: User not logged in');
  }

  // Check if the user has already liked the post
  db.get('SELECT * FROM blog_post_likes WHERE post_id = ? AND user_id = ?', [postId, userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    if (row) {
      // User has already liked the post, so unlike it (remove the like)
      db.run('DELETE FROM blog_post_likes WHERE post_id = ? AND user_id = ?', [postId, userId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Database error');
        }
        res.send({ liked: false }); // Send back that it's now unliked
      });
    } else {
      // User has not liked the post, so like it (add a like)
      db.run('INSERT INTO blog_post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Database error');
        }
        res.send({ liked: true }); // Send back that it's now liked
      });
    }
  });
});

module.exports = router;

