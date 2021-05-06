const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',     //your postgres username
    host: '127.0.0.1', 
    database: 'project', //your local database 
    password: 'shalabh12', //your postgres user password
    port: 5433, //your postgres running port
});

pool.connect();


module.exports = pool;