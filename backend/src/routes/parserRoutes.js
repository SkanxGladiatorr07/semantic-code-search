/**
 * Parser Routes
 * Defines endpoints for code parsing operations
 */

import express from 'express';
import {
  parseRepositoryFiles,
  parseSpecificFile,
  extractSymbols
} from '../controllers/parserController.js';
import { validateRepositoryId } from '../middleware/validators.js';

const router = express.Router();

// POST /api/repositories/:id/parse - Parse all repository files
router.post('/:id/parse', validateRepositoryId, parseRepositoryFiles);

// GET /api/repositories/:id/files/:fileId/parse - Parse specific file
router.get('/:id/files/:fileId/parse', validateRepositoryId, parseSpecificFile);

// GET /api/repositories/:id/symbols - Extract symbols (functions and classes)
router.get('/:id/symbols', validateRepositoryId, extractSymbols);

export default router;
