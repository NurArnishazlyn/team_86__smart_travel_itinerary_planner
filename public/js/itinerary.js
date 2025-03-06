document.addEventListener("DOMContentLoaded", function () {
    const voteButtons = document.querySelectorAll(".vote-btn");

    voteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const tripId = this.dataset.tripId; // Get trip ID
            const voteType = this.dataset.vote; // 'up' or 'down'
            const upvoteCount = document.querySelector(".upvote-count");
            const downvoteCount = document.querySelector(".downvote-count");

            if (!upvoteCount || !downvoteCount) {
                console.error("Error: Unable to find vote count elements in the DOM.");
                return;
            }

            fetch("/vote/city-center", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ trip_id: tripId, voteType: voteType })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (voteType == "up") {
                        upvoteCount.textContent = parseInt(upvoteCount.textContent) + 1;
                    } else {
                        downvoteCount.textContent = parseInt(downvoteCount.textContent) + 1;
                    }
                } else {
                    console.error("Server responded with an error:", data.error);
                }
            })
            .catch(error => console.error("Fetch Error:", error));
        });
    });
});
