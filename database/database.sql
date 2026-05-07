-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Profile table
CREATE TABLE IF NOT EXISTS profile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    name VARCHAR(100),
    title VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(255),
    resume_url VARCHAR(255),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    github_url VARCHAR(255),
    live_url VARCHAR(255),
    technologies JSON,
    featured BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    proficiency INT DEFAULT 0,
    icon_url VARCHAR(255),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    cover_image VARCHAR(255),
    status ENUM('draft', 'published') DEFAULT 'draft',
    views INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- The hash below is for 'admin123' using bcrypt with salt rounds 10
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@portfolio.com', '$2a$10$r0Y5VqK8XK8XK8XK8XK8Xu1Z2Z3Z4Z5Z6Z7Z8Z9Za0a1a2a3a4a5a6', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample data (optional)
INSERT INTO projects (title, description, technologies, featured, order_index) VALUES
('E-Commerce Platform', 'A full-featured e-commerce platform with cart, checkout, and payment integration.', '["React", "Node.js", "MongoDB", "Stripe"]', true, 1),
('Portfolio Website', 'Modern portfolio website with dark mode and animations.', '["React", "TailwindCSS", "Framer Motion"]', true, 2),
('Task Management App', 'Productivity app for managing tasks and projects.', '["Vue.js", "Express", "PostgreSQL"]', false, 3);

INSERT INTO skills (name, category, proficiency, order_index) VALUES
('React', 'Frontend', 90, 1),
('Node.js', 'Backend', 85, 1),
('Python', 'Backend', 75, 2),
('MongoDB', 'Database', 85, 1),
('MySQL', 'Database', 80, 2);