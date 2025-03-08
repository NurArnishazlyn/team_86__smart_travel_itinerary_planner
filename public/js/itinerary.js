document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    // City Center Voting
    document.querySelectorAll(".vote-btn.city-vote").forEach(button => {
        button.addEventListener("click", function () {
            const tripId = this.dataset.tripId;
            const voteType = this.dataset.vote;

            console.log("City Center Vote Clicked:", { tripId, voteType });

            if (!tripId || !voteType) {
                console.error("Missing parameters for City Center voting:", { tripId, voteType });
                return;
            }

            fetch("/itinerary/vote/city-center", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trip_id: tripId, voteType: voteType })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("City Center Vote Updated Successfully!", data);
                    if (voteType == "up") {
                        this.querySelector(".upvote-count").textContent = data.upvotes;
                    } else {
                        this.querySelector(".downvote-count").textContent = data.downvotes;
                    }
                } else {
                    console.error("Server error:", data.error);
                }
            })
            .catch(error => console.error("Fetch Error:", error));
        });
    });

    // Restaurant Voting (Poll Bar)
    document.querySelectorAll(".vote-btn.restaurant-vote").forEach(button => {
        button.addEventListener("click", function () {
            const tripId = this.dataset.tripId;
            const restaurantId = this.dataset.restaurantId;
            const voteType = this.dataset.vote;

            console.log("Restaurant Vote Clicked:", { tripId, restaurantId, voteType });

            if (!tripId || !restaurantId || !voteType) {
                console.error("Missing parameters for restaurant voting:", { tripId, restaurantId, voteType });
                return;
            }

            fetch("/itinerary/vote/restaurant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trip_id: tripId, restaurant_id: restaurantId, voteType: voteType })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Restaurant Vote Updated Successfully!", data);
                if (data.success) {
                    updateVoteBar(data.votes1, data.votes2);
                } else {
                    console.error("Server error:", data.error);
                }
            })
            .catch(error => console.error("Fetch Error:", error));
        });
    });

    function updateVoteBar(votes1, votes2) {
        votes1 = parseInt(votes1) || 0;
        votes2 = parseInt(votes2) || 0;
        const totalVotes = votes1 + votes2;

        if (totalVotes === 0) {
            console.warn("No votes yet. Setting default percentage to 50%.");
            document.getElementById("barFill").style.width = "50%";
            document.getElementById("voteText").textContent = "50%";
            return;
        }

        const ramenPercentage = Math.round((votes1 / totalVotes) * 100);
        console.log(`Updating poll: votes1 = ${votes1}, votes2 = ${votes2}, ramenPercentage = ${ramenPercentage}%`);
        document.getElementById("barFill").style.width = ramenPercentage + "%";
        document.getElementById("voteText").textContent = ramenPercentage + "%";
    }

    // Hotel Voting
    document.querySelectorAll(".vote-btn.hotel-vote").forEach(button => {
        button.addEventListener("click", function () {
            const tripId = this.dataset.tripId;
            const hotelId = this.dataset.hotelId;
            const voteType = this.dataset.vote;

            console.log("Hotel Vote Clicked:", { tripId, hotelId, voteType });

            if (!tripId || !hotelId || !voteType) {
                console.error("Missing parameters for hotel voting:", { tripId, hotelId, voteType });
                return;
            }

            fetch("/itinerary/vote/hotel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trip_id: tripId, hotel_id: hotelId, voteType: voteType })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Hotel Vote Updated Successfully!", data);
                    if (voteType == "up") {
                        this.querySelector(".upvote-count").textContent = data.upvotes;
                    } else {
                        this.querySelector(".downvote-count").textContent = data.downvotes;
                    }
                } else {
                    console.error("Server error:", data.error);
                }
            })
            .catch(error => console.error("Fetch Error:", error));
        });
    });

    // Shopping Voting
    document.querySelectorAll(".vote-btn.shopping-vote").forEach(button => {
        button.addEventListener("click", function () {
            const tripId = this.dataset.tripId;
            const shopId = this.dataset.shopId; // FIXED: Ensure it matches `shop_id`
            const voteType = this.dataset.vote;

            console.log("Clicked Shopping Vote Button", { tripId, shopId, voteType });

            if (!tripId || !shopId || !voteType) {
                console.error("Missing parameters for shopping voting:", { tripId, shopId, voteType });
                return;
            }

            fetch("/itinerary/vote/shopping", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ trip_id: tripId, shop_id: shopId, voteType: voteType }) // FIXED: Sending `shop_id`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Shopping Vote Updated Successfully!", data);

                    // Update vote count in UI
                    if (voteType == "up") {
                        this.querySelector(".upvote-count").textContent = data.upvotes;
                    } else {
                        this.querySelector(".downvote-count").textContent = data.downvotes;
                    }
                } else {
                    console.error("Server error:", data.error);
                }
            })
            .catch(error => console.error("Fetch Error:", error));
        });
    });

    //Trip-btn
    const tripButtons = document.querySelectorAll(".trip-btn");

    tripButtons.forEach(button => {
        button.addEventListener("click", function () {
            const tripId = this.getAttribute("data-trip-id");
            window.location.href = `/itinerary/${tripId}`;  // Redirect to the selected trip
        });
    });
});

