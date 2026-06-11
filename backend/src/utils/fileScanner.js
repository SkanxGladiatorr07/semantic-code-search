/**
 * File Scanner Utility
 * Scans repository files recursively
 */

import fs from 'fs/promises';
import path from 'path';

class FileScanner {
  constructor() {
    this.ignoredDirs = new Set([
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      '.nuxt',
      'coverage',
      '.cache',
      'vendor',
      '__pycache__',
      '.venv',
      'venv',
      'target',
      'bin',
      'obj'
    ]);

    this.ignoredFiles = new Set([
      '.DS_Store',
      'Thumbs.db',
      '.gitignore',
      '.gitattributes',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml'
    ]);
  }

  /**
   * Scan directory recursively
   * @param {string} dirPath - Directory path
   * @param {string} basePath - Base path for relative paths
   * @returns {Promise<Array>}
   */
  async scanDirectory(dirPath, basePath = dirPath) {
    const files = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(basePath, fullPath);

        if (entry.isDirectory()) {
          // Skip ignored directories
          if (this.ignoredDirs.has(entry.name)) {
            continue;
          }

          // Recursively scan subdirectory
          const subFiles = await this.scanDirectory(fullPath, basePath);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          // Skip ignored files
          if (this.ignoredFiles.has(entry.name)) {
            continue;
          }

          // Get file stats
          const stats = await fs.stat(fullPath);
          const extension = path.extname(entry.name).toLowerCase();

          files.push({
            file_name: entry.name,
            file_path: relativePath.replace(/\\/g, '/'), // Normalize path separators
            file_extension: extension || null,
            file_size: stats.size
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error);
      // Continue scanning other directories
    }

    return files;
  }

  /**
   * Scan repository
   * @param {string} repositoryPath - Repository local path
   * @returns {Promise<Array>}
   */
  async scanRepository(repositoryPath) {
    try {
      // Verify directory exists
      await fs.access(repositoryPath);
      
      // Scan all files
      const files = await this.scanDirectory(repositoryPath);
      
      return files;
    } catch (error) {
      console.error('Error scanning repository:', error);
      throw new Error('Failed to scan repository files');
    }
  }

  /**
   * Get file statistics
   * @param {Array} files - Array of file objects
   * @returns {Object}
   */
  getStatistics(files) {
    const stats = {
      total_files: files.length,
      total_size: 0,
      extensions: {}
    };

    files.forEach(file => {
      stats.total_size += file.file_size || 0;
      
      const ext = file.file_extension || 'no extension';
      if (!stats.extensions[ext]) {
        stats.extensions[ext] = 0;
      }
      stats.extensions[ext]++;
    });

    return stats;
  }
}

export default new FileScanner();
