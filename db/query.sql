SELECT roles.id AS id, roles.title AS title, department.department_name AS department, roles.salary
AS salary
FROM department
JOIN roles ON department.id = roles.department_id;


SELECT employees.id AS id, employees.first_name AS first_name, employees.last_name AS last_name, roles.title AS title, department.department_name AS department, roles.salary AS salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager
FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN department ON roles.department_id = department.id
LEFT JOIN employees AS managers ON employees.manager_id = managers.id