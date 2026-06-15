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

    const repository = await RepositoryModel.findById(parseInt(id));
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    if (repository.scan_status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Repository must be scanned before analysis'
      });
    }

    const files = await RepositoryFileModel.findByRepositoryId(parseInt(id));
    
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files found in repository'
      });
    }

    await SymbolModel.deleteByRepositoryId(parseInt(id));

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
      await SymbolModel.createBatch(parseInt(id), symbolsToSave);
    }

    const statistics = await SymbolModel.getStatistics(parseInt(id));

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

    const repository = await RepositoryModel.findById(parseInt(id));
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    let symbols;

    if (search) {
      symbols = await SymbolModel.search(parseInt(id), search);
    } else if (type) {
      symbols = await SymbolModel.findByType(parseInt(id), type);
    } else {
      symbols = await SymbolModel.findByRepositoryId(parseInt(id));
    }

    const statistics = await SymbolModel.getStatistics(parseInt(id));

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

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const repository = await RepositoryModel.findById(parseInt(id));
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    const symbols = await SymbolModel.searchWithFilter(parseInt(id), query.trim(), type || null);

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

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    const repository = await RepositoryModel.findById(parseInt(id));
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    const context = await contextService.getRelevantContext(parseInt(id), question);

    if (context.totalSymbols === 0 && context.totalFiles === 0) {
      return res.status(400).json({
        success: false,
        message: 'Repository must be scanned and analyzed before chat'
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

    const repository = await RepositoryModel.findById(parseInt(id));
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    const symbols = await SymbolModel.findByRepositoryId(parseInt(id));
    const files = await RepositoryFileModel.findByRepositoryId(parseInt(id));

    if (symbols.length === 0 && files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Repository must be scanned and analyzed before generating summary'
      });
    }

    const context = await contextService.getRelevantContext(
      parseInt(id), 
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  analyzeRepository,
  getRepositorySymbols,
  searchRepositorySymbols,
  chatWithRepository,
  generateRepositorySummary
};
