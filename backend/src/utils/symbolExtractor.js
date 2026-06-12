/**
 * Symbol Extractor Utility
 * Extracts functions and classes from parsed code
 */

class SymbolExtractor {
  /**
   * Extract symbols from parsed files
   * @param {Array} parsedFiles - Array of parsed file objects
   * @returns {Array}
   */
  extractSymbols(parsedFiles) {
    const symbols = [];

    parsedFiles.forEach(file => {
      const parsed = file.parsed_content;
      
      if (!parsed) return;

      const filePath = parsed.file_path;
      const fileName = parsed.file_name;

      // Extract functions
      if (parsed.functions && Array.isArray(parsed.functions)) {
        parsed.functions.forEach(funcName => {
          symbols.push({
            name: funcName,
            type: 'function',
            file_path: filePath,
            file_name: fileName,
            language: parsed.language
          });
        });
      }

      // Extract methods (Java)
      if (parsed.methods && Array.isArray(parsed.methods)) {
        parsed.methods.forEach(methodName => {
          symbols.push({
            name: methodName,
            type: 'function',
            file_path: filePath,
            file_name: fileName,
            language: parsed.language
          });
        });
      }

      // Extract classes
      if (parsed.classes && Array.isArray(parsed.classes)) {
        parsed.classes.forEach(className => {
          symbols.push({
            name: className,
            type: 'class',
            file_path: filePath,
            file_name: fileName,
            language: parsed.language
          });
        });
      }

      // Extract interfaces (Java)
      if (parsed.interfaces && Array.isArray(parsed.interfaces)) {
        parsed.interfaces.forEach(interfaceName => {
          symbols.push({
            name: interfaceName,
            type: 'interface',
            file_path: filePath,
            file_name: fileName,
            language: parsed.language
          });
        });
      }
    });

    return symbols;
  }

  /**
   * Group symbols by type
   * @param {Array} symbols - Array of symbol objects
   * @returns {Object}
   */
  groupByType(symbols) {
    const grouped = {
      functions: [],
      classes: [],
      interfaces: []
    };

    symbols.forEach(symbol => {
      if (symbol.type === 'function') {
        grouped.functions.push(symbol);
      } else if (symbol.type === 'class') {
        grouped.classes.push(symbol);
      } else if (symbol.type === 'interface') {
        grouped.interfaces.push(symbol);
      }
    });

    return grouped;
  }

  /**
   * Group symbols by file
   * @param {Array} symbols - Array of symbol objects
   * @returns {Object}
   */
  groupByFile(symbols) {
    const grouped = {};

    symbols.forEach(symbol => {
      const filePath = symbol.file_path;
      
      if (!grouped[filePath]) {
        grouped[filePath] = {
          file_path: filePath,
          file_name: symbol.file_name,
          language: symbol.language,
          symbols: []
        };
      }

      grouped[filePath].symbols.push({
        name: symbol.name,
        type: symbol.type
      });
    });

    return Object.values(grouped);
  }

  /**
   * Get symbol statistics
   * @param {Array} symbols - Array of symbol objects
   * @returns {Object}
   */
  getStatistics(symbols) {
    const stats = {
      total_symbols: symbols.length,
      functions: 0,
      classes: 0,
      interfaces: 0,
      by_language: {}
    };

    symbols.forEach(symbol => {
      if (symbol.type === 'function') stats.functions++;
      if (symbol.type === 'class') stats.classes++;
      if (symbol.type === 'interface') stats.interfaces++;

      const lang = symbol.language;
      if (!stats.by_language[lang]) {
        stats.by_language[lang] = {
          functions: 0,
          classes: 0,
          interfaces: 0
        };
      }

      if (symbol.type === 'function') stats.by_language[lang].functions++;
      if (symbol.type === 'class') stats.by_language[lang].classes++;
      if (symbol.type === 'interface') stats.by_language[lang].interfaces++;
    });

    return stats;
  }

  /**
   * Search symbols by name
   * @param {Array} symbols - Array of symbol objects
   * @param {string} query - Search query
   * @returns {Array}
   */
  searchSymbols(symbols, query) {
    const lowerQuery = query.toLowerCase();
    
    return symbols.filter(symbol => 
      symbol.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter symbols by type
   * @param {Array} symbols - Array of symbol objects
   * @param {string} type - Symbol type (function, class, interface)
   * @returns {Array}
   */
  filterByType(symbols, type) {
    return symbols.filter(symbol => symbol.type === type);
  }

  /**
   * Filter symbols by language
   * @param {Array} symbols - Array of symbol objects
   * @param {string} language - Programming language
   * @returns {Array}
   */
  filterByLanguage(symbols, language) {
    return symbols.filter(symbol => 
      symbol.language.toLowerCase().includes(language.toLowerCase())
    );
  }
}

export default new SymbolExtractor();
