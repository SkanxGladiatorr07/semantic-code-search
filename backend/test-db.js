import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config();

console.log('Testing database connection...');
console.log('DATABASE_USER:', process.env.DATABASE_USER);
console.log('DATABASE_PASSWORD:', process.env.DATABASE_PASSWORD);
console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
console.log('DATABASE_HOST:', process.env.DATABASE_HOST);

const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT
};

try {
  const connection = await mysql.createConnection(dbConfig);
  console.log('✅ Database connection successful!');
  await connection.end();
  process.exit(0);
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}
