require('dotenv').config();
const mysql = require('mysql');
const conn = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USERDB,
    password: process.env.PASSDB,
    database: process.env.DBNAME
    });

module.exports =conn;