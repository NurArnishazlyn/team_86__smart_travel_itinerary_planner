/**
* server.js
* This is your main app entry point
*/

// 
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // Stores user data across different routes
const engine = require('ejs-mate');

// Middleware
app.engine('ejs', engine); // Set ejs-mate as the template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(express.json());


// Session
app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    })
);

// Middleware to store user in 'res.locals'
// req.session.user: Stores the logged-in user
// req.locals.user: Makes the user available in all views (EJS templates)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Database Initialization
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("❌ Database connection error:", err.message);
        process.exit(1); // Exit if the database fails to connect
    } else {
        console.log("✅ Database connected successfully");
        global.db.run("PRAGMA foreign_keys=ON", (err) => {
            if (err) {
                console.error("⚠️ Failed to enable foreign key constraints:", err.message);
            } else {
                console.log("🔗 Foreign key constraints enabled");
            }
        });
    }
});

// Home
app.get('/', (req,res) => {
    res.render('home', {
        title: "Home",
        user: req.session.user || null // Make sure 'user' is passed to the view
    });
});

app.get('/itinerary', (req,res) => {
    res.render('itinerary');
})

// Login 
const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

// Register
const registerRoutes = require('./routes/register');
app.use('/register', registerRoutes);

// Travel Guide
const travelGuideRouter = require('./routes/travel-guide');
app.use('/travel-guide', travelGuideRouter);

// Manage Trips
const manageTripsRoutes = require("./routes/manage-trips");
app.use('/manage-trips', manageTripsRoutes);

// Itinerary Page
const itineraryPageRoutes = require("./routes/itinerary");
app.use('/itinerary', itineraryPageRoutes);

// Deals/Promotions
const dealsRoutes = require('./routes/deals');
app.use('/deals', dealsRoutes);

const hotelsRouter = require('./routes/hotels'); // Import the hotels route
app.use('/hotels', hotelsRouter); // Use the hotels router

// Contact
const contactRoutes = require('./routes/contact');
app.use('/contact', contactRoutes);

// Reviews
const reviewsRoutes = require("./routes/reviews");
app.use("/reviews", reviewsRoutes);

// Logout 
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to log out. Please try again.");
        }
        res.redirect("/"); // Redirect to the home page after logout
    });
});

// Forgot Password
const forgotPasswordRoutes = require('./routes/forgot-password');
app.use('/forgot-password', forgotPasswordRoutes);

// 404 Catch-all for invalid routes
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
