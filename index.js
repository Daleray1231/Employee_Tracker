const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'company_db',
  });
function displayMenu()
{
    inquirer.prompt([
        {
          name: 'homescreen',
          type: 'list',
          message: 'What would you like to do?',
          choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View all Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        },
      ])
      .then((answers) =>{
          var userChoice = answers.homescreen;
          console.log("This is my user choice " + userChoice);
          if(userChoice == "View All Employees")
            {
                console.log("Please see all the Employees.");
                    const viewAllEmployeesQuery = `
                    SELECT employees.id AS id, employees.first_name AS first_name, employees.last_name AS last_name, roles.title AS title, department.department_name AS department, roles.salary AS salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager
                    FROM employees
                    JOIN roles ON employees.role_id = roles.id
                    JOIN department ON roles.department_id = department.id
                    LEFT JOIN employees AS managers ON employees.manager_id = managers.id;
                    `;
                    connection.query(viewAllEmployeesQuery, function (err, results) {
                    if (err) throw err;
                    // Print the results in a formatted way
                    console.log("");
                    console.table(results);
                    displayMenu();
                    })
            }


          else if(userChoice == "Add Employee")
          {
              console.log("Please add an employee!");
              inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "Please enter employee first name!"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "Please enter employee last name!"
                },
                {
                    type: "list",
                    name: "roleID",
                    message: "Please select employee role!",
                    choices:["Sales Lead", "Lead Engineer", "Software Engineer", "Lawyer", "Accountant"],
                },
                {
                    type: "list",
                    name: "managerID",
                    message: "Please select employee role!",
                    choices:["Finn Human", "Jake Dog", "Bobby Lee", "Theo Von", "Tom Segura"],
                },
                {
                    type: "list",
                    name: "managerID",
                    message: "Please select a manager",
                    choices:["Finn Human", "Jake Dog", "Bobby Lee", "Theo Von", "Tom Segura"],
                },
              ])
              .then((employeeAnswer) =>{
                const firstName = employeeAnswer.firstName;
                const lastName = employeeAnswer.lastName;
                const userRoleChoice = employeeAnswer.roleID;
                let idNumberAssigned;
                let managerAssigned;
                let userManagerChoice;
                let ManagerChoice;

                if(userRoleChoice == "Sales Lead")
                {
                    idNumberAssigned = 1;
                }
                else if(userRoleChoice == "Lead Engineer")
                {
                    idNumberAssigned = 2;
                }
                else if(userRoleChoice == "Software Engineer")
                {
                    idNumberAssigned = 3;
                }
                else if(userRoleChoice == "Lawyer")
                {
                    idNumberAssigned = 4;
                }
                else if(userRoleChoice == "Accountant")
                {
                    idNumberAssigned = 5;
                }

                if(userManagerChoice == "Finn Human")
                {
                    ManagerChoice =1;
                }


                else if(userManagerChoice == "Theo Von")
                {
                    ManagerChoice = 4;
                }
                console.log("Employee First Name: " + firstName);
                console.log("Employee Last Name: " + lastName);
                const addEmployeeInformation = `INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?)`;
                connection.query(
                    addEmployeeInformation,[firstName, lastName, idNumberAssigned, managerAssigned],
                    function (err, insertResult)
                    {
                        if (err) throw err;
                        console.log("Employee added successfully!");
                        displayMenu();
                    }
                )
              })
          }


          else if (userChoice == "Update Employee Role") {
            console.log("You chose the update employee route");
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Please select an employee!",
                    choices: ["Finn Human", "Jake Dog", "Bobby Lee", "Theo Von", "Tom Segura"]
                },
                {
                    type: "list",
                    name: "role",
                    message: "Please select role!",
                    choices: ["Sales Lead", "Lead Engineer", "Software Engineer", "Lawyer", "Accountant"]
                }
            ])
            .then((updateAnswer) => {
                const selectedEmployee = updateAnswer.employee;
                const selectedRole = updateAnswer.role;
                let idNumberAssigned;
                if (selectedRole == "Sales Lead") {
                    idNumberAssigned = 1;
                } else if (selectedRole == "Lead Engineer") {
                    idNumberAssigned = 2;
                } else if (selectedRole == "Software Engineer") {
                    idNumberAssigned = 3;
                } else if (selectedRole == "Lawyer") {
                    idNumberAssigned = 4;
                } else if (selectedRole == "Accountant") {
                    idNumberAssigned = 5;
                }
                const updateEmployeeInformation = `
                    UPDATE employees
                    SET role_id = ?
                    WHERE CONCAT(first_name, ' ', last_name) = ?;
                `;
                connection.query(updateEmployeeInformation, [idNumberAssigned, selectedEmployee], function (err, updateResult) {
                    if (err) throw err;
                    console.log("Employee role updated successfully!");
                    displayMenu();
                });
            });
          }


          else if(userChoice == "View all Roles")
            {
                console.log("Please see all the roles information.");
                    const viewAllEmployeesQuery = `
                    SELECT roles.id AS id, roles.title AS title, department.department_name AS department, roles.salary AS salary
                    FROM department
                    JOIN roles ON department.id = roles.department_id;
                    `;
                    connection.query(viewAllEmployeesQuery, function (err, results) {
                    if (err) throw err;
                    // Print the results in a formatted way
                    console.log("");
                    console.table(results);
                    displayMenu();
                    })
            }


          else if(userChoice == "Add Role")
          {
              console.log("You chose the add role route");
              inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'please enter new role'
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'please enter new roles salary'
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'please select the new roles department',
                    choices: ["Sales", "Engineering", "Finance", "Legal"]
                },
              ]).then((response)=>{
                const newRole = response.title;
                const salary = response.salary;
                const dept = response.department_id;
                let deptNum;
                if(dept == "Sales"){
                    deptNum = 1;
                }else if(dept == "Engineering"){
                    deptNum = 2;
                }else if(dept == "Finance"){
                    deptNum = 3;
                }else if(dept =="Legal"){
                    deptNum = 4;
                }
                const addRole = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
                connection.query(addRole,[newRole, salary, deptNum],
                    function(err,  insertResult){
                        if(err) throw err;
                        console.log("Role added successfully");
                        displayMenu();
                    })
              })

          }


          else if(userChoice == "View All Departments")
            {
                console.log("Please see all the Departments.");
                    const viewAllEmployeesQuery = `
                    SELECT * FROM company_db.department;
                    `;
                    connection.query(viewAllEmployeesQuery, function (err, results) {
                    if (err) throw err;
                    // Print the results in a formatted way
                    console.log("");
                    console.table(results);
                    displayMenu();
                    })
            }


            else if(userChoice == "Add Department") {
                console.log("Please add a department.");
                inquirer.prompt([
                    {
                        type: "input",
                        name: "departmentName",
                        message: "Please add a new department."
                    },
                    ])
                  .then((employeeAnswer) => {
                    const departmentName = employeeAnswer.departmentName;
                    const addDepartment = `INSERT INTO department (department_name) VALUES (?)`;
                    connection.query(
                        addDepartment,[departmentName],
                        function (err, insertResult)
                        {
                          if (err) throw err;
                          console.log(" New department added!");
                          displayMenu();
                        }
                    )
                  })
          }


          else if(userChoice == "Quit")
          {
              console.log("You chose the quit route");
              return;
          }
      })
}
displayMenu();