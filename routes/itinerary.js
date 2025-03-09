const express = require("express");
const router = express.Router();


router.get("/:trip_id", (req, res) => {

    if (!req.session.user) {
        console.log("Unauthorized access attempt to itinerary page. Redirecting to login.");
        return res.redirect("/login");
    }

    const tripId = req.params.trip_id;
    const userId = req.session.user.id;

    // Query to get trip details
    const sqlTrip = `SELECT * FROM trips WHERE trip_id = ?`;
    const sqlMembers = `SELECT member_name FROM trip_members WHERE trip_id = ?`;
    const sqlFlight = `SELECT * FROM flights WHERE trip_id = ?`;
    const sqlCityCenter = `SELECT * FROM city_center WHERE trip_id = ?`;
    const sqlRestaurants = `SELECT restaurant_id, name, rating, price, image_path, votes FROM restaurants WHERE trip_id = ?`;
    const sqlHotels = `SELECT * FROM hotels WHERE trip_id = ?`;
    const sqlShopping = `SELECT * FROM shopping WHERE trip_id = ?`;

    db.get(sqlTrip, [tripId], (err, trip) => {
        if (err || !trip) {
            console.error(err);
            return res.status(500).send("Trip not found.");
        }

        db.all(sqlMembers, [tripId], (err, members) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error fetching members.");
            }

            db.get(sqlFlight, [tripId], (err, flight) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error fetching flights.");
                }

                db.get(sqlCityCenter, [tripId], (err, center) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Error fetching city center.");
                    }

                    db.all(sqlRestaurants, [tripId], (err, restaurants) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send("Error fetching restaurants.");
                        }

                        db.all(sqlHotels, [tripId], (err, hotels) => {

                            if (err) {
                                console.error(err);
                                return res.status(500).send("Error fetching hotels.");
                            }

                            console.log("Restaurants Data Sent to Frontend:", restaurants);

                            db.all(sqlShopping, [tripId], (err, shopping) => {

                                if (err) {
                                    console.error(err);
                                    return res.status(500).send("Error fetching shopping.");
                                }

                                res.render("itinerary", { trip, members, flight, center, restaurants, hotels, shopping, user: req.session.user });
                            });
                        });
                    });
                });
            });
        });
    });
});

// API to handle city center votes
router.post("/vote/city-center", (req, res) => {
    console.log("Received POST /vote/city-center request with body:", req.body);

    const { trip_id, voteType } = req.body;

    if (!trip_id || !voteType) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    const column = voteType == "up" ? "upvotes" : "downvotes";

    const updateVoteSQL = `UPDATE city_center SET ${column} = ${column} + 1 WHERE trip_id = ?`;

    db.run(updateVoteSQL, [trip_id], function (err) {
        if (err) {
            return res.status(500).json({ error: "Database update failed." });
        }

        const getVoteSQL = `SELECT upvotes, downvotes FROM city_center WHERE trip_id = ?`;
        db.get(getVoteSQL, [trip_id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve updated votes." });
            }
            return res.json({ success: true, upvotes: row.upvotes, downvotes: row.downvotes });
        });
    });
});

// API to handle restaurant voting
router.post("/vote/restaurant", (req, res) => {
    console.log("Received POST /vote/restaurant request with body:", req.body);

    const { trip_id, restaurant_id, voteType } = req.body;

    if (!trip_id || !restaurant_id || !voteType) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    // Dynamically update votes
    const updateVoteSQL = `UPDATE restaurants SET votes = votes ${voteType == "up" ? "+ 1" : "- 1"} WHERE trip_id = ? AND restaurant_id = ?`;

    db.run(updateVoteSQL, [trip_id, restaurant_id], function (err) {
        if (err) {
            return res.status(500).json({ error: "Database update failed." });
        }

        // Retrieve updated vote counts
        const getVotesSQL = `SELECT votes FROM restaurants WHERE trip_id = ? AND restaurant_id = ?`;
        db.get(getVotesSQL, [trip_id, restaurant_id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve updated votes." });
            }
            // Retrieve votes for both restaurants in this trip
            const getVotesSQL = `SELECT restaurant_id, votes FROM restaurants WHERE trip_id = ? ORDER BY restaurant_id ASC`;

            db.all(getVotesSQL, [trip_id], (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to retrieve updated votes." });
                }

                if (rows.length < 2) {
                    return res.status(500).json({ error: "Not enough restaurants found." });
                }

                return res.json({
                    success: true,
                    votes1: rows[0].votes, // First restaurant's votes
                    votes2: rows[1].votes  // Second restaurant's votes
                });
            });
        });
    });
});

// API to handle hotel voting
router.post("/vote/hotel", (req, res) => {
    console.log("Received POST /vote/hotel request with body:", req.body);

    const { trip_id, hotel_id, voteType } = req.body;

    if (!trip_id || !hotel_id || !voteType) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    // Decide whether to update upvotes or downvotes
    const column = voteType == "up" ? "upvotes" : "downvotes";

    const updateVoteSQL = `UPDATE hotels SET ${column} = ${column} + 1 WHERE trip_id = ? AND hotel_id = ?`;

    db.run(updateVoteSQL, [trip_id, hotel_id], function (err) {
        if (err) {
            return res.status(500).json({ error: "Database update failed." });
        }

        // Retrieve updated vote counts
        const getVotesSQL = `SELECT upvotes, downvotes FROM hotels WHERE trip_id = ? AND hotel_id = ?`;
        db.get(getVotesSQL, [trip_id, hotel_id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve updated votes." });
            }
            return res.json({ success: true, upvotes: row.upvotes, downvotes: row.downvotes });
        });
    });
});

router.post("/vote/shopping", (req, res) => {
    console.log("Received POST /vote/shopping request:", req.body);

    const { trip_id, shop_id, voteType } = req.body; 

    if (!trip_id || !shop_id || !voteType) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    const column = voteType == "up" ? "upvotes" : "downvotes";

    // Fix SQL query to match correct column name
    const updateVoteSQL = `UPDATE shopping SET ${column} = ${column} + 1 WHERE trip_id = ? AND shop_id = ?`;

    db.run(updateVoteSQL, [trip_id, shop_id], function (err) {
        if (err) {
            console.error("Database update error:", err);
            return res.status(500).json({ error: "Database update failed." });
        }

        // Retrieve updated votes to return to the frontend
        const getVotesSQL = `SELECT upvotes, downvotes FROM shopping WHERE shop_id = ?`;
        db.get(getVotesSQL, [shop_id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve updated votes." });
            }
            return res.json({ success: true, upvotes: row.upvotes, downvotes: row.downvotes });
        });
    });
});

module.exports = router;
