/**
 * Parser Controller
 * Handles code parsing operations
 */

import RepositoryFileModel from '../models/RepositoryFileModel.js';
import RepositoryModel from '../models/RepositoryModel.js';
import gitCloner from '../utils/gitCloner.js';
import codeParser from '../utils/codeParser.js';

/**
 * Parse repository files
 * @route POST /api/repositories/:id/parse
 * @access Public
 */
export const parseRepositoryFiles = async (req, res) => {
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
        message: 'Repository must be scanned first'
      });
    }

    const files = await RepositoryFileModel.findByRepositoryId(parseInt(id));
    
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files found in repository'
      });
    }

    const repositoryPath = gitCloner.getRepositoryPath(repository.id);
    const parsedFiles = await codeParser.parseFiles(files, repositoryPath);
    
    const statistics = codeParser.getStatistics(parsedFiles);

    res.status(200).json({
      success: true,
      data: {
        repository_id: repository.id,
        total_files: files.length,
        parsed_files: parsedFiles.length,
        skipped_files: files.length - parsedFiles.length,
        statistics,
        parsed_data: parsedFiles
      }
    });

  } catch (error) {
    console.error('Error in parseRepositoryFiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to parse repository files',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Parse specific file
 * @route GET /api/repositories/:id/files/:fileId/parse
 * @access Public
 */
export const parseSpecificFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;

    const repository = await RepositoryModel.findById(parseInt(id));
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    const files = await RepositoryFileModel.findByRepositoryId(parseInt(id));
    const file = files.find(f => f.id === parseInt(fileId));

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    if (!codeParser.isSupported(file.file_path)) {
      return res.status(400).json({
        success: false,
        message: 'File type not supported for parsing'
      });
    }

    const repositoryPath = gitCloner.getRepositoryPath(repository.id);
    const parsedFile = await codeParser.parseFiles([file], repositoryPath);

    if (parsedFile.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to parse file'
      });
    }

    res.status(200).json({
      success: true,
      data: parsedFile[0]
    });

  } catch (error) {
    console.error('Error in parseSpecificFile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to parse file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  parseRepositoryFiles,
  parseSpecificFile
};
