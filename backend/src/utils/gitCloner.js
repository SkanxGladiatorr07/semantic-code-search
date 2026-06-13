/**
 * Git Cloner Utility
 * Clones GitHub repositories
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execPromise = promisify(exec);

class GitCloner {
  constructor() {
    this.cloneDir = path.join(process.cwd(), 'cloned_repos');
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

    // Delete existing directory if it exists
    try {
      await fs.rm(localPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore if directory doesn't exist
    }

    try {
      // Clone with depth 1 for faster cloning
      const { stdout, stderr } = await execPromise(
        `git clone --depth 1 "${githubUrl}" "${localPath}"`,
        { maxBuffer: 1024 * 1024 * 10 } // 10MB buffer
      );

      if (stderr && !stderr.includes('Cloning into')) {
        console.error('Git clone stderr:', stderr);
      }

      return localPath;
    } catch (error) {
      console.error('Error cloning repository:', error);
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
