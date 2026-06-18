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
  async scanDirectory(dirPath, basePath = dirPath, depth = 0) {
    const MAX_DEPTH = 20;
    const MAX_FILES = 50000;
    const files = [];

    if (depth > MAX_DEPTH) {
      console.warn(`Max depth ${MAX_DEPTH} reached at ${dirPath}`);
      return files;
    }

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (files.length >= MAX_FILES) {
          console.warn(`Max files limit ${MAX_FILES} reached`);
          break;
        }

        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(basePath, fullPath);

        if (entry.isDirectory()) {
          if (this.ignoredDirs.has(entry.name)) {
            continue;
          }

          if (entry.name.startsWith('.') && entry.name !== '.github') {
            continue;
          }

          const subFiles = await this.scanDirectory(fullPath, basePath, depth + 1);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          if (this.ignoredFiles.has(entry.name)) {
            continue;
          }

          try {
            const stats = await fs.stat(fullPath);
            
            if (stats.size > 10 * 1024 * 1024) {
              console.warn(`Skipping large file: ${relativePath} (${stats.size} bytes)`);
              continue;
            }

            const extension = path.extname(entry.name).toLowerCase();

            files.push({
              file_name: entry.name,
              file_path: relativePath.replace(/\\/g, '/'),
              file_extension: extension || null,
              file_size: stats.size
            });
          } catch (statError) {
            console.warn(`Failed to stat file ${relativePath}:`, statError.message);
          }
        }
      }
    } catch (error) {
      if (error.code === 'EACCES' || error.code === 'EPERM') {
        console.warn(`Permission denied: ${dirPath}`);
      } else if (error.code === 'ENOENT') {
        console.warn(`Directory not found: ${dirPath}`);
      } else {
        console.error(`Error scanning directory ${dirPath}:`, error.message);
      }
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
      await fs.access(repositoryPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('Repository directory does not exist');
      }
      throw new Error('Cannot access repository directory');
    }

    try {
      const files = await this.scanDirectory(repositoryPath);
      
      if (files.length === 0) {
        console.warn('No files found in repository');
      }

      return files;
    } catch (error) {
      console.error('Error scanning repository:', error);
      throw new Error(`Failed to scan repository: ${error.message}`);
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
