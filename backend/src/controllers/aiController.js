/**
 * AI Controller
 * Handles AI-powered code analysis and question answering
 */

import geminiService from '../services/geminiService.js';
import RepositoryFileModel from '../models/RepositoryFileModel.js';
import SymbolModel from '../models/SymbolModel.js';
import codeParser from '../utils/codeParser.js';
import gitCloner from '../utils/gitCloner.js';

/**
 * Analyze code with AI
 * @route POST /api/ai/analyze
 * @access Public
 */
export const analyzeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    const analysis = await geminiService.analyzeCode(code, language);

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Error in analyzeCode:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze code',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Explain code with AI
 * @route POST /api/ai/explain
 * @access Public
 */
export const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    const explanation = await geminiService.explainCode(code, language);

    res.status(200).json({
      success: true,
      data: {
        explanation
      }
    });

  } catch (error) {
    console.error('Error in explainCode:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to explain code',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Answer question about code
 * @route POST /api/ai/question
 * @access Public
 */
export const answerQuestion = async (req, res) => {
  try {
    const { question, code, language } = req.body;

    if (!question || !code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Question, code, and language are required'
      });
    }

    const answer = await geminiService.answerQuestion(question, code, language);

    res.status(200).json({
      success: true,
      data: {
        question,
        answer
      }
    });

  } catch (error) {
    console.error('Error in answerQuestion:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to answer question',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate documentation for code
 * @route POST /api/ai/documentation
 * @access Public
 */
export const generateDocumentation = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    const documentation = await geminiService.generateDocumentation(code, language);

    res.status(200).json({
      success: true,
      data: {
        documentation
      }
    });

  } catch (error) {
    console.error('Error in generateDocumentation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate documentation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Suggest code improvements
 * @route POST /api/ai/improve
 * @access Public
 */
export const suggestImprovements = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    const suggestions = await geminiService.suggestImprovements(code, language);

    res.status(200).json({
      success: true,
      data: {
        suggestions
      }
    });

  } catch (error) {
    console.error('Error in suggestImprovements:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to suggest improvements',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Analyze file with AI
 * @route POST /api/ai/analyze-file
 * @access Public
 */
export const analyzeFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }

    const file = await RepositoryFileModel.findById(fileId);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const repositoryPath = gitCloner.getRepositoryPath(file.repository_id);
    const parsed = await codeParser.parseFile(file, repositoryPath);

    if (!parsed || !parsed.content) {
      return res.status(400).json({
        success: false,
        message: 'Unable to read file content'
      });
    }

    const analysis = await geminiService.analyzeCode(parsed.content, parsed.language);

    res.status(200).json({
      success: true,
      data: {
        file_id: file.id,
        file_name: file.file_name,
        file_path: file.file_path,
        language: parsed.language,
        analysis
      }
    });

  } catch (error) {
    console.error('Error in analyzeFile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Semantic code search with AI
 * @route POST /api/ai/semantic-search
 * @access Public
 */
export const semanticSearch = async (req, res) => {
  try {
    const { repositoryId, query } = req.body;

    if (!repositoryId || !query) {
      return res.status(400).json({
        success: false,
        message: 'Repository ID and query are required'
      });
    }

    const symbols = await SymbolModel.findByRepositoryId(parseInt(repositoryId));

    if (symbols.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No symbols found in repository'
      });
    }

    const codeSnippets = symbols.map(symbol => ({
      id: symbol.id,
      name: symbol.symbol_name,
      type: symbol.symbol_type,
      language: symbol.file_extension?.replace('.', '') || 'javascript',
      code: `${symbol.symbol_type} ${symbol.symbol_name}`,
      file_name: symbol.file_name,
      file_path: symbol.file_path
    }));

    const rankedResults = await geminiService.semanticSearch(query, codeSnippets);

    res.status(200).json({
      success: true,
      data: {
        query,
        results: rankedResults,
        total: rankedResults.length
      }
    });

  } catch (error) {
    console.error('Error in semanticSearch:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to perform semantic search',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Check AI service status
 * @route GET /api/ai/status
 * @access Public
 */
export const getAIStatus = async (req, res) => {
  try {
    const isAvailable = geminiService.isAvailable();

    res.status(200).json({
      success: true,
      data: {
        available: isAvailable,
        service: 'Gemini',
        initialized: geminiService.initialized
      }
    });

  } catch (error) {
    console.error('Error in getAIStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check AI status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  analyzeCode,
  explainCode,
  answerQuestion,
  generateDocumentation,
  suggestImprovements,
  analyzeFile,
  semanticSearch,
  getAIStatus
};
