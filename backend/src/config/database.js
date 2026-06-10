/**
 * Database Configuration
 * MySQL connection setup and database utilities
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
  queueLimit: 0,
  timezone: '+00:00'
};

/**
 * Create a connection pool
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
    
    // Verify tables exist or create them
    await verifyTables(connection);
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Please check your database credentials in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`Database '${dbConfig.database}' does not exist. Please create it first.`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to MySQL server. Make sure MySQL is running.');
    }
    
    throw error;
  }
};

/**
 * Verify required tables exist
 * @param {Connection} connection - MySQL connection
 */
const verifyTables = async (connection) => {
  try {
    // Check if repositories table exists
    const [rows] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name = 'repositories'
    `, [dbConfig.database]);
    
    if (rows[0].count === 0) {
      console.log('⚠️  repositories table does not exist. Creating...');
      await createTables(connection);
    } else {
      console.log('✅ repositories table exists');
    }
  } catch (error) {
    console.error('Error verifying tables:', error);
    throw error;
  }
};

/**
 * Create required tables
 * @param {Connection} connection - MySQL connection
 */
const createTables = async (connection) => {
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS repositories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        repository_name VARCHAR(255) NOT NULL,
        github_url VARCHAR(500) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_repository_name (repository_name),
        INDEX idx_created_at (created_at),
        UNIQUE KEY unique_github_url (github_url),
        CHECK (github_url LIKE 'https://github.com/%/%')
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ repositories table created successfully');
    
    // Insert sample data if table is empty
    const [countRows] = await connection.query('SELECT COUNT(*) as count FROM repositories');
    if (countRows[0].count === 0) {
      await insertSampleData(connection);
    }
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

/**
 * Insert sample data
 * @param {Connection} connection - MySQL connection
 */
const insertSampleData = async (connection) => {
  try {
    await connection.query(`
      INSERT INTO repositories (repository_name, github_url, description) VALUES
      ('React', 'https://github.com/facebook/react', 'A declarative, efficient, and flexible JavaScript library for building user interfaces.'),
      ('Node.js', 'https://github.com/nodejs/node', 'Node.js JavaScript runtime'),
      ('Express', 'https://github.com/expressjs/express', 'Fast, unopinionated, minimalist web framework for Node.js'),
      ('Vite', 'https://github.com/vitejs/vite', 'Next generation frontend tooling'),
      ('TypeScript', 'https://github.com/microsoft/TypeScript', 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.')
    `);
    
    console.log('✅ Sample data inserted');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    // Don't throw - sample data is optional
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
