// Getting dependancies
const mysql2 = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promisemysql2 = require("promise-mysql");

// Connection Properties
const connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "PatsTT",
    database: "employees_DB"
}


// Creating Connection to mysql
const connection = mysql2.createConnection(connectionProperties);


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

        // Main menu 
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
    promisemysql2.createConnection(connectionProperties)
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


// Add employee function 
function addEmp(){

    let roleArr = [];
    let managerArr = [];

    // Connection using promise-sql
    promisemysql2.createConnection(connectionProperties
        ).then((conn) => {
    
            // Query  all roles and all manager. Pass as a promise
            return Promise.all([
                conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
                conn.query("SELECT employee.id, concat(employee.first_name, ' ',employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
            ]);
        }).then(([roles, managers]) => {

        // Place all roles in array
        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }

        // place all managers in array
        for (i=0; i < managers.length; i++){
            managerArr.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
      }).then(([roles, managers]) => {

        // add option for no manager
        managerArr.unshift('--');

        inquirer.prompt([
            {
                // Prompt user of their first name
                name: "firstName",
                type: "input",
                message: "First name: ",
                // Validate field is not blank
                validate: function(input){
                    if (input === ""){
                        console.log("**FIELD REQUIRED**");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                 // command user of the last name
                 name: "lastName",
                 type: "input",
                 message: "Lastname name: ",
                 // Validate field is not blank
                 validate: function(input){
                     if (input === ""){
                         console.log("**FIELD REQUIRED**");
                         return false;
                     }
                     else{
                         return true;
                     }
                 }
            },
            {
                // Getting user and their role
                name: "role",
                type: "list",
                message: "What is their role?",
                choices: roleArr
            },{
                // Getting user for the  manager
                name: "manager",
                type: "list",
                message: "Who is their manager?",
                choices: managerArr
            }]).then((answer) => {

                let roleID;
                //Manager value return as null
                let managerID = null;

                // Getting the ID of role or roles selected
                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }

                // return the ID of manager selected
                for (i=0; i < managers.length; i++){
                    if (answer.manager == managers[i].Employee){
                        managerID = managers[i].id;
                    }
                }

                // Add employee
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if(err) return err;

                    // Confirming the employee has been added
                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    mainMenu();
                });
            });
    });
}            



// Add Role function, much like adding employee or employees
function addRole(){

    // Array of departments
    let departmentArr = [];

    // Connection using promise-sql
    promisemysql2.createConnection(connectionProperties)
    .then((conn) => {

        return conn.query('SELECT id, name FROM department ORDER BY name ASC');

    }).then((departments) => {
        
        // Putting all departments in array
        for (i=0; i < departments.length; i++){
            departmentArr.push(departments[i].name);
        }

        return departments;
    }).then((departments) => {
        
        inquirer.prompt([
            {
                // Select user role title
                name: "roleTitle",
                type: "input",
                message: "Role title: "
            },
            {
                // Select user and salary
                name: "salary",
                type: "number",
                message: "Salary: "
            },
            {   
                // Select user to show department role and what ID its under
                name: "dept",
                type: "list",
                message: "Department: ",
                choices: departmentArr
            }]).then((answer) => {

                let deptID;


                for (i=0; i < departments.length; i++){
                    if (answer.dept == departments[i].name){
                        deptID = departments[i].id;
                    }
                }

                // Added "role" to "role" table
                connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`, (err, res) => {
                    if(err) return err;
                    console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
                    mainMenu();
                });

            });

    });
    
}


// Add Department function
function addDept(){

    inquirer.prompt({

            // Prompt user for name of department
            name: "deptName",
            type: "input",
            message: "Department Name: "
        }).then((answer) => {
                
            // add department to the table
            connection.query(`INSERT INTO department (name)VALUES ("${answer.deptName}");`, (err, res) => {
                if(err) return err;
                console.log("\n DEPARTMENT ADDED...\n ");
                mainMenu();
            });

        });
}



// Update Employee Role function 
function updateEmpRole(){

    // Getting employee and role array
    let employeeArr = [];
    let roleArr = [];

    // Creation and connection using promise-sql
    promisemysql2.createConnection(connectionProperties
    ).then((conn) => {
        return Promise.all([

            // Query for all roles and employee
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, employees]) => {

        // Putting all roles in array
        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }

        // Putting all empoyees in the array
        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].Employee);
            //console.log(value[i].name);
        }

        return Promise.all([roles, employees]);
    }).then(([roles, employees]) => {

        inquirer.prompt([
            {
                // Promting the user to select employee
                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: employeeArr
            }, {
                // Selecting the role to update the employee
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: roleArr
            },]).then((answer) => {

                let roleID;
                let employeeID;

                /// Gather ID of role selected
                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }

                // Gather ID of employee selected
                for (i=0; i < employees.length; i++){
                    if (answer.employee == employees[i].Employee){
                        employeeID = employees[i].id;
                    }
                }
                
                // Change employee with new role
                connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                    if(err) return err;

                    // Successful update employee
                    console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);

                    // main menu
                    mainMenu();
                });
            });
    });
    
}

// Update employee manager function 
function updateEmpMngr(){


    let employeeArr = [];

    // Create connection using promise-sql
    promisemysql2.createConnection(connectionProperties
    ).then((conn) => {

        // A query for all employees
        return conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {

        // Putting employees in array
        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].Employee);
        }

        return employees;
    }).then((employees) => {

        inquirer.prompt([
            {
                // Asking user to selected employee
                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: employeeArr
            }, {
                // Asking user to select new manager
                name: "manager",
                type: "list",
                message: "Who is their new Manager?",
                choices: employeeArr
            },]).then((answer) => {

                let employeeID;
                let managerID;

                // Gather ID of selected manager
                for (i=0; i < employees.length; i++){
                    if (answer.manager == employees[i].Employee){
                        managerID = employees[i].id;
                    }
                }

                // Gather ID of selected employee
                for (i=0; i < employees.length; i++){
                    if (answer.employee == employees[i].Employee){
                        employeeID = employees[i].id;
                    }
                }

                // Updatying employee to manager ID
                connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                    if(err) return err;

                    // Successful addition updating employee
                    console.log(`\n ${answer.employee} MANAGER UPDATED TO ${answer.manager}...\n`);

                    // Main menu
                    mainMenu();
                });
            });
    });
}




// Viewing all employees by a manager function 

function viewAllEmpByMngr(){

    let managerArr = [];

    // Connection using promise-sql
    promisemysql2.createConnection(connectionProperties)
    .then((conn) => {

       
        return conn.query("SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id");

    }).then(function(managers){

        // Putting all employees in array
        for (i=0; i < managers.length; i++){
            managerArr.push(managers[i].manager);
        }

        return managers;
    }).then((managers) => {

        inquirer.prompt({

            // Asking user to select a manager to search 
            name: "manager",
            type: "list",
            message: "Which manager would you like to search?",
            choices: managerArr
        })    
        .then((answer) => {

            let managerID;

            // Gather the ID of manager selected
            for (i=0; i < managers.length; i++){
                if (answer.manager == managers[i].manager){
                    managerID = managers[i].id;
                }
            }

            // A query to show all employees by selected manager
            const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            WHERE e.manager_id = ${managerID};`;
    
            connection.query(query, (err, res) => {
                if(err) return err;
                
            
                console.log("\n");
                console.table(res);

                // main menu
                mainMenu();
            });
        });
    });
}






