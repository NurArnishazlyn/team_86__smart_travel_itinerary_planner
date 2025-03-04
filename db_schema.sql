-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT,
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

-- Travel Guides (Blog Posts) Table
CREATE TABLE IF NOT EXISTS blog_posts (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,  -- Author of the blog post
    title TEXT NOT NULL,
    content TEXT,
    country TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blog_post_images (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blog_post_likes (
    like_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL, -- User who liked the post
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id) -- Prevents a user from liking the same post multiple times
);

CREATE TABLE IF NOT EXISTS blog_post_comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL, -- User who made the comment
    comment_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

--- Manage-Trips Start ---

CREATE TABLE IF NOT EXISTS upcoming_trips (
    trip_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,  
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    trip_start_date DATE NOT NULL,
    trip_end_date DATE NOT NULL,
    image_path TEXT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS past_trips (
    trip_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,  
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    trip_start_date DATE NOT NULL,
    trip_end_date DATE NOT NULL,
    image_path TEXT,
    moved_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Date it was moved from upcoming_trips
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

--- Manage-Trips End ---

--- Itinerary Page Start ---

CREATE TABLE IF NOT EXISTS trips (
    trip_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    trip_name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trip_members (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    member_name TEXT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flights (
    flight_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    departure_location TEXT NOT NULL,
    arrival_location TEXT NOT NULL,
    departure_datetime DATETIME NOT NULL,
    arrival_datetime DATETIME NOT NULL,
    transport_mode TEXT DEFAULT 'Flight',
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hotels (
    hotel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    hotel_name TEXT NOT NULL,
    check_in DATETIME NOT NULL,
    check_out DATETIME NOT NULL,
    price_per_night DECIMAL(10,2),
    transport_details TEXT,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    restaurant_name TEXT NOT NULL,
    reviews INTEGER DEFAULT 0,
    price_range TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurant_votes (
    vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    vote_value INTEGER CHECK(vote_value IN (1, -1)), -- 1 for upvote, -1 for downvote
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shopping (
    shopping_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    shop_name TEXT NOT NULL,
    reviews INTEGER DEFAULT 0,
    visit_time TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shopping_votes (
    vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    shopping_id INTEGER NOT NULL,
    vote_value INTEGER CHECK(vote_value IN (1, -1)), -- 1 for upvote, -1 for downvote
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (shopping_id) REFERENCES shopping(shopping_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS city_center_transport (
    transport_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    departure_location TEXT NOT NULL,
    arrival_location TEXT NOT NULL,
    transport_mode TEXT NOT NULL,
    arrival_time TEXT,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

--- Itinerary Page End ---

-- Insert default users
INSERT INTO users (full_name, username, password, phone) 
VALUES 
    ('John Doe', 'john_doe', 'hashed_password123', '+6512345678'),
    ('Jane Doe', 'jane_doe', 'hashed_password456', '+6523456789'),
    ('Alice Smith', 'alice_smith', 'hashed_password789', '+6534567890'),
    ('Bob Johnson', 'bob_johnson', 'hashed_password012', '+6545678901');

-- Insert default email accounts
INSERT INTO email_accounts (email_address, user_id) 
VALUES 
    ('john.doe@example.com', 1),
    ('jane.doe@example.com', 2),
    ('alice.smith@example.com', 3),
    ('bob.johnson@example.com', 4);

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

-- Insert demo data into blog_posts
INSERT INTO blog_posts (user_id, title, content) VALUES
(1, 'Exploring the Hidden Gems of Paris', 'Discover charming cafes, local markets, and picturesque streets beyond the Eiffel Tower.'),
(2, 'A Foodie''s Guide to Tokyo', 'Indulge in the diverse culinary scene of Tokyo, from Michelin-starred restaurants to hidden ramen shops.'),
(1, 'Adventure in the Amazon Rainforest', 'Experience the breathtaking biodiversity and immerse yourself in the wonders of the Amazon.'),
(2, 'Island Hopping in Greece', 'Explore the stunning beaches, ancient ruins, and vibrant nightlife of the Greek Islands.');

-- Insert demo data into blog_posts (with country field)
INSERT INTO blog_posts (user_id, title, content, country) VALUES
(1, 'Exploring the Hidden Gems of Paris', 'Discover charming cafes, local markets, and picturesque streets beyond the Eiffel Tower.', 'Japan'),
(2, 'A Foodie''s Guide to Tokyo', 'Indulge in the diverse culinary scene of Tokyo, from Michelin-starred restaurants to hidden ramen shops.', 'France'),
(1, 'Adventure in the Amazon Rainforest', 'Experience the breathtaking biodiversity and immerse yourself in the wonders of the Amazon.', 'China'),
(2, 'Island Hopping in Greece', 'Explore the stunning beaches, ancient ruins, and vibrant nightlife of the Greek Islands.', 'Singapore');

INSERT INTO blog_post_images (post_id, image_path)
SELECT post_id, 'images/travel-guide-demo.png'
FROM blog_posts
WHERE title IN (
    'Exploring the Hidden Gems of Paris',
    'A Foodie''s Guide to Tokyo',
    'Adventure in the Amazon Rainforest',
    'Island Hopping in Greece'
);

INSERT INTO blog_post_likes (post_id, user_id)
SELECT bp.post_id, u.user_id
FROM blog_posts AS bp, users AS u
WHERE bp.title IN (
    'Exploring the Hidden Gems of Paris',
    'A Foodie''s Guide to Tokyo',
    'Adventure in the Amazon Rainforest',
    'Island Hopping in Greece'
)
AND u.username IN ('john_doe', 'jane_doe');

INSERT INTO blog_post_comments (post_id, user_id, comment_text)
SELECT bp.post_id, u.user_id, 
       CASE 
           WHEN u.username = 'john_doe' THEN 'John''s comment on ' || bp.title
           ELSE 'Jane''s comment on ' || bp.title
       END
FROM blog_posts AS bp, users AS u
WHERE bp.title IN (
    'Exploring the Hidden Gems of Paris',
    'A Foodie''s Guide to Tokyo',
    'Adventure in the Amazon Rainforest',
    'Island Hopping in Greece'
)
AND u.username IN ('john_doe', 'jane_doe');

--- Manage Trips Dummy Data ---

--- Itinerary Page Dummy Data ---

INSERT INTO trips (user_id, trip_name, description, start_date, end_date) 
VALUES (1, 'Tokyo Grad Trip 2025', 'A fun trip with friends', '2025-12-20', '2025-12-27');

INSERT INTO flights (trip_id, departure_location, arrival_location, departure_datetime, arrival_datetime) 
VALUES (1, 'Singapore Terminal 1', 'Narita Terminal 1', '2025-12-19 23:00:00', '2025-12-20 09:00:00');

INSERT INTO hotels (trip_id, hotel_name, check_in, check_out, price_per_night, transport_details) 
VALUES (1, 'Hotel Metropolitan Tokyo Marunouchi', '2025-12-20', '2025-12-27', 329, '8 min walk from Tokyo Station');

INSERT INTO restaurants (trip_id, restaurant_name, reviews, price_range, votes) 
VALUES (1, 'Tokyo Ramen Street', 958, '1000yen - 2000yen', 0);

INSERT INTO restaurant_votes (user_id, restaurant_id, vote_value) 
VALUES (1, 1, 1); -- 1 for upvote

INSERT INTO shopping (trip_id, shop_name, reviews, visit_time, votes) 
VALUES (1, 'Pokémon Center Tokyo', 958, '12:00pm - 1:30pm JST', 0);
INSERT INTO shopping (trip_id, shop_name, reviews, visit_time, votes) 
VALUES (1, 'Animate Ikebukuro', 1000, '3:00pm - 6:30pm JST', 0);
INSERT INTO shopping (trip_id, shop_name, reviews, visit_time, votes) 
VALUES (1, 'Meiji Jingu Shrine', 1500, '1:00pm - 3:30pm JST', 0);

--- Itinerary Page Dummy Data ---

-- Insert sample upcoming trips
INSERT INTO upcoming_trips (user_id, title, destination, trip_start_date, trip_end_date, image_path) VALUES
(1, 'Bali Exploration', 'Bali', '2025-04-12', '2025-04-19', '/images/bali-h.jpg'),
(1, 'London Tour', 'London', '2025-06-15', '2025-06-18', '/images/london-h.jpg'),
(2, 'Maldives Adventure', 'Maldives', '2025-07-01', '2025-07-07', '/images/maldives-h.jpg');

-- Insert sample past trips
INSERT INTO past_trips (user_id, title, destination, trip_start_date, trip_end_date, image_path) VALUES
(1, 'Bali Exploration', 'Bali', '2025-04-12', '2025-04-19', '/images/bali-h.jpg'),
(1, 'London Tour', 'London', '2025-06-15', '2025-06-18', '/images/london-h.jpg'),
(2, 'Maldives Adventure', 'Maldives', '2025-07-01', '2025-07-07', '/images/maldives-h.jpg');

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    profile_img TEXT DEFAULT '/images/default-profile.jpg',
    trip_title TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

--- Review Dummy Data ---
INSERT INTO reviews (user_id, profile_img, trip_title, rating, review_text)
VALUES 
(1, '/images/profile1.jpg', 'Thailand Adventure', 5, 
    'This trip was an absolute dream! The itinerary planner made everything seamless. 
    From the moment we landed in Bangkok to our adventures in Phuket, everything was well-organized. 
    We were able to customize our trip, vote on activities, and even get real-time updates on weather and local events. 
    The best part was exploring hidden beaches and local street markets without worrying about scheduling conflicts!'),

(2, '/images/profile2.jpg', 'Japan Winter Tour', 4, 
    'Japan in winter is breathtaking! The app helped us manage our schedule efficiently, 
    ensuring we didn’t miss major highlights like the Sapporo Snow Festival and skiing in Niseko. 
    The collaboration feature was great, but I wish there were more built-in recommendations for food spots. 
    Overall, the experience was fantastic, and I’d definitely use this planner for future trips!'),

(3, '/images/profile3.jpg', 'Paris Getaway', 5, 
    'Visiting Paris has always been my dream, and this app made it even better. 
    I could add museum visits, sunset river cruises, and food tours to my itinerary and share it with my friends. 
    We loved being able to sync our plans and get notified when someone suggested a new place. 
    Exploring Montmartre and seeing the Eiffel Tower sparkle at night was absolutely magical!'),

(4, '/images/profile4.jpg', 'Weekend in Bali', 3, 
    'Bali was beautiful, but I felt like the app lacked some local recommendations for hidden spots. 
    It worked great for organizing our main activities like Ubud tours and beach hopping in Uluwatu, 
    but I wish there was an offline mode for areas with poor network coverage. 
    The planner was still helpful in managing our flights, hotel bookings, and restaurant reservations.');

COMMIT;
