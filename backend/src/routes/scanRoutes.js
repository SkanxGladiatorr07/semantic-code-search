/**
 * Scan Routes
 * Defines endpoints for repository scanning operations
 */

import express from 'express';
import {
  scanRepository,
  getRepositoryFiles
} from '../controllers/scanController.js';
import { validateRepositoryId } from '../middleware/validators.js';

const router = express.Router();

// POST /api/repositories/:id/scan - Scan repository
router.post('/:id/scan', validateRepositoryId, scanRepository);

// GET /api/repositories/:id/files - Get repository files
router.get('/:id/files', validateRepositoryId, getRepositoryFiles);

export default router;
