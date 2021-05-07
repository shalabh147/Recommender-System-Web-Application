const { Pool } = require('pg');

const pool = new Pool({
    user: 'shashankagrawal',     //your postgres username
    host: '127.0.0.1', 
    database: 'project', //your local database 
    password: '1234', //your postgres user password
    port: 5432, //your postgres running port
});

pool.connect();


module.exports = pool;