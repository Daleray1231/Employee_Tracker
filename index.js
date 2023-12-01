const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Karah712!',
    database: 'company_db',
});

function viewAllEmployees() {
    const query = `
        SELECT employees.id AS id, employees.first_name AS first_name, employees.last_name AS last_name, roles.title AS title, department.department_name AS department, roles.salary AS salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN department ON roles.department_id = department.id
        LEFT JOIN employees AS managers ON employees.manager_id = managers.id;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving employees:', err);
        } else {
            console.log('');
            console.table(results);
            displayMenu();
        }
    });
}

function addEmployee() {
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
            if (err) {
                console.error('Error adding employee:', err);
            } else {
                console.log('Employee added successfully!');
                displayMenu();
            }
        });
    });
}

function updateEmployeeRole() {
    // Fetch employees to display as choices
    const fetchEmployeesQuery = `SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees`;
    connection.query(fetchEmployeesQuery, (err, employees) => {
        if (err) {
            console.error('Error fetching employees:', err);
            displayMenu();
        } else {
            const employeeChoices = employees.map((employee) => ({
                name: employee.full_name,
                value: employee.id,
            }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeID',
                    message: 'Select an employee to update:',
                    choices: employeeChoices,
                },
                {
                    type: 'list',
                    name: 'newRoleID',
                    message: 'Select the employee\'s new role:',
                    choices: ['Sales Lead', 'Lead Engineer', 'Software Engineer', 'Lawyer', 'Accountant'],
                },
            ]).then((answers) => {
                const { employeeID, newRoleID } = answers;
                let idNumberAssigned;

                switch (newRoleID) {
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

                const updateEmployeeRoleQuery = `UPDATE employees SET role_id = ? WHERE id = ?`;
                connection.query(updateEmployeeRoleQuery, [idNumberAssigned, employeeID], (err, result) => {
                    if (err) {
                        console.error('Error updating employee role:', err);
                    } else {
                        console.log('Employee role updated successfully!');
                    }
                    displayMenu();
                });
            }).catch((error) => {
                console.error(error);
            });
        }
    });
}

function viewAllRoles() {
    const query = `
        SELECT roles.id AS id, roles.title AS title, department.department_name AS department, roles.salary AS salary
        FROM department
        JOIN roles ON department.id = roles.department_id;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving roles:', err);
        } else {
            console.log('');
            console.table(results);
            displayMenu();
        }
    });
}

function addRole() {
    // Fetch departments to display as choices
    const fetchDepartmentsQuery = `SELECT id, department_name FROM department`;
    connection.query(fetchDepartmentsQuery, (err, departments) => {
        if (err) {
            console.error('Error fetching departments:', err);
            displayMenu();
        } else {
            const departmentChoices = departments.map((department) => ({
                name: department.department_name,
                value: department.id,
            }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the new role:',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary for the new role:',
                },
                {
                    type: 'list',
                    name: 'departmentID',
                    message: 'Select the department for the new role:',
                    choices: departmentChoices,
                },
            ]).then((answers) => {
                const { title, salary, departmentID } = answers;

                const addRoleQuery = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
                connection.query(addRoleQuery, [title, salary, departmentID], (err, result) => {
                    if (err) {
                        console.error('Error adding role:', err);
                    } else {
                        console.log('Role added successfully!');
                    }
                    displayMenu();
                });
            }).catch((error) => {
                console.error(error);
            });
        }
    });
}

function viewAllDepartments() {
    const query = `SELECT id, department_name AS department FROM department`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving departments:', err);
        } else {
            console.log('');
            console.table(results);
            displayMenu();
        }
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the new department:',
        },
    ]).then((answer) => {
        const { departmentName } = answer;

        const addDepartmentQuery = `INSERT INTO department (department_name) VALUES (?)`;
        connection.query(addDepartmentQuery, [departmentName], (err, result) => {
            if (err) {
                console.error('Error adding department:', err);
            } else {
                console.log('Department added successfully!');
            }
            displayMenu();
        });
    }).catch((error) => {
        console.error(error);
    });
}



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

        switch (userChoice) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'View all Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Quit':
                console.log('Exiting application');
                connection.end();
                break;
            default:
                console.log('Invalid choice. Please select a valid option.');
                displayMenu();
        }
    }).catch((error) => {
        console.error(error);
    });
}

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
        displayMenu();
    }
});