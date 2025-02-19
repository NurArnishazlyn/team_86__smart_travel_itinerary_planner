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

-- travel guides
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


-- Insert demo data into blog_posts
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
           ELSE 'Jane''s comment on ' || bp.title  -- When u.username = 'jane_doe'
       END
FROM blog_posts AS bp, users AS u
WHERE bp.title IN (
    'Exploring the Hidden Gems of Paris',
    'A Foodie''s Guide to Tokyo',
    'Adventure in the Amazon Rainforest',
    'Island Hopping in Greece'
)
AND u.username IN ('john_doe', 'jane_doe');



COMMIT;
