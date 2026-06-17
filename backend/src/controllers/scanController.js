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
  try {
    const { id } = req.params;

    const repository = await RepositoryModel.findById(parseInt(id));
    
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
        message: 'Repository already scanned. Delete existing scan data to rescan.',
        userMessage: 'Repository already scanned',
        data: {
          repository_id: repository.id,
          total_files: repository.total_files
        }
      });
    }

    await RepositoryModel.updateScanStatus(repository.id, 'scanning', 0);

    let localPath;
    try {
      localPath = await gitCloner.cloneRepository(repository.github_url, repository.id);
    } catch (error) {
      await RepositoryModel.updateScanStatus(repository.id, 'failed', 0);
      return res.status(500).json({
        success: false,
        message: 'Failed to clone repository',
        userMessage: 'Failed to clone repository',
        error: error.message
      });
    }

    let files;
    try {
      files = await fileScanner.scanRepository(localPath);
    } catch (error) {
      await RepositoryModel.updateScanStatus(repository.id, 'failed', 0);
      return res.status(500).json({
        success: false,
        message: 'Failed to scan repository files',
        userMessage: 'Failed to scan repository files',
        error: error.message
      });
    }

    await RepositoryFileModel.deleteByRepositoryId(repository.id);

    if (files.length > 0) {
      await RepositoryFileModel.createBatch(repository.id, files);
    }

    await RepositoryModel.updateScanStatus(repository.id, 'completed', files.length);

    const statistics = fileScanner.getStatistics(files);

    res.status(200).json({
      success: true,
      message: 'Repository scanned successfully',
      data: {
        repository_id: repository.id,
        total_files: files.length,
        statistics
      }
    });

  } catch (error) {
    console.error('Error in scanRepository:', error);
    
    if (req.params.id) {
      await RepositoryModel.updateScanStatus(parseInt(req.params.id), 'failed', 0).catch(() => {});
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to scan repository',
      userMessage: 'An error occurred during scanning',
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
