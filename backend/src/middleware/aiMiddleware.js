/**
 * AI Middleware
 * Validates AI-related requests
 */

import groqService from '../services/groqService.js';

/**
 * Check if AI service is available
 */
export const checkAIAvailability = (req, res, next) => {
  try {
    if (!groqService.isAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not available. Please check configuration.'
      });
    }
    next();
  } catch (error) {
    console.error('Error checking AI availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check AI service availability'
    });
  }
};

/**
 * Validate code analysis request
 */
export const validateCodeAnalysisRequest = (req, res, next) => {
  const { code, language } = req.body;

  if (!code || typeof code !== 'string' || code.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Code is required and must be a non-empty string'
    });
  }

  if (!language || typeof language !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Language is required'
    });
  }

  const validLanguages = ['javascript', 'typescript', 'python', 'java', 'jsx', 'tsx'];
  if (!validLanguages.includes(language.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Language must be one of: ${validLanguages.join(', ')}`
    });
  }

  next();
};

/**
 * Validate question request
 */
export const validateQuestionRequest = (req, res, next) => {
  const { question, code, language } = req.body;

  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Question is required and must be a non-empty string'
    });
  }

  if (!code || typeof code !== 'string' || code.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Code is required and must be a non-empty string'
    });
  }

  if (!language || typeof language !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Language is required'
    });
  }

  next();
};

/**
 * Rate limiting for AI requests (simple in-memory implementation)
 */
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

export const aiRateLimiter = (req, res, next) => {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  if (!requestCounts.has(clientId)) {
    requestCounts.set(clientId, []);
  }
  
  const requests = requestCounts.get(clientId).filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );
  
  if (requests.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: 'Too many AI requests. Please try again later.'
    });
  }
  
  requests.push(now);
  requestCounts.set(clientId, requests);
  
  next();
};

export default {
  checkAIAvailability,
  validateCodeAnalysisRequest,
  validateQuestionRequest,
  aiRateLimiter
};
