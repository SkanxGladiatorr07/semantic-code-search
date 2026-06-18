/**
 * Git Cloner Utility
 * Clones GitHub repositories
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import env from '../config/env.js';

const execPromise = promisify(exec);

class GitCloner {
  constructor() {
    this.cloneDir = path.join(process.cwd(), env.clone.directory);
  }

  /**
   * Initialize clone directory
   */
  async initializeCloneDir() {
    try {
      await fs.mkdir(this.cloneDir, { recursive: true });
    } catch (error) {
      console.error('Error creating clone directory:', error);
      throw error;
    }
  }

  /**
   * Get repository local path
   * @param {number} repositoryId - Repository ID
   * @returns {string}
   */
  getRepositoryPath(repositoryId) {
    return path.join(this.cloneDir, `repo_${repositoryId}`);
  }

  /**
   * Clone repository
   * @param {string} githubUrl - GitHub URL
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<string>} - Local path
   */
  async cloneRepository(githubUrl, repositoryId) {
    await this.initializeCloneDir();
    
    const localPath = this.getRepositoryPath(repositoryId);

    try {
      await fs.rm(localPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore
    }

    try {
      const { stdout, stderr } = await execPromise(
        `git clone --depth 1 --single-branch "${githubUrl}" "${localPath}"`,
        { 
          maxBuffer: 1024 * 1024 * 50,
          timeout: env.clone.timeout
        }
      );

      if (stderr && !stderr.includes('Cloning into')) {
        console.warn('Git clone warning:', stderr);
      }

      const exists = await this.isRepositoryCloned(repositoryId);
      if (!exists) {
        throw new Error('Repository directory not created after clone');
      }

      return localPath;
    } catch (error) {
      console.error('Error cloning repository:', error);
      
      try {
        await fs.rm(localPath, { recursive: true, force: true });
      } catch (cleanupError) {
        // Ignore cleanup errors
      }

      if (error.killed || error.signal === 'SIGTERM') {
        throw new Error('Clone operation timed out - repository too large');
      }

      const message = error.message.toLowerCase();
      if (message.includes('not found') || message.includes('404')) {
        throw new Error('Repository not found or is private');
      }
      if (message.includes('authentication') || message.includes('permission')) {
        throw new Error('Authentication required - repository may be private');
      }
      if (message.includes('could not resolve host')) {
        throw new Error('Network error - unable to reach GitHub');
      }

      throw new Error(`Failed to clone repository: ${error.message}`);
    }
  }

  /**
   * Delete cloned repository
   * @param {number} repositoryId - Repository ID
   */
  async deleteRepository(repositoryId) {
    const localPath = this.getRepositoryPath(repositoryId);
    
    try {
      await fs.rm(localPath, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting repository:', error);
      throw new Error('Failed to delete cloned repository');
    }
  }

  /**
   * Check if repository is cloned
   * @param {number} repositoryId - Repository ID
   * @returns {Promise<boolean>}
   */
  async isRepositoryCloned(repositoryId) {
    const localPath = this.getRepositoryPath(repositoryId);
    
    try {
      await fs.access(localPath);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new GitCloner();
