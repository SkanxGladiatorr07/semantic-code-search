/**
 * Repository File Model
 * Database operations for repository_files table
 */

import { getPool } from '../config/database.js';

class RepositoryFileModel {
  /**
   * Create multiple files in batch
   * @param {number} repositoryId - Repository ID
   * @param {Array} files - Array of file objects
   * @returns {Promise<void>}
   */
  async createBatch(repositoryId, files) {
    if (!files || files.length === 0) return;

    try {
      const pool = getPool();
      const values = files.map(file => [
        repositoryId,
        file.file_name,
        file.file_path,
        file.file_extension,
        file.file_size || 0
      ]);

      await pool.query(
        'INSERT INTO repository_files (repository_id, file_name, file_path, file_extension, file_size) VALUES ?',
        [values]
      );
    } catch (error) {
      console.error('Error creating files batch:', error);
      throw new Error('Failed to save repository files');
    }
  }

  /**
   * Get all files for a repository
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<Array>}
   */
  async findByRepositoryId(repositoryId) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT id, file_name, file_path, file_extension, file_size, created_at FROM repository_files WHERE repository_id = ? ORDER BY file_path',
        [repositoryId]
      );
      return rows;
    } catch (error) {
      console.error('Error finding files:', error);
      throw new Error('Failed to fetch repository files');
    }
  }

  /**
   * Delete all files for a repository
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<boolean>}
   */
  async deleteByRepositoryId(repositoryId) {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM repository_files WHERE repository_id = ?', [repositoryId]);
      return true;
    } catch (error) {
      console.error('Error deleting files:', error);
      throw new Error('Failed to delete repository files');
    }
  }

  /**
   * Count files for a repository
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<number>}
   */
  async countByRepositoryId(repositoryId) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM repository_files WHERE repository_id = ?',
        [repositoryId]
      );
      return rows[0].count;
    } catch (error) {
      console.error('Error counting files:', error);
      throw new Error('Failed to count repository files');
    }
  }

  /**
   * Get file statistics for a repository
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<Object>}
   */
  async getStatistics(repositoryId) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT 
          COUNT(*) as total_files,
          COUNT(DISTINCT file_extension) as total_extensions,
          SUM(file_size) as total_size,
          file_extension,
          COUNT(*) as count
        FROM repository_files 
        WHERE repository_id = ?
        GROUP BY file_extension
        ORDER BY count DESC`,
        [repositoryId]
      );
      return rows;
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw new Error('Failed to get file statistics');
    }
  }

  /**
   * Get file extension statistics
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<Array>}
   */
  async getFileExtensionStats(repositoryId) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT 
          file_extension,
          COUNT(*) as count
        FROM repository_files 
        WHERE repository_id = ?
        GROUP BY file_extension
        ORDER BY count DESC`,
        [repositoryId]
      );
      return rows;
    } catch (error) {
      console.error('Error getting file extension stats:', error);
      throw new Error('Failed to get file extension statistics');
    }
  }

  /**
   * Find file by ID
   * @param {number} id - File ID
   * @returns {Promise<Object>}
   */
  async findById(id) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT * FROM repository_files WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding file by ID:', error);
      throw new Error('Failed to fetch file');
    }
  }
}

export default new RepositoryFileModel();
