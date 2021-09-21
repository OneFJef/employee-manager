const inquirer = require("inquirer");
const consleTable = require("console.table");
const mysql = require("mysql2");
const logo = require("asciiart-logo");

require("dotenv").config();

// create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

const choices = [
  "[View All] Departments",
  "[View All] Roles",
  "[View All] Employees",
  "[Add] Department",
  "[Add] Role",
  "[Add] Employee",
  "[Update] Employee Role",
  "[Quit] Exit Program",
];

function init() {
  console.log(
    logo({
      name: "Employee Manager",
    }).render()
  );
  userChoices();
}

function userChoices() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          choices[0],
          choices[1],
          choices[2],
          choices[3],
          choices[4],
          choices[5],
          choices[6],
          choices[7],
        ],
      },
    ])
    .then((answer) => {
      let answerValue = Object.values(answer);
      switch (answerValue[0]) {
        case choices[0]:
          viewAllDepartments();
          break;

        case choices[1]:
          viewAllRoles();
          break;

        case choices[2]:
          viewAllEmployees();
          break;

        case choices[3]:
          addDepartment();
          break;

        case choices[4]:
          addRole();
          break;

        case choices[5]:
          addEmployee();
          break;

        case choices[6]:
          updateEmployeeRole();
          break;

        case choices[7]:
          process.exit();
          break;
      }
    });
}

function viewAllDepartments() {
  connection.query("SELECT * FROM `department`", function (err, results) {
    console.log("\n");
    console.table(results);
    userChoices();
  });
}
function viewAllRoles() {
  connection.query(
    "SELECT * FROM `role` JOIN department on `role`.department_id = department.id",
    function (err, results) {
      console.log("\n");
      console.table(results);
      userChoices();
    }
  );
}
function viewAllEmployees() {
  connection.query("SELECT * FROM `employee`", function (err, results) {
    console.log("\n");
    console.table(results);
    userChoices();
  });
}
function addDepartment() {}
function addRole() {}
function addEmployee() {}
function updateEmployeeRole() {}

init();
