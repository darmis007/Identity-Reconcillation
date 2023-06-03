import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const db = knex({
  client: process.env.DB_CLIENT || 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'projects',
  },
});

export default db;
