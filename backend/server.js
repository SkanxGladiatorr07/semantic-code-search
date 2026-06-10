/**
 * Server Entry Point
 * Starts the Express server and handles graceful shutdown
 */

import app from './src/app.js';
import { initializeDatabase, closeDatabase } from './src/config/database.js';
import { config } from 'dotenv';

// Load environment variables
config();

const PORT = process.env.PORT || 5000;

/**
 * Initialize and start the server
 */
const startServer = async () => {
  try {
    // Initialize database connection
    console.log('🔌 Initializing database connection...');
    await initializeDatabase();
    console.log('✅ Database initialized');
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🗃️  Database: ${process.env.DATABASE_NAME}`);
      console.log(`👤 Database user: ${process.env.DATABASE_USER}`);
    });
    
    // Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('✅ HTTP server closed');
        
        // Close database connection
        await closeDatabase();
        console.log('✅ Database connection closed');
        console.log('👋 Process terminated');
        
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err);
      gracefulShutdown('Unhandled Rejection');
    });
    
    return server;
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if MySQL is running: mysql -u root -p');
    console.log(`2. Create database: CREATE DATABASE ${process.env.DATABASE_NAME};`);
    console.log('3. Verify .env file has correct database credentials');
    console.log('4. Check MySQL user permissions');
    
    process.exit(1);
  }
};

// Start the server
startServer();
