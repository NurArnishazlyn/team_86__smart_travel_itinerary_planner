const express = require('express');
const router = express.Router();

// Sample promotions (Replace with database query later)
const deals = [
    { title: "20% Off Flights", description: "Get 20% off on all domestic flights booked this week!", image: "/images/deal1.jpg" },
    { title: "Hotel Discount", description: "Book 3 nights and get 1 free at select hotels!", image: "/images/deal2.jpg" },
    { title: "Free Car Rental", description: "Rent a car for 4 days and get the 5th day free!", image: "/images/deal3.jpg" },
    { title: "Cruise Savings", description: "Enjoy a luxurious cruise with a 15% discount when you book before the end of the month!", image: "/images/deal4.jpg" },
    { title: "Adventure Package", description: "Experience thrilling adventures with our exclusive outdoor activity deals!", image: "/images/deal5.jpg" },
    { title: "Travel Insurance Special", description: "Get comprehensive travel insurance at a discounted rate for peace of mind on your journey.", image: "/images/deal6.jpg" }
];


// Route to show the promotions
router.get('/', (req, res) => {
    res.render('deals', { title: "Deals & Promotions", deals: deals });
});

module.exports = router;
