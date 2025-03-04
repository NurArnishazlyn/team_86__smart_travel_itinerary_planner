document.addEventListener("DOMContentLoaded", function () {
    const voteButtons = document.querySelectorAll(".vote-btn");

    voteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const voteSection = this.closest(".vote-section");

            if (!voteSection) {
                console.error("Vote section not found!");
                return;
            }

            let upvoteCount = voteSection.querySelector(".upvote-count");
            let downvoteCount = voteSection.querySelector(".downvote-count");

            // Check if these elements exist before accessing them
            if (!upvoteCount || !downvoteCount) {
                console.error("Missing vote elements!");
                return;
            }

            let upvotes = parseInt(upvoteCount.textContent) || 0;
            let downvotes = parseInt(downvoteCount.textContent) || 0;

            if (this.classList.contains("upvote")) {
                upvotes++;
                upvoteCount.textContent = upvotes;
            } else if (this.classList.contains("downvote")) {
                downvotes++;
                downvoteCount.textContent = downvotes;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".vote-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const hotelId = this.dataset.hotelId;
            const voteType = this.classList.contains("upvote") ? "up" : "down";

            fetch("/vote-hotel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hotel_id: hotelId, vote_type: voteType }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        location.reload(); // Refresh page to show updated votes
                    }
                })
                .catch((err) => console.error("Error voting:", err));
        });
    });
});
