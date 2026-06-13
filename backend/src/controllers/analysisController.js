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

export default {
  analyzeRepository,
  getRepositorySymbols
};
