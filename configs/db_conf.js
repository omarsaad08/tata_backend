const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: '172.31.37.231',
  database: 'tata',
  password: '411444291',
  port: 5432,
});

module.exports = { pool };