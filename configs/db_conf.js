const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'tata.cfk8wq8e8bzc.eu-north-1.rds.amazonaws.com',
  database: 'tata',
  password: '411444291',
  port: 5432,
});

module.exports = { pool };