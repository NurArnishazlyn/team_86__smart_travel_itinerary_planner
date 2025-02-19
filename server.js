/**
* index.js
* This is your main app entry point
*/

// 
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const engine = require('ejs-mate');

// Middleware
app.engine('ejs', engine); // Set ejs-mate as the template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
    })
);

// Make user available in all EJS templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Database Initialization
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // exit if we cannot connect to the DB
    } else {
        console.log("Database connected successfully");
        global.db.run("PRAGMA foreign_keys=ON"); // ensure foreign key constraints are respected
    }
});

// Home
app.get('/', (req,res) => {
    res.render('home', {
        title: "Home",
        user: req.session.user || null // Make sure 'user' is passed to the view
    });
});

// Manage Trips
app.get('/manage-trips', (req,res) => {
    res.render("manage-trips");
});

// Login 
const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

// Register
const registerRoutes = require('./routes/register');
app.use('/register', registerRoutes);

// Travel Guide
const travelGuideRouter = require('./routes/travel-guide');
app.use('/travel-guide', travelGuideRouter);

// Deals/Promotions
const dealsRoutes = require('./routes/deals');
app.use('/deals', dealsRoutes);

// Contact
const contactRoutes = require('./routes/contact');
app.use('/contact', contactRoutes);

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
