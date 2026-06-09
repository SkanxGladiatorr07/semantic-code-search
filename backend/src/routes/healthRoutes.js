/**
 * Health Check Routes
 * Defines endpoints for server health monitoring
 */

import express from 'express';
import { getHealthStatus, getDetailedHealth } from '../controllers/healthController.js';

const router = express.Router();

// Basic health check
router.get('/', getHealthStatus);

// Detailed health check with system information
router.get('/detailed', getDetailedHealth);

export default router;
