const { Pool } = require('pg');
require('dotenv').config({path: '../.env'});

const pool = new Pool({
  user: 'postgres',
  host: process.env.DATABASE_URL,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

module.exports = pool;