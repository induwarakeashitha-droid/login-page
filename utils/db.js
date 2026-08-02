const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5433),
  user: process.env.DB_USER || 'auth_user',
  password: process.env.DB_PASSWORD || 'auth_pass',
  database: process.env.DB_NAME || 'auth_db',
  ssl: false
});

module.exports = pool;