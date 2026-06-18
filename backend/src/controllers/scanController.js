/**
 * Scan Controller
 * Handles repository scanning operations
 */

import RepositoryModel from '../models/RepositoryModel.js';
import RepositoryFileModel from '../models/RepositoryFileModel.js';
import gitCloner from '../utils/gitCloner.js';
import fileScanner from '../utils/fileScanner.js';

/**
 * Scan repository
 * @route POST /api/repositories/:id/scan
 * @access Public
 */
export const scanRepository = async (req, res) => {
  const repositoryId = parseInt(req.params.id);
  
  try {
    const repository = await RepositoryModel.findById(repositoryId);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found',
        userMessage: 'Repository not found'
      });
    }

    if (repository.scan_status === 'scanning') {
      return res.status(409).json({
        success: false,
        message: 'Repository is already being scanned',
        userMessage: 'Scan already in progress'
      });
    }

    if (repository.scan_status === 'completed' && repository.total_files > 0) {
      return res.status(409).json({
        success: false,
        message: 'Repository already scanned',
        userMessage: 'Repository already scanned',
        data: {
          repository_id: repository.id,
          total_files: repository.total_files
        }
      });
    }

    await RepositoryModel.updateScanStatus(repositoryId, 'scanning', 0);

    let localPath;
    try {
      localPath = await gitCloner.cloneRepository(repository.github_url, repositoryId);
    } catch (cloneError) {
      console.error('Clone error:', cloneError.message);
      await RepositoryModel.updateScanStatus(repositoryId, 'failed', 0);
      
      return res.status(400).json({
        success: false,
        message: cloneError.message,
        userMessage: cloneError.message,
        error_type: 'clone_failed'
      });
    }

    let files = [];
    try {
      files = await fileScanner.scanRepository(localPath);
    } catch (scanError) {
      console.error('Scan error:', scanError.message);
      await RepositoryModel.updateScanStatus(repositoryId, 'failed', 0);
      
      try {
        await gitCloner.deleteRepository(repositoryId);
      } catch (deleteError) {
        console.warn('Failed to cleanup after scan error:', deleteError.message);
      }
      
      return res.status(500).json({
        success: false,
        message: scanError.message,
        userMessage: 'Failed to scan repository files',
        error_type: 'scan_failed'
      });
    }

    try {
      await RepositoryFileModel.deleteByRepositoryId(repositoryId);

      if (files.length > 0) {
        await RepositoryFileModel.createBatch(repositoryId, files);
      }

      await RepositoryModel.updateScanStatus(repositoryId, 'completed', files.length);
    } catch (dbError) {
      console.error('Database error:', dbError.message);
      await RepositoryModel.updateScanStatus(repositoryId, 'failed', 0);
      
      return res.status(500).json({
        success: false,
        message: 'Database error while saving files',
        userMessage: 'Failed to save scan results',
        error_type: 'database_error'
      });
    }

    const statistics = fileScanner.getStatistics(files);

    res.status(200).json({
      success: true,
      message: files.length === 0 ? 'Repository is empty' : 'Repository scanned successfully',
      data: {
        repository_id: repositoryId,
        total_files: files.length,
        statistics,
        is_empty: files.length === 0
      }
    });

  } catch (error) {
    console.error('Unexpected error in scanRepository:', error);
    
    try {
      await RepositoryModel.updateScanStatus(repositoryId, 'failed', 0);
    } catch (statusError) {
      console.error('Failed to update status after error:', statusError.message);
    }
    
    res.status(500).json({
      success: false,
      message: 'Unexpected error during scan',
      userMessage: 'An unexpected error occurred',
      error_type: 'unexpected_error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get repository files
 * @route GET /api/repositories/:id/files
 * @access Public
 */
export const getRepositoryFiles = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify repository exists
    const repository = await RepositoryModel.findById(parseInt(id));
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    // Get files
    const files = await RepositoryFileModel.findByRepositoryId(parseInt(id));

    // Get statistics
    const statistics = await RepositoryFileModel.getStatistics(parseInt(id));

    res.status(200).json({
      success: true,
      data: {
        repository,
        files,
        total_files: files.length,
        statistics
      }
    });

  } catch (error) {
    console.error(`Error in getRepositoryFiles for ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repository files',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  scanRepository,
  getRepositoryFiles
};
