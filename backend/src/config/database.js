/**
 * Database Configuration
 * MySQL connection setup and database utilities
 * Note: This is prepared for future use but not connected yet
 */

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

/**
 * Database configuration object
 */
const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'code_search_db',
  port: process.env.DATABASE_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

/**
 * Create a connection pool (to be used in future phases)
 * Connection pools are more efficient than single connections
 */
let pool = null;

/**
 * Initialize database connection pool
 * @returns {Promise<Pool>} MySQL connection pool
 */
export const initializeDatabase = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Get the database pool instance
 * @returns {Pool} MySQL connection pool
 */
export const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializeDatabase() first.');
  }
  return pool;
};

/**
 * Close the database connection pool
 */
export const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    console.log('✅ Database connection closed');
  }
};

export default {
  initializeDatabase,
  getPool,
  closeDatabase
};
