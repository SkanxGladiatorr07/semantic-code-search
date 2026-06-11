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

    // Get repository
    const repository = await RepositoryModel.findById(parseInt(id));
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    // Update status to scanning
    await RepositoryModel.updateScanStatus(repository.id, 'scanning', 0);

    // Clone repository
    let localPath;
    try {
      localPath = await gitCloner.cloneRepository(repository.github_url, repository.id);
    } catch (error) {
      await RepositoryModel.updateScanStatus(repository.id, 'failed', 0);
      return res.status(500).json({
        success: false,
        message: 'Failed to clone repository',
        error: error.message
      });
    }

    // Scan files
    let files;
    try {
      files = await fileScanner.scanRepository(localPath);
    } catch (error) {
      await RepositoryModel.updateScanStatus(repository.id, 'failed', 0);
      return res.status(500).json({
        success: false,
        message: 'Failed to scan repository files',
        error: error.message
      });
    }

    // Delete existing files for this repository
    await RepositoryFileModel.deleteByRepositoryId(repository.id);

    // Save files to database
    if (files.length > 0) {
      await RepositoryFileModel.createBatch(repository.id, files);
    }

    // Update scan status to completed
    await RepositoryModel.updateScanStatus(repository.id, 'completed', files.length);

    // Get statistics
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
    res.status(500).json({
      success: false,
      message: 'Failed to scan repository',
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
