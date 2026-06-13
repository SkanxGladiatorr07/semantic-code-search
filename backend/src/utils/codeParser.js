/**
 * Code Parser Utility
 * Parses source code files and extracts metadata
 */

import fs from 'fs/promises';
import path from 'path';

class CodeParser {
  constructor() {
    this.supportedExtensions = new Set([
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.java',
      '.py'
    ]);
  }

  /**
   * Check if file type is supported
   * @param {string} filePath - File path
   * @returns {boolean}
   */
  isSupported(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return this.supportedExtensions.has(ext);
  }

  /**
   * Parse a single file
   * @param {string} filePath - Full file path
   * @returns {Promise<Object|null>}
   */
  async parseFile(filePath) {
    if (!this.isSupported(filePath)) {
      return null;
    }

    try {
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath, 'utf-8');
      const ext = path.extname(filePath).toLowerCase();

      const metadata = {
        file_path: filePath,
        file_name: path.basename(filePath),
        file_extension: ext,
        file_size: stats.size,
        content: content,
        line_count: content.split('\n').length,
        char_count: content.length,
        language: this.getLanguage(ext),
        parsed_at: new Date().toISOString()
      };

      // Extract language-specific metadata
      switch (ext) {
        case '.js':
        case '.jsx':
        case '.ts':
        case '.tsx':
          return this.parseJavaScript(metadata);
        case '.java':
          return this.parseJava(metadata);
        case '.py':
          return this.parsePython(metadata);
        default:
          return metadata;
      }
    } catch (error) {
      console.error(`Error parsing file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get language from extension
   * @param {string} ext - File extension
   * @returns {string}
   */
  getLanguage(ext) {
    const languageMap = {
      '.js': 'JavaScript',
      '.jsx': 'JavaScript (React)',
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript (React)',
      '.java': 'Java',
      '.py': 'Python'
    };
    return languageMap[ext] || 'Unknown';
  }

  /**
   * Parse JavaScript/TypeScript files
   * @param {Object} metadata - Base metadata
   * @returns {Object}
   */
  parseJavaScript(metadata) {
    const content = metadata.content;

    // Extract imports
    const imports = [];
    const importRegex = /import\s+(?:{[^}]*}|[^'";\n]+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    // Extract exports
    const exports = [];
    const exportRegex = /export\s+(?:default\s+)?(?:const|let|var|function|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    // Extract functions
    const functions = [];
    const functionRegex = /(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>)/g;
    while ((match = functionRegex.exec(content)) !== null) {
      functions.push(match[1] || match[2]);
    }

    // Extract classes
    const classes = [];
    const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match[1]);
    }

    // Count comments
    const singleLineComments = (content.match(/\/\/.*/g) || []).length;
    const multiLineComments = (content.match(/\/\*[\s\S]*?\*\//g) || []).length;

    return {
      ...metadata,
      imports,
      exports,
      functions,
      classes,
      has_jsx: content.includes('<') && content.includes('/>'),
      comment_count: singleLineComments + multiLineComments,
      is_module: imports.length > 0 || exports.length > 0
    };
  }

  /**
   * Parse Java files
   * @param {Object} metadata - Base metadata
   * @returns {Object}
   */
  parseJava(metadata) {
    const content = metadata.content;

    // Extract package
    const packageMatch = content.match(/package\s+([\w.]+);/);
    const packageName = packageMatch ? packageMatch[1] : null;

    // Extract imports
    const imports = [];
    const importRegex = /import\s+((?:static\s+)?[\w.]+);/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    // Extract classes
    const classes = [];
    const classRegex = /(?:public|private|protected)?\s*(?:abstract|final)?\s*class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match[1]);
    }

    // Extract interfaces
    const interfaces = [];
    const interfaceRegex = /(?:public|private|protected)?\s*interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((match = interfaceRegex.exec(content)) !== null) {
      interfaces.push(match[1]);
    }

    // Extract methods
    const methods = [];
    const methodRegex = /(?:public|private|protected)\s+(?:static\s+)?(?:\w+\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*{/g;
    while ((match = methodRegex.exec(content)) !== null) {
      methods.push(match[1]);
    }

    // Count comments
    const singleLineComments = (content.match(/\/\/.*/g) || []).length;
    const multiLineComments = (content.match(/\/\*[\s\S]*?\*\//g) || []).length;

    return {
      ...metadata,
      package: packageName,
      imports,
      classes,
      interfaces,
      methods,
      comment_count: singleLineComments + multiLineComments
    };
  }

  /**
   * Parse Python files
   * @param {Object} metadata - Base metadata
   * @returns {Object}
   */
  parsePython(metadata) {
    const content = metadata.content;

    // Extract imports
    const imports = [];
    const importRegex = /(?:from\s+([\w.]+)\s+)?import\s+([\w,\s*]+)/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1] ? `${match[1]}.${match[2]}` : match[2]);
    }

    // Extract functions
    const functions = [];
    const functionRegex = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    while ((match = functionRegex.exec(content)) !== null) {
      functions.push(match[1]);
    }

    // Extract classes
    const classes = [];
    const classRegex = /class\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match[1]);
    }

    // Count comments
    const singleLineComments = (content.match(/#.*/g) || []).length;
    const multiLineComments = (content.match(/'''[\s\S]*?'''|"""[\s\S]*?"""/g) || []).length;

    // Check if it's a module
    const hasMain = content.includes('if __name__ == "__main__"');

    return {
      ...metadata,
      imports,
      functions,
      classes,
      has_main: hasMain,
      comment_count: singleLineComments + multiLineComments
    };
  }

  /**
   * Parse multiple files
   * @param {Array<Object>} files - Array of file objects with file_path
   * @param {string} basePath - Base repository path
   * @returns {Promise<Array>}
   */
  async parseFiles(files, basePath) {
    const results = [];

    for (const file of files) {
      const fullPath = path.join(basePath, file.file_path);
      const parsed = await this.parseFile(fullPath);
      
      if (parsed) {
        results.push({
          ...file,
          parsed_content: parsed
        });
      }
    }

    return results;
  }

  /**
   * Get parsing statistics
   * @param {Array} parsedFiles - Array of parsed files
   * @returns {Object}
   */
  getStatistics(parsedFiles) {
    const stats = {
      total_files: parsedFiles.length,
      total_lines: 0,
      total_chars: 0,
      languages: {},
      total_functions: 0,
      total_classes: 0,
      total_imports: 0
    };

    parsedFiles.forEach(file => {
      const parsed = file.parsed_content;
      
      stats.total_lines += parsed.line_count || 0;
      stats.total_chars += parsed.char_count || 0;

      // Count by language
      const lang = parsed.language;
      if (!stats.languages[lang]) {
        stats.languages[lang] = 0;
      }
      stats.languages[lang]++;

      // Count functions and classes
      if (parsed.functions) {
        stats.total_functions += parsed.functions.length;
      }
      if (parsed.methods) {
        stats.total_functions += parsed.methods.length;
      }
      if (parsed.classes) {
        stats.total_classes += parsed.classes.length;
      }
      if (parsed.imports) {
        stats.total_imports += parsed.imports.length;
      }
    });

    return stats;
  }
}

export default new CodeParser();
