/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling
 */

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
config();

// Initialize Express app
const app = express();

// ============================================
// Middleware Configuration
// ============================================

// Enable CORS for cross-origin requests
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// Routes
// ============================================

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Semantic Code Search API',
    version: '1.0.0',
    status: 'running'
  });
});

// ============================================
// Error Handling
// ============================================

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use(errorHandler);

export default app;
