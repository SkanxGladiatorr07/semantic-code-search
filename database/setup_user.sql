-- MySQL User Setup Script
-- Run this as root user

-- Create database
CREATE DATABASE IF NOT EXISTS semantic_search_database;

-- Create user if not exists (MySQL 8.0+)
CREATE USER IF NOT EXISTS 'Skan'@'localhost' IDENTIFIED BY 'rockyonmysql1007#';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON semantic_search_database.* TO 'Skan'@'localhost';

-- Also allow connection from anywhere (optional, for development only)
CREATE USER IF NOT EXISTS 'Skan'@'%' IDENTIFIED BY 'rockyonmysql1007#';
GRANT ALL PRIVILEGES ON semantic_search_database.* TO 'Skan'@'%';

-- Apply changes
FLUSH PRIVILEGES;

-- Show grants to verify
SHOW GRANTS FOR 'Skan'@'localhost';

-- Switch to the database
USE semantic_search_database;

-- Show current user
SELECT USER(), CURRENT_USER();
