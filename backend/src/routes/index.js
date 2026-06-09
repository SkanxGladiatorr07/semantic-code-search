/**
 * Main Router
 * Combines all route modules and exports a single router
 */

import express from 'express';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

// Health check routes
router.use('/health', healthRoutes);

// Future routes will be added here:
// router.use('/repositories', repositoryRoutes);
// router.use('/search', searchRoutes);
// router.use('/auth', authRoutes);

export default router;
