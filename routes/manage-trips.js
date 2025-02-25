const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const userId = 1; 

    // Query for upcoming trips
    let sqlUpcoming = `SELECT * FROM upcoming_trips WHERE user_id = ? ORDER BY trip_start_date ASC`;

    // Query for past trips
    let sqlPast = `SELECT * FROM past_trips WHERE user_id = ? ORDER BY trip_end_date DESC`;

    // Query for liked trips
    let sqlLiked = `
        SELECT bp.post_id, bp.title, bp.content, bp.country, bpi.image_path
        FROM blog_posts AS bp
        LEFT JOIN blog_post_images AS bpi ON bp.post_id = bpi.post_id
        LEFT JOIN blog_post_likes AS likes ON bp.post_id = likes.post_id
        WHERE likes.user_id = ?
        GROUP BY bp.post_id;
    `;

    // Fetch upcoming trips
    db.all(sqlUpcoming, [userId], (err, upcomingTrips) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Database error");
        }

        // Fetch past trips
        db.all(sqlPast, [userId], (err, pastTrips) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send("Database error");
            }

            // Fetch liked trips
            db.all(sqlLiked, [userId], (err, likedTrips) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).send("Database error");
                }

                res.render("manage-trips.ejs", { 
                    upcomingTrips, 
                    pastTrips, 
                    likedTrips 
                });
            });
        });
    });
});

module.exports = router;
