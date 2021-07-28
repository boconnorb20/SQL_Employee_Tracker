// Getting dependancies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promisemysql = require("promise-mysql");

// Connection Properties
const connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees_DB"
}


// Creating Connection to mysql
const connection = mysql.createConnection(connectionProperties);


// Setting up the connection to the database
connection.connect((err) => {
    if (err) throw err;


    console.log("SQL EMPLOYEE TRACKER"); mainMenu();
});

// Main menu function
function mainMenu(){

    // Prompt user to choose an option
    inquirer .prompt({
      name: "action",
      type: "list",
      message: "MAIN MENU",
      choices: [
        "View all employees",
        "View all employees by role",
        "View all employees by department",
        "View all employees by manager",
        "View all employees salaries",
        "Add employee",
        "Add role",
        "Add department",
        "Update employee role",
        "Update employee manager",
        "Delete employee",
        "Delete role",
        "Delete department"
      ]
    })

    .then((answer) => {

        // Use of a Switch case, depending on user option
        switch (answer.action) {
            case "View all employees":
                viewAllEmp();
                break;

            case "View all employees by role":
                viewAllEmpByRole();
                break;    

            case "View all employees by department":
                viewAllEmpByDept();
                break;

            case "Add employee":
                addEmp();
                break;
                
            case "Add employee Salary":
                addEmpSal();
                break;    

            case "Add department":
                addDept();
                break;

            case "Add role":
                addRole();
                break;

            case "Update employee manager":
                updateEmpMngr();
                break;

            case "Update employee role":
                updateEmpRole();
                break;
    
            case "View all employees by manager":
                viewAllEmpByMngr();
                break;

            case "Delete employee":
                deleteEmp();
                break;

            case "Delete role":
                deleteRole();
                break;

            case "Delete department":
                deleteDept();
                break;
        }
    });

}