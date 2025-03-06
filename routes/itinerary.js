const express = require("express");
const router = express.Router();

router.get("/:trip_id", (req, res) => {
    const tripId = req.params.trip_id;

    // Query to get trip details
    const sqlTrip = `SELECT * FROM trips WHERE trip_id = ?`;

    // Query to get trip members
    const sqlMembers = `SELECT member_name FROM trip_members WHERE trip_id = ?`;

    // Query to get flight
    const sqlFlight = `SELECT * FROM flights WHERE trip_id = ?`;

    //Query to get city-center
    const sqlCityCenter = `SELECT * FROM city_center WHERE trip_id = ?`;

    //Query to get restraunts
    const sqlRestaurants = `SELECT * FROM restaurants WHERE trip_id = ?`;

    // Query to get hotel details along with votes
    const sqlHotels = `SELECT * FROM hotels WHERE trip_id = ?`;

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

                db.get(sqlFlight, [tripId], (err,flight) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Error fetching flights.");
                    }
                    
                    db.get(sqlCityCenter, [tripId], (err,center) => {
                        if(err) {
                            console.error(err);
                            return res.status(500).send("Error fetching flights.");
                        }

                        db.all(sqlRestaurants, [tripId], (err,restaurants) => {
                            if(err) {
                                console.error(err);
                                return res.status(500).send("Error fetching restaurants.");
                            }

                            db.all(sqlHotels, [tripId], (err,hotels) => {
                                if(err) {
                                    console.error(err);
                                    return res.status(500).send("Error fetching restaurants.");
                                }

                                res.render("itinerary", { trip, members, flight, center, restaurants, hotels});

                            });
                        });
                    });
                });
            });
        });
});

// API to handle city center votes
router.post("/vote/city-center", (req, res) => {
    const { trip_id, voteType } = req.body;

    if (!trip_id || !voteType) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    const column = voteType == "up" ? "upvotes" : "downvotes";

    // Update the database
    const sql = `UPDATE city_center SET ${column} = ${column} + 1 WHERE trip_id = ?`;
    db.run(sql, [trip_id], function (err) {
        if (err) {
            return res.status(500).json({ error: "Database update failed." });
        }
        return res.json({ success: true });
    });
});

module.exports = router;
