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

// Create the database if it doesn't exist
db.raw(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`).catch((error: Error) => {
  console.error('An error occurred while creating the database:', error);
});

// Create the table if it doesn't exist
db.schema.hasTable('contacts').then((exists: boolean) => {
  if (!exists) {
    db.schema
      .createTable('contacts', (table) => {
        table.increments('id').primary();
        table.string('phoneNumber').nullable();
        table.string('email').nullable();
        table.integer('linkedId').nullable();
        table.string('linkPrecedence').notNullable();
        table.timestamp('createdAt').defaultTo(db.fn.now());
        table.timestamp('updatedAt').defaultTo(db.fn.now());
        table.timestamp('deletedAt').nullable();
      })
      .then(() => {
        console.log('Table "contacts" has been created.');
      })
      .catch((error: Error) => {
        console.error('An error occurred while creating the table:', error);
      });
  }
});

export default db;