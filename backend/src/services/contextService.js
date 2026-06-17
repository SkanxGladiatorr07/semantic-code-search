/**
 * Context Service
 * Retrieves relevant code context for AI queries
 */

import RepositoryModel from '../models/RepositoryModel.js';
import RepositoryFileModel from '../models/RepositoryFileModel.js';
import SymbolModel from '../models/SymbolModel.js';
import codeParser from '../utils/codeParser.js';
import gitCloner from '../utils/gitCloner.js';
import fs from 'fs/promises';
import path from 'path';

class ContextService {
  /**
   * Get relevant context for a question
   * @param {number} repositoryId - Repository ID
   * @param {string} question - User question
   * @returns {Promise<Object>} Context object
   */
  async getRelevantContext(repositoryId, question) {
    try {
      const [repository, symbols, files] = await Promise.all([
        RepositoryModel.findById(repositoryId),
        SymbolModel.findByRepositoryId(repositoryId),
        RepositoryFileModel.findByRepositoryId(repositoryId)
      ]);

      const relevantFiles = this.findRelevantFiles(question, symbols, files);
      
      const topFiles = relevantFiles.slice(0, 3);
      
      const fileContents = await this.readFileContents(
        repository.id,
        topFiles
      );

      const relevantSymbols = topFiles
        .map(f => f.symbols)
        .flat()
        .slice(0, 50);

      return {
        repository: {
          repository_name: repository.repository_name,
          description: repository.description,
          github_url: repository.github_url
        },
        relevantSymbols,
        relevantFiles: fileContents,
        totalSymbols: symbols.length,
        totalFiles: files.length
      };
    } catch (error) {
      console.error('Error getting relevant context:', error);
      throw new Error('Failed to retrieve context');
    }
  }

  /**
   * Find files relevant to the question
   * @param {string} question - User question
   * @param {Array} symbols - All symbols
   * @param {Array} files - All files
   * @returns {Array} Relevant files with symbols
   */
  findRelevantFiles(question, symbols, files) {
    const questionLower = question.toLowerCase();
    const keywords = this.extractKeywords(questionLower);

    const fileScores = new Map();

    symbols.forEach(symbol => {
      const symbolNameLower = symbol.symbol_name.toLowerCase();
      const fileNameLower = symbol.file_name.toLowerCase();
      
      let score = 0;

      keywords.forEach(keyword => {
        if (symbolNameLower.includes(keyword)) score += 10;
        if (fileNameLower.includes(keyword)) score += 5;
        if (symbol.symbol_type === keyword) score += 8;
      });

      if (score > 0) {
        if (!fileScores.has(symbol.file_id)) {
          fileScores.set(symbol.file_id, {
            file_id: symbol.file_id,
            file_name: symbol.file_name,
            file_path: symbol.file_path,
            file_extension: symbol.file_extension,
            score: 0,
            symbols: []
          });
        }
        
        const fileData = fileScores.get(symbol.file_id);
        fileData.score += score;
        fileData.symbols.push(symbol);
      }
    });

    if (fileScores.size === 0) {
      const topFiles = files.slice(0, 3).map(f => ({
        file_id: f.id,
        file_name: f.file_name,
        file_path: f.file_path,
        file_extension: f.file_extension,
        score: 0,
        symbols: []
      }));
      return topFiles;
    }

    return Array.from(fileScores.values())
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Extract keywords from question
   * @param {string} question - Question text
   * @returns {Array} Keywords
   */
  extractKeywords(question) {
    const stopWords = new Set([
      'what', 'how', 'why', 'where', 'when', 'who', 'which', 'the', 'is', 'are',
      'does', 'do', 'can', 'could', 'should', 'would', 'this', 'that', 'these',
      'those', 'i', 'you', 'me', 'my', 'your', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'about', 'a', 'an', 'and', 'or', 'but'
    ]);

    return question
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }

  /**
   * Read contents of relevant files
   * @param {number} repositoryId - Repository ID
   * @param {Array} relevantFiles - Files to read
   * @returns {Promise<Array>} File contents
   */
  async readFileContents(repositoryId, relevantFiles) {
    const repositoryPath = gitCloner.getRepositoryPath(repositoryId);
    const fileContents = [];
    const MAX_FILE_SIZE = 2000;
    const MAX_TOTAL_CONTEXT = 8000;
    let totalChars = 0;

    for (const fileData of relevantFiles) {
      if (totalChars >= MAX_TOTAL_CONTEXT) break;

      try {
        const fullPath = path.join(repositoryPath, fileData.file_path);
        const content = await fs.readFile(fullPath, 'utf-8');
        
        const remainingSpace = MAX_TOTAL_CONTEXT - totalChars;
        const allowedSize = Math.min(MAX_FILE_SIZE, remainingSpace);
        
        const truncatedContent = content.length > allowedSize
          ? content.substring(0, allowedSize) + '\n... (truncated)'
          : content;

        totalChars += truncatedContent.length;

        fileContents.push({
          file_name: fileData.file_name,
          file_path: fileData.file_path,
          file_extension: fileData.file_extension,
          content: truncatedContent,
          symbols: fileData.symbols,
          relevance_score: fileData.score,
          line_count: content.split('\n').length,
          char_count: content.length
        });
      } catch (error) {
        console.warn(`Failed to read file ${fileData.file_path}:`, error.message);
      }
    }

    return fileContents;
  }

  /**
   * Build context string for AI
   * @param {Object} context - Context object
   * @returns {string} Formatted context
   */
  buildContextString(context) {
    let contextStr = `Repository: ${context.repository.repository_name}\n`;
    
    if (context.repository.description) {
      contextStr += `Description: ${context.repository.description}\n`;
    }

    contextStr += `\nTotal: ${context.totalFiles} files, ${context.totalSymbols} symbols\n`;
    contextStr += `\nRelevant Symbols:\n`;
    
    context.relevantSymbols.slice(0, 20).forEach(symbol => {
      contextStr += `- ${symbol.symbol_type} ${symbol.symbol_name} in ${symbol.file_name}\n`;
    });

    contextStr += `\nRelevant Code Files:\n\n`;
    
    context.relevantFiles.forEach(file => {
      contextStr += `=== ${file.file_path} ===\n`;
      contextStr += `${file.content}\n\n`;
    });

    return contextStr;
  }

  /**
   * Get file by path
   * @param {number} repositoryId - Repository ID
   * @param {string} filePath - File path
   * @returns {Promise<Object>} File content
   */
  async getFileByPath(repositoryId, filePath) {
    try {
      const repositoryPath = gitCloner.getRepositoryPath(repositoryId);
      const fullPath = path.join(repositoryPath, filePath);
      const content = await fs.readFile(fullPath, 'utf-8');

      return {
        file_path: filePath,
        content
      };
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error('Failed to read file');
    }
  }
}

export default new ContextService();
