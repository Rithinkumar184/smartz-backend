const { Pool } = require('pg');
let pool;

async function initDB(){
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await pool.query('SELECT 1');
  console.log('Postgres connected');
}

function getPool(){ return pool; }
module.exports = { initDB, getPool };
