/**
 * Repository Routes
 * Defines endpoints for repository management operations
 */

import express from 'express';
import {
  getRepositories,
  getRepositoryById,
  createRepository,
  updateRepository,
  deleteRepository,
  searchRepositories
} from '../controllers/repositoryController.js';
import {
  validateCreateRepository,
  validateUpdateRepository,
  validateRepositoryId,
  validateSearchQuery
} from '../middleware/validators.js';

const router = express.Router();

// ============================================
// Public Routes
// ============================================

// GET /api/repositories - Get all repositories
router.get('/', getRepositories);

// GET /api/repositories/search - Search repositories
router.get('/search', validateSearchQuery, searchRepositories);

// GET /api/repositories/:id - Get single repository
router.get('/:id', validateRepositoryId, getRepositoryById);

// POST /api/repositories - Create new repository
router.post('/', validateCreateRepository, createRepository);

// PUT /api/repositories/:id - Update repository
router.put('/:id', validateRepositoryId, validateUpdateRepository, updateRepository);

// DELETE /api/repositories/:id - Delete repository
router.delete('/:id', validateRepositoryId, deleteRepository);

export default router;
