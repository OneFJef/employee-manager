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

const sqlQueries = {
  viewAllDepartmentsQuery: "SELECT * FROM `department`",
  viewAllRolesQuery:
    "SELECT role.id, role.title AS role, role.salary, department.`name` AS department FROM `role` JOIN department ON `department`.id = `role`.department_id ORDER BY role.id",
  viewAllEmployeesQuery:
    "SELECT employee.id, employee.first_name, employee.last_name, CONCAT(mgr.first_name,' ',mgr.last_name) AS manager, role.title AS role, role.salary, department.`name` AS department FROM `employee` JOIN `role` ON `role`.id = `employee`.role_id JOIN `department` ON `department`.id = `role`.department_id LEFT JOIN `employee` `mgr` ON `mgr`.id = `employee`.manager_id",
  addDepartmentQuery: "INSERT INTO `department` (`name`) VALUES (?)",
  addRoleQuery: "INSERT INTO `role` (title, salary, department_id) VALUES (?, ?, ?)",
  addEmployeeQuery: "",
  updateEmployeeRoleQuery: "",
};

function init() {
  console.log(
    logo({
      name: "Employee Manager",
    }).render()
  );
  console.log(sqlQueries.addEmployeeQuery);
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
  connection.query(sqlQueries.viewAllDepartmentsQuery, function (err, results) {
    console.log("\n");
    console.table(results);
    userChoices();
  });
}

function viewAllRoles() {
  connection.query(
    sqlQueries.viewAllRolesQuery,
    function (err, results) {
      console.log("\n");
      console.table(results);
      userChoices();
    }
  );
}

function viewAllEmployees() {
  connection.query(
    sqlQueries.viewAllEmployeesQuery,
    function (err, results) {
      console.log("\n");
      console.table(results);
      userChoices();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter new department name:",
      },
    ])
    .then((answer) => {
      connection.query(
        sqlQueries.addDepartmentQuery,
        [Object.values(answer)],
        function (err, results) {
          connection.query(
            sqlQueries.viewAllDepartmentsQuery,
            function (err, results) {
              console.log("\n");
              console.table(results);
              userChoices();
            }
          );
        }
      );
    });
}

function addRole() {
  connection.query(sqlQueries.viewAllDepartmentsQuery, function (err, results) {
    let departmentArray = [];
    results.forEach((department) => {
      departmentArray.push(department.name);
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "roleName",
          message: "Enter new role name:",
        },
        {
          type: "input",
          name: "salaryAmount",
          message: "Enter salary amount:",
        },
        {
          type: "list",
          name: "departmentList",
          message: "Select department:",
          choices: departmentArray,
        },
      ])
      .then((answer) => {
        const { roleName, salaryAmount, departmentList } = answer;
        let departmentID = departmentArray.indexOf(answer.departmentList) + 1;
        connection.query(
          sqlQueries.addRoleQuery,
          [answer.roleName, answer.salaryAmount, departmentID],
          function (err, results) {
            connection.query(
              sqlQueries.viewAllRolesQuery,
              function (err, results) {
                console.log("\n");
                console.table(results);
                userChoices();
              }
            );
          }
        );
      });
  });
}

function addEmployee() {}

function updateEmployeeRole() {}

init();
