/**
 * Gemini Service
 * Integration with Google Gemini AI
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.genAI = null;
    this.model = null;
    this.initialized = false;
  }

  /**
   * Initialize Gemini client
   */
  initialize() {
    if (this.initialized) return;

    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.initialized = true;
      console.log('Gemini service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      throw new Error('Failed to initialize Gemini service');
    }
  }

  /**
   * Ensure service is initialized
   */
  ensureInitialized() {
    if (!this.initialized) {
      this.initialize();
    }
  }

  /**
   * Generate text response from prompt
   * @param {string} prompt - User prompt
   * @returns {Promise<string>} Generated text
   */
  async generateText(prompt) {
    try {
      this.ensureInitialized();

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text from Gemini');
    }
  }

  /**
   * Generate streaming response
   * @param {string} prompt - User prompt
   * @returns {Promise<AsyncGenerator>} Stream of text chunks
   */
  async generateTextStream(prompt) {
    try {
      this.ensureInitialized();

      const result = await this.model.generateContentStream(prompt);
      return result.stream;
    } catch (error) {
      console.error('Error generating text stream:', error);
      throw new Error('Failed to generate text stream from Gemini');
    }
  }

  /**
   * Analyze code with Gemini
   * @param {string} code - Source code
   * @param {string} language - Programming language
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeCode(code, language) {
    try {
      this.ensureInitialized();

      const prompt = `Analyze the following ${language} code and provide:
1. A brief summary of what the code does
2. Key functions and their purposes
3. Potential issues or improvements
4. Code quality rating (1-10)

Code:
\`\`\`${language}
${code}
\`\`\`

Return your response in JSON format with keys: summary, functions, issues, improvements, quality_rating`;

      const text = await this.generateText(prompt);
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, returning raw text');
      }

      return {
        summary: text,
        functions: [],
        issues: [],
        improvements: [],
        quality_rating: null
      };
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw new Error('Failed to analyze code with Gemini');
    }
  }

  /**
   * Explain code functionality
   * @param {string} code - Source code
   * @param {string} language - Programming language
   * @returns {Promise<string>} Explanation
   */
  async explainCode(code, language) {
    try {
      this.ensureInitialized();

      const prompt = `Explain what this ${language} code does in simple terms:

\`\`\`${language}
${code}
\`\`\`

Provide a clear, concise explanation suitable for developers.`;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error explaining code:', error);
      throw new Error('Failed to explain code with Gemini');
    }
  }

  /**
   * Answer questions about code
   * @param {string} question - User question
   * @param {string} code - Source code context
   * @param {string} language - Programming language
   * @returns {Promise<string>} Answer
   */
  async answerQuestion(question, code, language) {
    try {
      this.ensureInitialized();

      const prompt = `Given the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Answer this question: ${question}

Provide a detailed but concise answer.`;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to answer question with Gemini');
    }
  }

  /**
   * Generate code documentation
   * @param {string} code - Source code
   * @param {string} language - Programming language
   * @returns {Promise<string>} Documentation
   */
  async generateDocumentation(code, language) {
    try {
      this.ensureInitialized();

      const prompt = `Generate comprehensive documentation for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include:
- Overview
- Parameters (if applicable)
- Return values (if applicable)
- Usage examples
- Notes or warnings`;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error generating documentation:', error);
      throw new Error('Failed to generate documentation with Gemini');
    }
  }

  /**
   * Suggest code improvements
   * @param {string} code - Source code
   * @param {string} language - Programming language
   * @returns {Promise<Array>} List of suggestions
   */
  async suggestImprovements(code, language) {
    try {
      this.ensureInitialized();

      const prompt = `Review this ${language} code and suggest improvements:

\`\`\`${language}
${code}
\`\`\`

Provide specific, actionable suggestions for:
- Performance optimization
- Code readability
- Best practices
- Error handling
- Security

Return as a JSON array of objects with keys: category, suggestion, priority (high/medium/low)`;

      const text = await this.generateText(prompt);
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response');
      }

      return [];
    } catch (error) {
      console.error('Error suggesting improvements:', error);
      throw new Error('Failed to suggest improvements with Gemini');
    }
  }

  /**
   * Search code semantically
   * @param {string} query - Search query
   * @param {Array} codeSnippets - Array of code snippets with metadata
   * @returns {Promise<Array>} Ranked results
   */
  async semanticSearch(query, codeSnippets) {
    try {
      this.ensureInitialized();

      const snippetsText = codeSnippets.map((snippet, idx) => 
        `[${idx}] ${snippet.name} (${snippet.language}): ${snippet.code.substring(0, 200)}...`
      ).join('\n\n');

      const prompt = `Given these code snippets:

${snippetsText}

Which snippets are most relevant to this query: "${query}"?

Return a JSON array of indices (numbers) ordered by relevance, most relevant first.`;

      const text = await this.generateText(prompt);
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          const indices = JSON.parse(jsonMatch[0]);
          return indices.map(idx => codeSnippets[idx]).filter(Boolean);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response');
      }

      return codeSnippets;
    } catch (error) {
      console.error('Error in semantic search:', error);
      throw new Error('Failed to perform semantic search with Gemini');
    }
  }

  /**
   * Answer question about repository
   * @param {string} question - User question
   * @param {Object} context - Repository context (from contextService)
   * @returns {Promise<string>} Answer
   */
  async answerRepositoryQuestion(question, context) {
    try {
      this.ensureInitialized();

      const { repository, relevantSymbols, relevantFiles, totalSymbols, totalFiles } = context;

      let prompt = `You are an expert code assistant analyzing a repository.

REPOSITORY INFORMATION:
Name: ${repository.repository_name}
Description: ${repository.description || 'No description provided'}
GitHub: ${repository.github_url}
Total Files: ${totalFiles}
Total Symbols: ${totalSymbols}

`;

      if (relevantSymbols.length > 0) {
        const symbolsByType = {
          function: relevantSymbols.filter(s => s.symbol_type === 'function'),
          class: relevantSymbols.filter(s => s.symbol_type === 'class'),
          interface: relevantSymbols.filter(s => s.symbol_type === 'interface')
        };

        prompt += `RELEVANT SYMBOLS FOUND:\n`;
        
        if (symbolsByType.function.length > 0) {
          prompt += `\nFunctions (${symbolsByType.function.length}):\n`;
          symbolsByType.function.slice(0, 20).forEach(s => {
            prompt += `  • ${s.symbol_name} in ${s.file_name}\n`;
          });
          if (symbolsByType.function.length > 20) {
            prompt += `  ... and ${symbolsByType.function.length - 20} more functions\n`;
          }
        }

        if (symbolsByType.class.length > 0) {
          prompt += `\nClasses (${symbolsByType.class.length}):\n`;
          symbolsByType.class.slice(0, 15).forEach(s => {
            prompt += `  • ${s.symbol_name} in ${s.file_name}\n`;
          });
          if (symbolsByType.class.length > 15) {
            prompt += `  ... and ${symbolsByType.class.length - 15} more classes\n`;
          }
        }

        if (symbolsByType.interface.length > 0) {
          prompt += `\nInterfaces (${symbolsByType.interface.length}):\n`;
          symbolsByType.interface.slice(0, 15).forEach(s => {
            prompt += `  • ${s.symbol_name} in ${s.file_name}\n`;
          });
          if (symbolsByType.interface.length > 15) {
            prompt += `  ... and ${symbolsByType.interface.length - 15} more interfaces\n`;
          }
        }
      }

      if (relevantFiles.length > 0) {
        prompt += `\n${'='.repeat(80)}\nRELEVANT SOURCE CODE FILES:\n${'='.repeat(80)}\n`;
        
        relevantFiles.forEach((file, index) => {
          prompt += `\n[FILE ${index + 1}] ${file.file_path}\n`;
          prompt += `Language: ${file.file_extension || 'unknown'}\n`;
          prompt += `Lines: ${file.line_count || 'unknown'} | Characters: ${file.char_count || 'unknown'}\n`;
          prompt += `Relevance Score: ${file.relevance_score || 0}\n`;
          
          if (file.symbols && file.symbols.length > 0) {
            const fileSymbolsByType = {
              function: file.symbols.filter(s => s.symbol_type === 'function'),
              class: file.symbols.filter(s => s.symbol_type === 'class'),
              interface: file.symbols.filter(s => s.symbol_type === 'interface')
            };
            
            prompt += `Symbols in this file:\n`;
            if (fileSymbolsByType.function.length > 0) {
              prompt += `  Functions: ${fileSymbolsByType.function.map(s => s.symbol_name).join(', ')}\n`;
            }
            if (fileSymbolsByType.class.length > 0) {
              prompt += `  Classes: ${fileSymbolsByType.class.map(s => s.symbol_name).join(', ')}\n`;
            }
            if (fileSymbolsByType.interface.length > 0) {
              prompt += `  Interfaces: ${fileSymbolsByType.interface.map(s => s.symbol_name).join(', ')}\n`;
            }
          }
          
          prompt += `\nCode:\n\`\`\`${this.getLanguageForExtension(file.file_extension)}\n${file.content}\n\`\`\`\n`;
          prompt += `${'-'.repeat(80)}\n`;
        });
      } else {
        prompt += `\nNo directly relevant code files found for this question.\n`;
      }

      prompt += `\n${'='.repeat(80)}\nUSER QUESTION:\n${question}\n${'='.repeat(80)}\n`;

      prompt += `\nINSTRUCTIONS:
1. Analyze the provided code files and symbols carefully
2. Answer the question directly and concisely
3. Reference specific files, functions, or classes when relevant
4. Use actual code snippets from above to support your answer
5. If the code doesn't fully answer the question, state what information is missing
6. Be technical and precise - assume the user is a developer
7. Format code references with backticks
8. If multiple files are relevant, explain how they relate to each other

ANSWER:`;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error answering repository question:', error);
      throw new Error('Failed to answer repository question with Gemini');
    }
  }

  /**
   * Get language identifier for file extension
   * @param {string} extension - File extension
   * @returns {string} Language identifier
   */
  getLanguageForExtension(extension) {
    const map = {
      '.js': 'javascript',
      '.jsx': 'jsx',
      '.ts': 'typescript',
      '.tsx': 'tsx',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.go': 'go',
      '.rs': 'rust',
      '.php': 'php',
      '.rb': 'ruby',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.cs': 'csharp'
    };
    return map[extension] || '';
  }

  /**
   * Check if service is available
   * @returns {boolean}
   */
  isAvailable() {
    return this.initialized && this.apiKey != null;
  }
}

export default new GeminiService();
