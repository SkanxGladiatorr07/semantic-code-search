/**
 * Symbol Model
 * Database operations for symbols table
 */

import { getPool } from '../config/database.js';

class SymbolModel {
  /**
   * Create multiple symbols in batch
   * @param {number} repositoryId - Repository ID
   * @param {Array} symbols - Array of symbol objects with file_id, symbol_name, symbol_type
   * @returns {Promise<void>}
   */
  async createBatch(repositoryId, symbols) {
    if (!symbols || symbols.length === 0) return;

    try {
      const pool = getPool();
      const values = symbols.map(symbol => [
        repositoryId,
        symbol.file_id,
        symbol.symbol_name,
        symbol.symbol_type
      ]);

      await pool.query(
        'INSERT IGNORE INTO symbols (repository_id, file_id, symbol_name, symbol_type) VALUES ?',
        [values]
      );
    } catch (error) {
      console.error('Error creating symbols batch:', error);
      throw new Error('Failed to save symbols');
    }
  }

  /**
   * Get all symbols for a repository
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<Array>}
   */
  async findByRepositoryId(repositoryId) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT s.id, s.repository_id, s.file_id, s.symbol_name, s.symbol_type, s.created_at,
                f.file_name, f.file_path, f.file_extension
         FROM symbols s
         JOIN repository_files f ON s.file_id = f.id
         WHERE s.repository_id = ?
         ORDER BY s.symbol_name`,
        [repositoryId]
      );
      return rows;
    } catch (error) {
      console.error('Error finding symbols:', error);
      throw new Error('Failed to fetch symbols');
    }
  }

  /**
   * Get symbols by type
   * @param {number} repositoryId - Repository ID
   * @param {string} symbolType - Symbol type (function, class, interface)
   * @returns {Promise<Array>}
   */
  async findByType(repositoryId, symbolType) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT s.id, s.repository_id, s.file_id, s.symbol_name, s.symbol_type, s.created_at,
                f.file_name, f.file_path, f.file_extension
         FROM symbols s
         JOIN repository_files f ON s.file_id = f.id
         WHERE s.repository_id = ? AND s.symbol_type = ?
         ORDER BY s.symbol_name`,
        [repositoryId, symbolType]
      );
      return rows;
    } catch (error) {
      console.error('Error finding symbols by type:', error);
      throw new Error('Failed to fetch symbols by type');
    }
  }

  /**
   * Delete all symbols for a repository
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<boolean>}
   */
  async deleteByRepositoryId(repositoryId) {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM symbols WHERE repository_id = ?', [repositoryId]);
      return true;
    } catch (error) {
      console.error('Error deleting symbols:', error);
      throw new Error('Failed to delete symbols');
    }
  }

  /**
   * Count symbols for a repository
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<number>}
   */
  async countByRepositoryId(repositoryId) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM symbols WHERE repository_id = ?',
        [repositoryId]
      );
      return rows[0].count;
    } catch (error) {
      console.error('Error counting symbols:', error);
      throw new Error('Failed to count symbols');
    }
  }

  /**
   * Get symbol statistics for a repository
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<Object>}
   */
  async getStatistics(repositoryId) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT 
          symbol_type,
          COUNT(*) as count
        FROM symbols 
        WHERE repository_id = ?
        GROUP BY symbol_type`,
        [repositoryId]
      );
      
      const stats = {
        total: 0,
        functions: 0,
        classes: 0,
        interfaces: 0
      };

      rows.forEach(row => {
        stats.total += row.count;
        if (row.symbol_type === 'function') stats.functions = row.count;
        if (row.symbol_type === 'class') stats.classes = row.count;
        if (row.symbol_type === 'interface') stats.interfaces = row.count;
      });

      return stats;
    } catch (error) {
      console.error('Error getting symbol statistics:', error);
      throw new Error('Failed to get symbol statistics');
    }
  }

  /**
   * Search symbols by name
   * @param {number} repositoryId - Repository ID
   * @param {string} query - Search query
   * @returns {Promise<Array>}
   */
  async search(repositoryId, query) {
    try {
      const pool = getPool();
      const searchTerm = `%${query}%`;
      const [rows] = await pool.query(
        `SELECT s.id, s.repository_id, s.file_id, s.symbol_name, s.symbol_type, s.created_at,
                f.file_name, f.file_path, f.file_extension
         FROM symbols s
         JOIN repository_files f ON s.file_id = f.id
         WHERE s.repository_id = ? AND s.symbol_name LIKE ?
         ORDER BY s.symbol_name`,
        [repositoryId, searchTerm]
      );
      return rows;
    } catch (error) {
      console.error('Error searching symbols:', error);
      throw new Error('Failed to search symbols');
    }
  }
}

export default new SymbolModel();
