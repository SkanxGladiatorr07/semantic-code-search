/**
 * Main Router
 * Combines all route modules and exports a single router
 */

import express from 'express';
import healthRoutes from './healthRoutes.js';
import repositoryRoutes from './repositoryRoutes.js';
import scanRoutes from './scanRoutes.js';
import parserRoutes from './parserRoutes.js';
import analysisRoutes from './analysisRoutes.js';

const router = express.Router();

// Health check routes
router.use('/health', healthRoutes);

// Repository management routes
router.use('/repositories', repositoryRoutes);

// Scan routes
router.use('/repositories', scanRoutes);

// Parser routes
router.use('/repositories', parserRoutes);

// Analysis routes
router.use('/repositories', analysisRoutes);

// Future routes will be added here:
// router.use('/search', searchRoutes);
// router.use('/auth', authRoutes);

export default router;
