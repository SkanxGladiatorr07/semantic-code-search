/**
 * Environment Configuration
 * Centralized environment variable management
 */

import { config } from 'dotenv';

config();

const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'GROQ_API_KEY'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please check your .env file');
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};

if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10', 10),
    connectTimeout: parseInt(process.env.DATABASE_CONNECT_TIMEOUT || '10000', 10)
  },
  
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    maxTokens: parseInt(process.env.GROQ_MAX_TOKENS || '8000', 10),
    temperature: parseFloat(process.env.GROQ_TEMPERATURE || '0.7')
  },
  
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  },
  
  clone: {
    directory: process.env.CLONE_DIRECTORY || 'cloned_repos',
    timeout: parseInt(process.env.CLONE_TIMEOUT || '300000', 10)
  },
  
  limits: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    maxFiles: parseInt(process.env.MAX_FILES || '50000', 10),
    maxDepth: parseInt(process.env.MAX_DEPTH || '20', 10),
    maxSymbols: parseInt(process.env.MAX_SYMBOLS || '100000', 10),
    maxFilesToParse: parseInt(process.env.MAX_FILES_TO_PARSE || '10000', 10)
  },
  
  isDevelopment: () => env.NODE_ENV === 'development',
  isProduction: () => env.NODE_ENV === 'production',
  isTest: () => env.NODE_ENV === 'test'
};

export default env;
