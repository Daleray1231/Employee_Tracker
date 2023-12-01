const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'company_db',
});

connection.connect((err) => {
    if (err) console.error;
    console.log('Connected to the database');
    displayMenu();
});

function displayMenu() {
    inquirer.prompt([
        {
            name: 'homescreen',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View all Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        },
    ]).then((answers) => {
        const userChoice = answers.homescreen;

        if (userChoice === 'View All Employees') {
            const viewAllEmployeesQuery = `
                SELECT employees.id AS id, employees.first_name AS first_name, employees.last_name AS last_name, roles.title AS title, department.department_name AS department, roles.salary AS salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager
                FROM employees
                JOIN roles ON employees.role_id = roles.id
                JOIN department ON roles.department_id = department.id
                LEFT JOIN employees AS managers ON employees.manager_id = managers.id;
            `;
            connection.query(viewAllEmployeesQuery, (err, results) => {
                if (err) console.error;
                console.log('');
                console.table(results);
                displayMenu();
            });
        } else if (userChoice === 'Add Employee') {
            console.log('Please add an employee!');
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Please enter employee first name!',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Please enter employee last name!',
                },
                {
                    type: 'list',
                    name: 'roleID',
                    message: 'Please select employee role!',
                    choices: ['Sales Lead', 'Lead Engineer', 'Software Engineer', 'Lawyer', 'Accountant'],
                },
                {
                    type: 'list',
                    name: 'managerID',
                    message: 'Please select a manager',
                    choices: ['Finn Human', 'Jake Dog', 'Bobby Lee', 'Theo Von', 'Tom Segura'],
                },
            ]).then((employeeAnswer) => {
                const { firstName, lastName, roleID, managerID } = employeeAnswer;
                let idNumberAssigned;

                switch (roleID) {
                    case 'Sales Lead':
                        idNumberAssigned = 1;
                        break;
                    case 'Lead Engineer':
                        idNumberAssigned = 2;
                        break;
                    case 'Software Engineer':
                        idNumberAssigned = 3;
                        break;
                    case 'Lawyer':
                        idNumberAssigned = 4;
                        break;
                    case 'Accountant':
                        idNumberAssigned = 5;
                        break;
                    default:
                        idNumberAssigned = 1;
                }

                let managerChoice;
                switch (managerID) {
                    case 'Finn Human':
                        managerChoice = 1;
                        break;
                    case 'Theo Von':
                        managerChoice = 4;
                        break;
                    default:
                        managerChoice = null;
                }

                console.log('Employee First Name: ' + firstName);
                console.log('Employee Last Name: ' + lastName);

                const addEmployeeInformation = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                connection.query(addEmployeeInformation, [firstName, lastName, idNumberAssigned, managerChoice], (err, insertResult) => {
                    if (err) console.error;
                    console.log('Employee added successfully!');
                    displayMenu();
                });
            });
        }

        else if (userChoice === 'Quit') {
            console.log('Exiting application');
            connection.end();
            return;
        }
    });
}

displayMenu();
