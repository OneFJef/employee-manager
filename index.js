const inquirer = require("inquirer");
const consleTable = require("console.table");
const mysql = require("mysql2");

require('dotenv').config()

// create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

