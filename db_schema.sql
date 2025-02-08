-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Create Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Itineraries Table
CREATE TABLE itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create Activities Table
CREATE TABLE activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itinerary_id INTEGER NOT NULL,
    activity_name TEXT NOT NULL,
    activity_date DATETIME NOT NULL,
    location TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id)
);

-- Insert into Users
INSERT INTO users (username, email, password) 
VALUES 
    ('john_doe', 'john.doe@example.com', 'hashed_password123'),
    ('jane_doe', 'jane.doe@example.com', 'hashed_password456');

-- Insert into Itineraries
INSERT INTO itineraries (user_id, title, description, start_date, end_date) 
VALUES 
    (1, 'Summer Vacation in Italy', 'Explore Rome, Venice, and Florence', '2025-06-15', '2025-06-30'),
    (2, 'Weekend Getaway', 'Relaxing weekend in the mountains', '2025-07-20', '2025-07-22');

-- Insert into Activities
INSERT INTO activities (itinerary_id, activity_name, activity_date, location, notes) 
VALUES 
    (1, 'Visit the Colosseum', '2025-06-16 10:00:00', 'Rome, Italy', 'Buy tickets in advance'),
    (1, 'Wine Tasting Tour', '2025-06-18 14:00:00', 'Tuscany, Italy', 'Don’t forget to book a driver.'),
    (2, 'Hike the Blue Ridge Trail', '2025-07-21 08:00:00', 'Blue Ridge Mountains, USA', 'Pack water and snacks');
