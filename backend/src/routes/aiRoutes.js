/**
 * AI Routes
 * Defines endpoints for AI-powered operations
 */

import express from 'express';
import {
  analyzeCode,
  explainCode,
  answerQuestion,
  generateDocumentation,
  suggestImprovements,
  analyzeFile,
  semanticSearch,
  getAIStatus
} from '../controllers/aiController.js';

const router = express.Router();

// GET /api/ai/status - Check AI service status
router.get('/status', getAIStatus);

// POST /api/ai/analyze - Analyze code snippet
router.post('/analyze', analyzeCode);

// POST /api/ai/explain - Explain code snippet
router.post('/explain', explainCode);

// POST /api/ai/question - Answer question about code
router.post('/question', answerQuestion);

// POST /api/ai/documentation - Generate documentation
router.post('/documentation', generateDocumentation);

// POST /api/ai/improve - Suggest improvements
router.post('/improve', suggestImprovements);

// POST /api/ai/analyze-file - Analyze repository file
router.post('/analyze-file', analyzeFile);

// POST /api/ai/semantic-search - Semantic code search
router.post('/semantic-search', semanticSearch);

export default router;
