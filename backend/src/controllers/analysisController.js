/**
 * Analysis Controller
 * Handles repository analysis operations
 */

import RepositoryModel from '../models/RepositoryModel.js';
import RepositoryFileModel from '../models/RepositoryFileModel.js';
import SymbolModel from '../models/SymbolModel.js';
import gitCloner from '../utils/gitCloner.js';
import codeParser from '../utils/codeParser.js';
import symbolExtractor from '../utils/symbolExtractor.js';
import geminiService from '../services/geminiService.js';
import contextService from '../services/contextService.js';

/**
 * Analyze repository and extract symbols
 * @route POST /api/repositories/:id/analyze
 * @access Public
 */
export const analyzeRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const repositoryId = parseInt(id);

    if (!repositoryId || isNaN(repositoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID',
        userMessage: 'Please provide a valid repository ID'
      });
    }

    const repository = await RepositoryModel.findById(repositoryId);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found',
        userMessage: 'The requested repository does not exist'
      });
    }

    if (repository.scan_status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Repository must be scanned before analysis',
        userMessage: 'Please scan the repository first before analyzing'
      });
    }

    const files = await RepositoryFileModel.findByRepositoryId(repositoryId);
    
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files found in repository',
        userMessage: 'No files found. Please scan the repository first'
      });
    }

    await SymbolModel.deleteByRepositoryId(repositoryId);

    const repositoryPath = gitCloner.getRepositoryPath(repository.id);
    const parsedFiles = await codeParser.parseFiles(files, repositoryPath);
    
    const symbols = symbolExtractor.extractSymbols(parsedFiles);

    const symbolsToSave = [];
    symbols.forEach(symbol => {
      const file = files.find(f => f.file_path === symbol.file_path);
      if (file) {
        symbolsToSave.push({
          file_id: file.id,
          symbol_name: symbol.name,
          symbol_type: symbol.type
        });
      }
    });

    if (symbolsToSave.length > 0) {
      await SymbolModel.createBatch(repositoryId, symbolsToSave);
    }

    const statistics = await SymbolModel.getStatistics(repositoryId);

    res.status(200).json({
      success: true,
      message: 'Repository analyzed successfully',
      data: {
        repository_id: repository.id,
        total_symbols: statistics.total,
        statistics
      }
    });

  } catch (error) {
    console.error('Error in analyzeRepository:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze repository',
      userMessage: 'Unable to analyze repository. Please try again later',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get repository symbols
 * @route GET /api/repositories/:id/symbols
 * @access Public
 */
export const getRepositorySymbols = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, search } = req.query;
    const repositoryId = parseInt(id);

    if (!repositoryId || isNaN(repositoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID',
        userMessage: 'Please provide a valid repository ID'
      });
    }

    const repository = await RepositoryModel.findById(repositoryId);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found',
        userMessage: 'The requested repository does not exist'
      });
    }

    let symbols;

    if (search) {
      symbols = await SymbolModel.search(repositoryId, search);
    } else if (type) {
      symbols = await SymbolModel.findByType(repositoryId, type);
    } else {
      symbols = await SymbolModel.findByRepositoryId(repositoryId);
    }

    const statistics = await SymbolModel.getStatistics(repositoryId);

    const grouped = {
      functions: symbols.filter(s => s.symbol_type === 'function'),
      classes: symbols.filter(s => s.symbol_type === 'class'),
      interfaces: symbols.filter(s => s.symbol_type === 'interface')
    };

    res.status(200).json({
      success: true,
      data: {
        repository_id: repository.id,
        repository_name: repository.repository_name,
        symbols,
        statistics,
        grouped
      }
    });

  } catch (error) {
    console.error('Error in getRepositorySymbols:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch symbols',
      userMessage: 'Unable to load symbols. Please try again later',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search repository symbols
 * @route GET /api/repositories/:id/search
 * @access Public
 */
export const searchRepositorySymbols = async (req, res) => {
  try {
    const { id } = req.params;
    const { query, type } = req.query;
    const repositoryId = parseInt(id);

    if (!repositoryId || isNaN(repositoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID',
        userMessage: 'Please provide a valid repository ID'
      });
    }

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
        userMessage: 'Please enter a search term'
      });
    }

    const repository = await RepositoryModel.findById(repositoryId);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found',
        userMessage: 'The requested repository does not exist'
      });
    }

    const symbols = await SymbolModel.searchWithFilter(repositoryId, query.trim(), type || null);

    const statistics = {
      total: symbols.length,
      functions: symbols.filter(s => s.symbol_type === 'function').length,
      classes: symbols.filter(s => s.symbol_type === 'class').length,
      interfaces: symbols.filter(s => s.symbol_type === 'interface').length
    };

    res.status(200).json({
      success: true,
      data: {
        repository_id: repository.id,
        repository_name: repository.repository_name,
        query: query.trim(),
        type_filter: type || null,
        symbols,
        statistics
      }
    });

  } catch (error) {
    console.error('Error in searchRepositorySymbols:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search symbols',
      userMessage: 'Search failed. Please try again later',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Repository chat endpoint
 * @route POST /api/repositories/:id/chat
 * @access Public
 */
export const chatWithRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;
    const repositoryId = parseInt(id);

    if (!repositoryId || isNaN(repositoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID',
        userMessage: 'Please provide a valid repository ID'
      });
    }

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
        userMessage: 'Please enter a question'
      });
    }

    const repository = await RepositoryModel.findById(repositoryId);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found',
        userMessage: 'The requested repository does not exist'
      });
    }

    const context = await contextService.getRelevantContext(repositoryId, question);

    if (context.totalSymbols === 0 && context.totalFiles === 0) {
      return res.status(400).json({
        success: false,
        message: 'Repository must be scanned and analyzed before chat',
        userMessage: 'Please scan and analyze the repository first'
      });
    }

    const answer = await geminiService.answerRepositoryQuestion(question, context);

    res.status(200).json({
      success: true,
      data: {
        repository_id: repository.id,
        repository_name: repository.repository_name,
        question,
        answer,
        context_size: {
          symbols: context.relevantSymbols.length,
          files: context.relevantFiles.length,
          total_symbols: context.totalSymbols,
          total_files: context.totalFiles
        },
        relevant_files: context.relevantFiles.map(f => ({
          file_name: f.file_name,
          file_path: f.file_path,
          relevance_score: f.relevance_score
        }))
      }
    });

  } catch (error) {
    console.error('Error in chatWithRepository:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to answer question',
      userMessage: 'Unable to get response. Please try again later',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate repository summary
 * @route POST /api/repositories/:id/summary
 * @access Public
 */
export const generateRepositorySummary = async (req, res) => {
  try {
    const { id } = req.params;
    const repositoryId = parseInt(id);

    if (!repositoryId || isNaN(repositoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID',
        userMessage: 'Please provide a valid repository ID'
      });
    }

    const repository = await RepositoryModel.findById(repositoryId);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found',
        userMessage: 'The requested repository does not exist'
      });
    }

    const symbols = await SymbolModel.findByRepositoryId(repositoryId);
    const files = await RepositoryFileModel.findByRepositoryId(repositoryId);

    if (symbols.length === 0 && files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Repository must be scanned and analyzed before generating summary',
        userMessage: 'Please scan and analyze the repository first'
      });
    }

    const context = await contextService.getRelevantContext(
      repositoryId, 
      'Generate a comprehensive project summary'
    );

    const summary = await geminiService.generateRepositorySummary(context);

    res.status(200).json({
      success: true,
      data: {
        repository_id: repository.id,
        repository_name: repository.repository_name,
        github_url: repository.github_url,
        summary,
        statistics: {
          total_files: context.totalFiles,
          total_symbols: context.totalSymbols,
          analyzed_files: context.relevantFiles.length
        }
      }
    });

  } catch (error) {
    console.error('Error in generateRepositorySummary:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate summary',
      userMessage: 'Unable to generate summary. Please try again later',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get repository insights
 * @route GET /api/repositories/:id/insights
 * @access Public
 */
export const getRepositoryInsights = async (req, res) => {
  try {
    const { id } = req.params;
    const repositoryId = parseInt(id);

    if (!repositoryId || isNaN(repositoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID',
        userMessage: 'Please provide a valid repository ID'
      });
    }

    const repository = await RepositoryModel.findById(repositoryId);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found',
        userMessage: 'The requested repository does not exist'
      });
    }

    const statistics = await SymbolModel.getStatistics(repositoryId);
    const totalFiles = await RepositoryFileModel.countByRepositoryId(repositoryId);
    
    const fileExtensions = await RepositoryFileModel.getFileExtensionStats(repositoryId);

    res.status(200).json({
      success: true,
      data: {
        repository: {
          id: repository.id,
          repository_name: repository.repository_name,
          description: repository.description,
          github_url: repository.github_url,
          scan_status: repository.scan_status,
          created_at: repository.created_at,
          updated_at: repository.updated_at
        },
        statistics: {
          total_files: totalFiles,
          total_symbols: statistics.total,
          total_functions: statistics.functions,
          total_classes: statistics.classes,
          total_interfaces: statistics.interfaces
        },
        file_types: fileExtensions,
        last_scan_date: repository.updated_at
      }
    });

  } catch (error) {
    console.error('Error in getRepositoryInsights:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch insights',
      userMessage: 'Unable to load insights. Please try again later',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  analyzeRepository,
  getRepositorySymbols,
  searchRepositorySymbols,
  chatWithRepository,
  generateRepositorySummary,
  getRepositoryInsights
};
