/**
 * Analysis Routes
 * Defines endpoints for repository analysis operations
 */

import express from 'express';
import {
  analyzeRepository,
  getRepositorySymbols
} from '../controllers/analysisController.js';
import { validateRepositoryId } from '../middleware/validators.js';

const router = express.Router();

// POST /api/repositories/:id/analyze - Analyze repository
router.post('/:id/analyze', validateRepositoryId, analyzeRepository);

// GET /api/repositories/:id/symbols - Get repository symbols
router.get('/:id/symbols', validateRepositoryId, getRepositorySymbols);

export default router;
