/**
 * Repository Model
 * Database operations for repositories table
 */

import { getPool } from '../config/database.js';

/**
 * Repository Model Class
 * Handles all database operations for repositories
 */
class RepositoryModel {
  /**
   * Get all repositories
   * @returns {Promise<Array>} Array of repository objects
   */
  async findAll() {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT id, repository_name, github_url, description, scan_status, total_files, 
         created_at, updated_at, scanned_at 
         FROM repositories 
         ORDER BY created_at DESC`
      );
      return rows;
    } catch (error) {
      console.error('Error finding all repositories:', error);
      throw new Error('Failed to fetch repositories');
    }
  }

  /**
   * Get repository by ID
   * @param {number} id - Repository ID
   * @returns {Promise<Object|null>} Repository object or null if not found
   */
  async findById(id) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT id, repository_name, github_url, description, scan_status, total_files, 
         created_at, updated_at, scanned_at 
         FROM repositories 
         WHERE id = ?`,
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error finding repository by ID ${id}:`, error);
      throw new Error('Failed to fetch repository');
    }
  }

  /**
   * Create a new repository
   * @param {Object} repositoryData - Repository data
   * @param {string} repositoryData.repository_name - Repository name
   * @param {string} repositoryData.github_url - GitHub URL
   * @param {string} repositoryData.description - Repository description
   * @returns {Promise<Object>} Created repository object
   */
  async create(repositoryData) {
    try {
      const { repository_name, github_url, description } = repositoryData;
      
      // Validate required fields
      if (!repository_name || !github_url) {
        throw new Error('Repository name and GitHub URL are required');
      }

      // Validate GitHub URL format
      if (!github_url.startsWith('https://github.com/')) {
        throw new Error('Invalid GitHub URL format. Must start with https://github.com/');
      }

      const pool = getPool();
      const [result] = await pool.query(
        'INSERT INTO repositories (repository_name, github_url, description) VALUES (?, ?, ?)',
        [repository_name, github_url, description || null]
      );

      // Return the created repository
      return this.findById(result.insertId);
    } catch (error) {
      console.error('Error creating repository:', error);
      
      // Handle duplicate entry error
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Repository with this GitHub URL already exists');
      }
      
      throw error;
    }
  }

  /**
   * Update a repository
   * @param {number} id - Repository ID
   * @param {Object} repositoryData - Updated repository data
   * @returns {Promise<Object|null>} Updated repository object or null if not found
   */
  async update(id, repositoryData) {
    try {
      const { repository_name, github_url, description } = repositoryData;
      
      // Check if repository exists
      const existingRepository = await this.findById(id);
      if (!existingRepository) {
        return null;
      }

      const pool = getPool();
      await pool.query(
        'UPDATE repositories SET repository_name = ?, github_url = ?, description = ? WHERE id = ?',
        [
          repository_name || existingRepository.repository_name,
          github_url || existingRepository.github_url,
          description !== undefined ? description : existingRepository.description,
          id
        ]
      );

      // Return the updated repository
      return this.findById(id);
    } catch (error) {
      console.error(`Error updating repository ${id}:`, error);
      throw new Error('Failed to update repository');
    }
  }

  /**
   * Delete a repository
   * @param {number} id - Repository ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    try {
      const pool = getPool();
      const [result] = await pool.query(
        'DELETE FROM repositories WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting repository ${id}:`, error);
      throw new Error('Failed to delete repository');
    }
  }

  /**
   * Search repositories by name or description
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching repositories
   */
  async search(query) {
    try {
      const pool = getPool();
      const searchTerm = `%${query}%`;
      const [rows] = await pool.query(
        `SELECT id, repository_name, github_url, description, scan_status, total_files, 
         created_at, scanned_at 
         FROM repositories 
         WHERE repository_name LIKE ? OR description LIKE ? 
         ORDER BY created_at DESC`,
        [searchTerm, searchTerm]
      );
      
      return rows;
    } catch (error) {
      console.error(`Error searching repositories with query "${query}":`, error);
      throw new Error('Failed to search repositories');
    }
  }

  /**
   * Update scan status
   * @param {number} id - Repository ID
   * @param {string} status - Scan status
   * @param {number} totalFiles - Total files count
   * @returns {Promise<Object|null>}
   */
  async updateScanStatus(id, status, totalFiles = 0) {
    try {
      const pool = getPool();
      await pool.query(
        'UPDATE repositories SET scan_status = ?, total_files = ?, scanned_at = NOW() WHERE id = ?',
        [status, totalFiles, id]
      );

      return this.findById(id);
    } catch (error) {
      console.error(`Error updating scan status for repository ${id}:`, error);
      throw new Error('Failed to update scan status');
    }
  }

  /**
   * Count total repositories
   * @returns {Promise<number>} Total number of repositories
   */
  async count() {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM repositories');
      return rows[0].count;
    } catch (error) {
      console.error('Error counting repositories:', error);
      throw new Error('Failed to count repositories');
    }
  }
}

export default new RepositoryModel();
