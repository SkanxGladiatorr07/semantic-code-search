import mysql from 'mysql2/promise';
import env from './env.js';

let pool = null;

export const createPool = () => {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
    waitForConnections: true,
    connectionLimit: env.database.connectionLimit,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: env.database.connectTimeout,
    timezone: '+00:00'
  });

  return pool;
};

export const getPool = () => {
  if (!pool) {
    return createPool();
  }
  return pool;
};

export const initializeDatabase = async () => {
  try {
    const connection = await getPool().getConnection();
    console.log('Database connection established');
    
    await verifyTables(connection);
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Check database credentials in .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`Database '${env.database.name}' does not exist`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('MySQL server not running');
    }
    
    throw error;
  }
};

const verifyTables = async (connection) => {
  const [rows] = await connection.query(`
    SELECT COUNT(*) as count 
    FROM information_schema.tables 
    WHERE table_schema = ? 
    AND table_name = 'repositories'
  `, [env.database.name]);
  
  if (rows[0].count === 0) {
    console.log('Creating tables...');
    await createTables(connection);
  }
};

const createTables = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS repositories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      repository_name VARCHAR(255) NOT NULL,
      github_url VARCHAR(500) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      scanned_at TIMESTAMP NULL,
      scan_status ENUM('pending', 'scanning', 'completed', 'failed') DEFAULT 'pending',
      total_files INT DEFAULT 0,
      
      INDEX idx_repository_name (repository_name),
      INDEX idx_created_at (created_at),
      UNIQUE KEY unique_github_url (github_url)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  
  await connection.query(`
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
  `);
  
  await connection.query(`
    CREATE TABLE IF NOT EXISTS symbols (
      id INT AUTO_INCREMENT PRIMARY KEY,
      repository_id INT NOT NULL,
      file_id INT NOT NULL,
      symbol_name VARCHAR(255) NOT NULL,
      symbol_type ENUM('function', 'class', 'interface', 'variable') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES repository_files(id) ON DELETE CASCADE,
      INDEX idx_repository_id (repository_id),
      INDEX idx_file_id (file_id),
      INDEX idx_symbol_name (symbol_name),
      INDEX idx_symbol_type (symbol_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  
  console.log('Tables created successfully');
};

export const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection pool closed');
  }
};

export const query = async (sql, params) => {
  try {
    const [results] = await getPool().execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

export default {
  createPool,
  getPool,
  initializeDatabase,
  closeDatabase,
  query
};
