const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tata',
  password: '411444291',
  port: 5432,
});

module.exports = { pool };