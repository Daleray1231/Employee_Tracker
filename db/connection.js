const mysql = require('mysql2');

const query = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'company_db'
});

module.export = query;