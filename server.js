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

// Route Definitions
app.get('/', (req,res) => {
    res.render('home', {
        title: "Home",
        welcomeMessage: 'Smart Travel Itinerary Planner',
        roleOptions: [
            {link: '/login', text: 'Login'},
            {link: '/register', text: 'Register'}
        ],
        footerMessage: 'Created by Team 86',
        currentYear: new Date().getFullYear(),
        user: req.session.user // Make sure 'user' is passed to the view
    });
});

app.get('/manage-trips', (req,res) => {
    res.render("manage-trips");
});

// Login 
const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

// Register
const registerRoutes = require('./routes/register');
app.use('/register', registerRoutes);

const travelGuideRouter = require('./routes/travel-guide');
app.use('/travel-guide', travelGuideRouter);

const dealsRoutes = require('./routes/deals');
app.use('/deals', dealsRoutes);

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

// 404 Catch-all for invalid routes
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
