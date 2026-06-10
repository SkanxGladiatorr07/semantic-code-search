/**
 * Main Router
 * Combines all route modules and exports a single router
 */

import express from 'express';
import healthRoutes from './healthRoutes.js';
import repositoryRoutes from './repositoryRoutes.js';

const router = express.Router();

// Health check routes
router.use('/health', healthRoutes);

// Repository management routes
router.use('/repositories', repositoryRoutes);

// Future routes will be added here:
// router.use('/search', searchRoutes);
// router.use('/auth', authRoutes);

export default router;
