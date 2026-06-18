/**
 * Groq AI Service
 * Integration with Groq API (Free AI with generous limits)
 */

import Groq from 'groq-sdk';
import env from '../config/env.js';

class GroqService {
  constructor() {
    this.apiKey = env.groq.apiKey;
    this.client = null;
    this.initialized = false;
  }

  /**
   * Initialize Groq client
   */
  initialize() {
    if (this.initialized) return;

    if (!this.apiKey) {
      console.error('GROQ_API_KEY is missing from environment variables');
      throw new Error('GROQ_API_KEY is not configured');
    }

    console.log('Initializing Groq with API key:', this.apiKey.substring(0, 15) + '...');

    try {
      this.client = new Groq({
        apiKey: this.apiKey
      });
      this.initialized = true;
      console.log('Groq service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Groq service:', error);
      console.error('Error message:', error.message);
      throw new Error(`Failed to initialize Groq service: ${error.message}`);
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

      const response = await this.client.chat.completions.create({
        model: env.groq.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: env.groq.temperature,
        max_tokens: env.groq.maxTokens
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating text from Groq:', error);
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('API Response:', error.response);
      }
      throw new Error(`Failed to generate text from Groq: ${error.message || error}`);
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

      const stream = await this.client.chat.completions.create({
        model: env.groq.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: env.groq.temperature,
        max_tokens: env.groq.maxTokens,
        stream: true
      });

      return stream;
    } catch (error) {
      console.error('Error generating text stream:', error);
      throw new Error('Failed to generate text stream from Groq');
    }
  }

  /**
   * Analyze code with AI
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
      throw new Error('Failed to analyze code with AI');
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
      throw new Error('Failed to explain code with AI');
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
      throw new Error('Failed to answer question with AI');
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
      throw new Error('Failed to generate documentation with AI');
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
      throw new Error('Failed to suggest improvements with AI');
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
      throw new Error('Failed to perform semantic search with AI');
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

      const { repository, relevantSymbols, relevantFiles, totalSymbols, totalFiles, isOverviewQuestion } = context;

      let prompt = `You are an expert code assistant analyzing a repository.

REPOSITORY INFORMATION:
Name: ${repository.repository_name}
Description: ${repository.description || 'No description provided'}
GitHub: ${repository.github_url}
Total Files: ${totalFiles}
Total Symbols: ${totalSymbols}

`;

      // For overview questions, emphasize documentation files
      if (isOverviewQuestion) {
        prompt += `NOTE: This is a high-level overview question. Focus on:\n`;
        prompt += `1. The main purpose and goals of this project\n`;
        prompt += `2. Key technologies and frameworks used\n`;
        prompt += `3. Main features and functionality\n`;
        prompt += `4. Project architecture and structure\n`;
        prompt += `5. Entry points and important files\n\n`;
      }

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

      if (isOverviewQuestion) {
        prompt += `\nINSTRUCTIONS FOR OVERVIEW QUESTIONS:
1. Start with a clear, concise summary of what this project does (2-3 sentences)
2. Identify the main technologies, frameworks, and programming languages used
3. Describe the key features and functionality
4. Explain the project structure and architecture
5. Mention important entry points (like package.json, README, main files)
6. Use information from README files, package.json, and main code files
7. Be comprehensive but clear - this is a high-level overview
8. Format your response with clear sections and bullet points
9. Reference specific files when discussing features or architecture

ANSWER:`;
      } else {
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
      }

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error answering repository question:', error);
      throw new Error('Failed to answer repository question with AI');
    }
  }

  /**
   * Generate repository summary
   * @param {Object} context - Repository context
   * @returns {Promise<Object>} Summary object
   */
  async generateRepositorySummary(context) {
    try {
      this.ensureInitialized();

      const { repository, relevantSymbols, relevantFiles, totalSymbols, totalFiles } = context;

      const extensions = new Set();
      relevantFiles.forEach(f => {
        if (f.file_extension) extensions.add(f.file_extension);
      });

      const symbolsByType = {
        functions: relevantSymbols.filter(s => s.symbol_type === 'function'),
        classes: relevantSymbols.filter(s => s.symbol_type === 'class'),
        interfaces: relevantSymbols.filter(s => s.symbol_type === 'interface')
      };

      const filesList = relevantFiles.map(f => 
        `- ${f.file_path} (${f.line_count || 0} lines)`
      ).join('\n');

      const majorClasses = symbolsByType.classes.slice(0, 10).map(s => 
        `- ${s.symbol_name} in ${s.file_name}`
      ).join('\n');

      const majorFunctions = symbolsByType.functions.slice(0, 15).map(s => 
        `- ${s.symbol_name} in ${s.file_name}`
      ).join('\n');

      const codeSnippets = relevantFiles.slice(0, 2).map(f => {
        return `File: ${f.file_path}\n\`\`\`\n${f.content.substring(0, 800)}\n\`\`\``;
      }).join('\n\n');

      const prompt = `Analyze this code repository and generate a comprehensive summary in JSON format.

Repository: ${repository.repository_name}
Description: ${repository.description || 'No description'}
GitHub: ${repository.github_url}

Statistics:
- Total Files: ${totalFiles}
- Total Symbols: ${totalSymbols}
- File Extensions: ${Array.from(extensions).join(', ')}

Key Files:
${filesList}

Major Classes:
${majorClasses || 'None detected'}

Major Functions:
${majorFunctions || 'None detected'}

Sample Code:
${codeSnippets}

Generate a JSON response with this exact structure:
{
  "overview": "A 2-3 sentence high-level description of what this project does",
  "purpose": "The main purpose and goals of this project",
  "technologies": ["tech1", "tech2", "tech3"],
  "languages": ["language1", "language2"],
  "architecture": "Brief description of the project architecture",
  "major_classes": [
    {"name": "ClassName", "file": "file.js", "purpose": "What it does"}
  ],
  "major_functions": [
    {"name": "functionName", "file": "file.js", "purpose": "What it does"}
  ],
  "key_features": ["feature1", "feature2", "feature3"],
  "complexity": "low|medium|high"
}

Respond ONLY with valid JSON, no additional text.`;

      const text = await this.generateText(prompt);
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, returning structured text');
      }

      return {
        overview: text.substring(0, 300),
        purpose: 'Unable to determine',
        technologies: Array.from(extensions),
        languages: [],
        architecture: 'Unable to determine',
        major_classes: symbolsByType.classes.slice(0, 5).map(s => ({
          name: s.symbol_name,
          file: s.file_name,
          purpose: 'Unknown'
        })),
        major_functions: symbolsByType.functions.slice(0, 5).map(s => ({
          name: s.symbol_name,
          file: s.file_name,
          purpose: 'Unknown'
        })),
        key_features: [],
        complexity: 'medium'
      };
    } catch (error) {
      console.error('Error generating repository summary:', error);
      throw new Error('Failed to generate repository summary');
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

export default new GroqService();
