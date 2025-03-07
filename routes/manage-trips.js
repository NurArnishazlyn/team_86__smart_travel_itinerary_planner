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

router.post("/confirm-trip", (req, res) => {
    const { trip_id, user_id, title, destination, trip_start_date, trip_end_date, image_path } = req.body;

    if (!trip_id || !user_id || !title || !destination || !trip_start_date || !trip_end_date) {
        return res.status(400).json({ error: "Missing trip details" });
    }

    // Check if the trip already exists in upcoming_trips
    // const checkSQL = `SELECT * FROM upcoming_trips WHERE trip_id = ? AND user_id = ?`;
    // db.get(checkSQL, [trip_id, user_id], (err, row) => {
    //     if (err) {
    //         return res.status(500).json({ error: "Database query failed." });
    //     }

    //     if (row) {
    //         return res.status(400).json({ error: "Trip is already in upcoming trips." });
    //     }
    const checkSQL = `SELECT COUNT(*) AS count FROM upcoming_trips WHERE trip_id = ? AND user_id = ?`;

    db.get(checkSQL, [trip_id, user_id], (err, row) => {
    if (err) {
        console.error("Database Query Failed:", err);
        return res.status(500).json({ error: "Database query failed." });
    }

    if (row.count > 0) {  // Only block if this specific user already confirmed this trip
        return res.status(400).json({ error: "You have already confirmed this trip." });
    }


        // Insert trip into upcoming_trips with new unique ID
        const insertSQL = `
            INSERT INTO upcoming_trips (trip_id, user_id, title, destination, trip_start_date, trip_end_date, image_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(insertSQL, [trip_id, user_id, title, destination, trip_start_date, trip_end_date, image_path], function (err) {
            if (err) {
                return res.status(500).json({ error: "Failed to insert trip into upcoming trips." });
            }
            return res.json({ success: true, message: "Trip confirmed and added to upcoming trips!" });
        });
    });
});

module.exports = router;
