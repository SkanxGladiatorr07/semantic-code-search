/**
 * Analysis Routes
 * Defines endpoints for repository analysis operations
 */

import express from 'express';
import {
  analyzeRepository,
  getRepositorySymbols,
  searchRepositorySymbols,
  chatWithRepository,
  generateRepositorySummary
} from '../controllers/analysisController.js';
import { validateRepositoryId } from '../middleware/validators.js';

const router = express.Router();

// POST /api/repositories/:id/analyze - Analyze repository
router.post('/:id/analyze', validateRepositoryId, analyzeRepository);

// GET /api/repositories/:id/symbols - Get repository symbols
router.get('/:id/symbols', validateRepositoryId, getRepositorySymbols);

// GET /api/repositories/:id/search - Search repository symbols
router.get('/:id/search', validateRepositoryId, searchRepositorySymbols);

// POST /api/repositories/:id/chat - Chat with repository
router.post('/:id/chat', validateRepositoryId, chatWithRepository);

// POST /api/repositories/:id/summary - Generate repository summary
router.post('/:id/summary', validateRepositoryId, generateRepositorySummary);

export default router;
