const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const query = `
        SELECT reviews.id, users.full_name, reviews.profile_img, 
               reviews.trip_title, reviews.rating, reviews.review_text
        FROM reviews
        JOIN users ON reviews.user_id = users.user_id
        ORDER BY reviews.created_at DESC;
    `;

    global.db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;
