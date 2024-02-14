const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Pingpong",
    password: "abtikas",
    port: 5432
});

module.exports = pool;