// Delete the role function 
function deleteRole(){

   
    let roleArr = [];

    // Create connection using promise-sql
    promisemysql2.createConnection(connectionProperties
    ).then((conn) => {

        // A query all roles
        return conn.query("SELECT id, title FROM role");
    }).then((roles) => {    

    
        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }

        inquirer.prompt([{
            // Continue, selecting the  role to delete
            name: "continueDelete",
            type: "list",
            message: "*** WARNING *** Deleting role will delete all employees associated with the role. Do you want to continue?",
            choices: ["NO", "YES"]
        }]).then((answer) => {

            // If no then go back to main menu
            if (answer.continueDelete === "NO") {
                mainMenu();
            }

        }).then(() => {

            inquirer.prompt([{
                // Asking the user which role they want to delete
                name: "role",
                type: "list",
                message: "Which role would you like to delete?",
                choices: roleArr
            }, {
                // Delete role by entering the role 
                name: "confirmDelete",
                type: "Input",
                message: "Type the role title EXACTLY to confirm deletion of the role"

            }]).then((answer) => {

                if(answer.confirmDelete === answer.role){

                  
                    let roleID;
                    for (i=0; i < roles.length; i++){
                        if (answer.role == roles[i].title){
                            roleID = roles[i].id;
                        }
                    }
                    
                    // Deleting the role
                    connection.query(`DELETE FROM role WHERE id=${roleID};`, (err, res) => {
                        if(err) return err;

                        // Select confirm if the role has been added 
                        console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                        // Main menu
                        mainMenu();
                    });
                } 
                else {

                    // Do not delete if it is not confirmed
                    console.log(`\n ROLE '${answer.role}' NOT DELETED...\n `);

                    // Main menu
                    mainMenu();
                }
                
            });
        })
    });
}

// Delete employee function 
function deleteEmp(){

    
    let employeeArr = [];

    // Creating a connection using promise-sql
    promisemysql2.createConnection(connectionProperties
    ).then((conn) => {

        // A Query all employees
        return  conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {

        // Putting all employees in array
        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].employee);
        }

        inquirer.prompt([
            {
                
                name: "employee",
                type: "list",
                message: "Who would you like to delete?",
                choices: employeeArr
            }, {
                // Accepting and confirming the delete of employee
                name: "yesNo",
                type: "list",
                message: "Confirm deletion",
                choices: ["NO", "YES"]
            }]).then((answer) => {

                if(answer.yesNo == "YES"){
                    let employeeID;

                    // If confirmed then get the ID of employee selected
                    for (i=0; i < employees.length; i++){
                        if (answer.employee == employees[i].employee){
                            employeeID = employees[i].id;
                        }
                    }
                    
                    // Deleted the selected employee
                    connection.query(`DELETE FROM employee WHERE id=${employeeID};`, (err, res) => {
                        if(err) return err;

                        // Confirming the deleted employee
                        console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);
                        
                        // Main menu
                        mainMenu();
                    });
                } 
                else {
                    
                    // If no then go back to main menu
                    console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);

                    // The Main menu
                    mainMenu();
                }
                
            });
    });
}