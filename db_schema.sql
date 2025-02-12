-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email Accounts Table
CREATE TABLE IF NOT EXISTS email_accounts (
    email_account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_address TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Itineraries Table
CREATE TABLE IF NOT EXISTS itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itinerary_id INTEGER NOT NULL,
    activity_name TEXT NOT NULL,
    activity_date DATETIME NOT NULL,
    location TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
);

-- Insert default users
INSERT INTO users (username, password) 
VALUES 
    ('john_doe', 'hashed_password123'),
    ('jane_doe', 'hashed_password456');

-- Insert default email accounts
INSERT INTO email_accounts (email_address, user_id) 
VALUES 
    ('john.doe@example.com', 1),
    ('jane.doe@example.com', 2);

-- Insert default itineraries
INSERT INTO itineraries (user_id, title, description, start_date, end_date) 
VALUES 
    (1, 'Summer Vacation in Italy', 'Explore Rome, Venice, and Florence', '2025-06-15', '2025-06-30'),
    (2, 'Weekend Getaway', 'Relaxing weekend in the mountains', '2025-07-20', '2025-07-22');

-- Insert default activities
INSERT INTO activities (itinerary_id, activity_name, activity_date, location, notes) 
VALUES 
    (1, 'Visit the Colosseum', '2025-06-16 10:00:00', 'Rome, Italy', 'Buy tickets in advance'),
    (1, 'Wine Tasting Tour', '2025-06-18 14:00:00', 'Tuscany, Italy', 'Don’t forget to book a driver.'),
    (2, 'Hike the Blue Ridge Trail', '2025-07-21 08:00:00', 'Blue Ridge Mountains, USA', 'Pack water and snacks');

COMMIT;
