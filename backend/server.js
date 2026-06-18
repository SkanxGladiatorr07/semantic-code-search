import app from './src/app.js';
import { initializeDatabase, closeDatabase } from './src/config/database.js';
import env from './src/config/env.js';

const startServer = async () => {
  try {
    console.log('Initializing database connection...');
    await initializeDatabase();
    console.log('Database initialized');
    
    const server = app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`API available at http://localhost:${env.PORT}/api`);
      console.log(`Database: ${env.database.name}`);
    });
    
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('HTTP server closed');
        
        await closeDatabase();
        console.log('Database connection closed');
        console.log('Process terminated');
        
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
      gracefulShutdown('Unhandled Rejection');
    });
    
    return server;
    
  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.log('\nTroubleshooting Tips:');
    console.log('1. Check if MySQL is running');
    console.log(`2. Create database: CREATE DATABASE ${env.database.name};`);
    console.log('3. Verify .env file has correct database credentials');
    console.log('4. Check MySQL user permissions');
    
    process.exit(1);
  }
};

startServer();