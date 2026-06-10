-- ============================================
-- Database Schema for Semantic Code Search
-- ============================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS code_search_db;
USE code_search_db;

-- ============================================
-- Repositories Table
-- Stores GitHub repository information
-- ============================================

CREATE TABLE repositories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repository_name VARCHAR(255) NOT NULL,
    github_url VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better query performance
    INDEX idx_repository_name (repository_name),
    INDEX idx_created_at (created_at),
    
    -- Ensure unique GitHub URLs
    UNIQUE KEY unique_github_url (github_url),
    
    -- Ensure valid GitHub URLs
    CHECK (github_url LIKE 'https://github.com/%/%')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Search History Table (Future Use)
-- ============================================
/*
CREATE TABLE search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repository_id INT NOT NULL,
    search_query TEXT NOT NULL,
    search_results JSON,
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE,
    INDEX idx_search_date (search_date),
    FULLTEXT idx_search_query (search_query)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

-- ============================================
-- Users Table (Future Use - Authentication)
-- ============================================
/*
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

-- ============================================
-- Repository Access Table (Future Use)
-- ============================================
/*
CREATE TABLE repository_access (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    repository_id INT NOT NULL,
    access_level ENUM('read', 'write', 'admin') DEFAULT 'read',
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_repository (user_id, repository_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

-- ============================================
-- Sample Data for Testing
-- ============================================

INSERT INTO repositories (repository_name, github_url, description) VALUES
('React', 'https://github.com/facebook/react', 'A declarative, efficient, and flexible JavaScript library for building user interfaces.'),
('Node.js', 'https://github.com/nodejs/node', 'Node.js JavaScript runtime'),
('Express', 'https://github.com/expressjs/express', 'Fast, unopinionated, minimalist web framework for Node.js'),
('Vite', 'https://github.com/vitejs/vite', 'Next generation frontend tooling'),
('TypeScript', 'https://github.com/microsoft/TypeScript', 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.');

-- ============================================
-- Database Views (Future Use)
-- ============================================

/*
CREATE VIEW repository_overview AS
SELECT 
    id,
    repository_name,
    github_url,
    LENGTH(description) as description_length,
    DATE(created_at) as created_date,
    DATE(updated_at) as updated_date
FROM repositories;
*/

-- ============================================
-- Stored Procedures (Future Use)
-- ============================================

/*
DELIMITER //
CREATE PROCEDURE GetRepositoryCount(OUT total_count INT)
BEGIN
    SELECT COUNT(*) INTO total_count FROM repositories;
END //
DELIMITER ;
*/

-- ============================================
-- Triggers (Future Use)
-- ============================================

/*
DELIMITER //
CREATE TRIGGER before_repository_insert
BEFORE INSERT ON repositories
FOR EACH ROW
BEGIN
    IF NEW.github_url NOT LIKE 'https://github.com/%/%' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid GitHub URL format. Must be https://github.com/owner/repo';
    END IF;
END //
DELIMITER ;
*/

-- ============================================
-- Database User and Permissions (Production)
-- ============================================
/*
CREATE USER 'code_search_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON code_search_db.* TO 'code_search_user'@'localhost';
FLUSH PRIVILEGES;
*/

-- ============================================
-- Show Table Structure
-- ============================================

DESCRIBE repositories;

-- Show sample data
SELECT * FROM repositories;
