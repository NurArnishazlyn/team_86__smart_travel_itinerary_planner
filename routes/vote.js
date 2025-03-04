const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { trip_id, hotel_id, vote } = req.body;

    // Prevent votes from going above 5 or below 0
    const sqlCheckVote = `SELECT votes FROM hotel_votes WHERE hotel_id = ?`;
    const sqlUpdateVote = `
        INSERT INTO hotel_votes (trip_id, hotel_id, votes) 
        VALUES (?, ?, ?) 
        ON CONFLICT(trip_id, hotel_id) 
        DO UPDATE SET votes = CASE 
            WHEN votes + ? BETWEEN 0 AND 5 THEN votes + ? 
            ELSE votes 
        END;
    `;

    db.get(sqlCheckVote, [hotel_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error fetching votes" });
        }

        let currentVotes = result ? result.votes : 0;
        let newVotes = vote ? currentVotes + 1 : currentVotes - 1;

        if (newVotes < 0 || newVotes > 5) {
            return res.status(400).json({ error: "Votes must be between 0 and 5" });
        }

        db.run(sqlUpdateVote, [trip_id, hotel_id, newVotes, vote ? 1 : -1, vote ? 1 : -1], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Vote failed" });
            }

            res.json({ votes: newVotes });
        });
    });
});

router.post("/:trip_id", (req, res) => {
    const tripId = req.params.trip_id;
    const { vote } = req.body;

    let sql = "";
    if (vote == "up") {
        sql = `UPDATE city_center SET upvotes = upvotes + 1 WHERE trip_id = ?`;
    } else if (vote == "down") {
        sql = `UPDATE city_center SET downvotes = downvotes + 1 WHERE trip_id = ?`;
    }

    db.run(sql, [tripId], function (err) {
        if (err) {
            console.error("Vote Error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        // Fetch updated votes
        db.get(`SELECT upvotes, downvotes FROM city_center WHERE trip_id = ?`, [tripId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: "Error fetching votes" });
            }
            res.json(row);
        });
    });
});

module.exports = router;
