const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db/itinerary.db');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
const itineraryRoutes = require('./routes/itineraries');
app.use(itineraryRoutes); // Register the itineraries routes here

// Root route
app.get('/', (req, res) => {
  res.render('index', { title: 'Smart Itinerary Planner' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
