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
        "View all employees salary",
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

        // Use of a Switch case, depending on users options selected
        switch (answer.action) {
            case "View all employees":
                viewAllEmp();
                break;

            case "View all Employees by role":
                viewAllEmpByRole();
                break;    

            case "View all Employees by department":
                viewAllEmpByDept();
                break;

            case "Add Employee":
                addEmp();
                break;
                
            case "Add Employee Salary":
                addEmpSal();
                break;    

            case "Add department":
                addDept();
                break;

            case "Add role":
                addRole();
                break;

            case "Update Employee manager":
                updateEmpMngr();
                break;

            case "Update Employee role":
                updateEmpRole();
                break;
    
            case "View all Employee by manager":
                viewAllEmpByMngr();
                break;

            case "Delete Employee":
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

// Function set to view all employees 
function viewAllEmp(){

    // A Query to view all employees in seed
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";

    // A Query from connection function
    connection.query(query, function(err, res) {
        if(err) return err;
        console.log("\n");

        console.table(res);

        // back to main menu 
        mainMenu();
    });
}

// Function to view all employees by department
function viewAllEmpByDept(){
    // Array to department names
    let deptArr = [];
     // Trying new connection using promise-sql
     promisemysql.createConnection(connectionProperties
        ).then((conn) => {
              // Query to see names of departments
        return conn.query('SELECT name FROM department');
    }).then(function(value){
          // All names within deptArr
          deptQuery = value;
          for (i=0; i < value.length; i++){
              deptArr.push(value[i].name);
              
          }

    }).then(() => {
           // Prompt user to select department from the array of departments
            inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department would you like to search?",
            choices: deptArr
        })    
        .then((answer) => { 
           // Query all employees depending on selected department
           const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;
           connection.query(query, (err, res) => {
               if(err) return err;
               
               // Show results in console.table
               console.log("\n");
               console.table(res);

                  // Back to main menu
                  mainMenu();
           });
        });
    });
}

// Viewing all employees by role
function viewAllEmpByRole(){

    // Array to store all roles
    let roleArr = [];

    // Create connection using promise-sql "trying"
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        // Query all the roles
        return conn.query('SELECT title FROM role');
    }).then(function(roles){

        // Putting all roles within the roleArry
        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }
    }).then(() => {

        // Prompt user to select a role
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "Which role would you like to search?",
            choices: roleArr
        })    
        .then((answer) => {

            // Query showing all employees by their role selected by user
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
            connection.query(query, (err, res) => {
                if(err) return err;

                // Showing results using console.table
                console.log("\n");
                console.table(res);
                mainMenu();
            });
        });
    });
}

            