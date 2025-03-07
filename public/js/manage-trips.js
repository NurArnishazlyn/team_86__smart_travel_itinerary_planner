document.addEventListener("DOMContentLoaded", function () {
    const confirmTripBtn = document.getElementById("confirmTripBtn");

    if (confirmTripBtn) {
        confirmTripBtn.addEventListener("click", function () {
            // Retrieve data attributes from button
            const tripId = this.dataset.tripId;
            const title = this.dataset.title;
            const destination = this.dataset.destination;
            const tripStartDate = this.dataset.startDate;
            const tripEndDate = this.dataset.endDate;
            const imagePath = this.dataset.imagePath;
            const userId = 1; 

            // Debugging: Print retrieved values to console
            console.log("Trip ID:", tripId);
            console.log("Title:", title);
            console.log("Destination:", destination);
            console.log("Start Date:", tripStartDate);
            console.log("End Date:", tripEndDate);
            console.log("Image Path:", imagePath);

            // Check for missing data
            if (!tripId || !title || !destination || !tripStartDate || !tripEndDate) {
                console.error("Error: Missing trip details.");
                alert("Trip details are missing. Please try again.");
                return;
            }

            // Send data to backend
            fetch("/manage-trips/confirm-trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    trip_id: tripId,
                    user_id: userId,
                    title: title,
                    destination: destination,
                    trip_start_date: tripStartDate,
                    trip_end_date: tripEndDate,
                    image_path: imagePath
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Trip Confirmed:", data.message);
                    alert("Trip successfully added to Upcoming Trips!");
                    window.location.href = "/manage-trips"; 
                } else {
                    console.error("Error:", data.error);
                    alert(data.error);
                }
            })
            .catch(error => console.error("Fetch Error:", error));
        });
    }
});
