const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images'); // Uploads will be stored in 'public/uploads'
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


router.get('/create-post', (req, res) => {
  

  res.render('create-post.ejs', { user: req.session.user });
});

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
    SELECT bp.post_id, bp.title, bp.content, bp.country, bpi.image_path, u.username,
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
      return res.status(404).send('Post not found'); // Changed to 404
    } else {
      console.log(post.image_path);
      //post.post_id is needed
      console.log(post.post_id);
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


// New route for adding a comment to a post
router.post('/:id/comment', (req, res) => {
  const postId = req.params.id;
  const userId = req.session.user?.id; // Get the user ID from the session
  const commentText = `<b>${req.session.user?.username}:</b> ${req.body.comment}`;

  console.log("userId: ", userId);
  console.log("postId: ", postId);
  console.log("commentText: ", commentText);

  if (!userId) {
      return res.status(401).send('Unauthorized: User not logged in');
  }
  if (!commentText || commentText.trim() === "") {
    return res.status(400).send("Bad request: comment can not be empty");
  }

  // Insert the comment into the blog_post_comments table
  db.run('INSERT INTO blog_post_comments (post_id, user_id, comment_text) VALUES (?, ?, ?)', [postId, userId, commentText], function (err) {
      if (err) {
          console.error(err);
          return res.status(500).send('Database error');
      }

      //Get the latest comment id
      const commentId = this.lastID; 

      // Get the username of the comment author
      db.get('SELECT username FROM users WHERE user_id = ?', [userId], (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Database error');
        }
         const username = user.username;
         res.send({ success: true, message: 'Comment added successfully', newComment: { comment_id: commentId, username: username, comment_text: commentText} });
      });
  });
});

router.post('/submit-blog-post', upload.array('image', 10), async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login'); // Redirect if not logged in
    }

    const { title, country, content } = req.body;

    // Get the user ID from the session
    const userId = req.session.user.id;
    const username = req.session.user.username;

    // Insert the new blog post into the database
    const insertPostQuery = `
      INSERT INTO blog_posts (title, country, content, user_id, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    // Use a Promise to handle the asynchronous database operation
    const postResult = await new Promise((resolve, reject) => {
      db.run(insertPostQuery, [title, country, content, userId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID); // Resolve with the newly inserted post_id
        }
      });
    });
    console.log('Blog post inserted:', postResult);

    // Insert each image into the blog_post_images table
    if(req.files && req.files.length > 0){
        const imageInsertPromises = req.files.map((file) => {
          const imagePath = `/images/${file.filename}`;
          const insertImageQuery = `
            INSERT INTO blog_post_images (post_id, image_path)
            VALUES (?, ?)
          `;

          return new Promise((resolve, reject) => {
            db.run(insertImageQuery, [postResult, imagePath], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });

      // Wait for all image inserts to complete
        await Promise.all(imageInsertPromises);
    }


    res.redirect('/travel-guide'); // Redirect to the travel guide page after successful submission
  } catch (error) {
    console.error('Error inserting blog post:', error);
    res.status(500).send('Error creating blog post');
  }
});

module.exports = router;

