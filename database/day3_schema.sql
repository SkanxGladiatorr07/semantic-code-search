-- Repository Files Table
CREATE TABLE IF NOT EXISTS repository_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repository_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_extension VARCHAR(50),
    file_size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE,
    INDEX idx_repository_id (repository_id),
    INDEX idx_file_extension (file_extension),
    INDEX idx_file_path (file_path(255)),
    UNIQUE KEY unique_repo_file_path (repository_id, file_path(500))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add scanned_at column to repositories table
ALTER TABLE repositories 
ADD COLUMN IF NOT EXISTS scanned_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS scan_status ENUM('pending', 'scanning', 'completed', 'failed') DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS total_files INT DEFAULT 0;
