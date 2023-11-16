INSERT INTO department (department_name)
    VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");
INSERT INTO roles (title, salary, department_id)
    VALUES
    ("Sales Lead", 100000, 1),
    ("Lead Engineer", 2000000, 2),
    ("Software Engineer", 300000, 2),
    ("Lawyer", 100000, 4),
    ("Accountant", 50000, 3);
    INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES
    ("Finn", "Human", 3, null),
    ("Jake", "Dog", 3, 1),
    ("Bobby", "Lee", 3, 1),
    ("Theo", "Von", 4, null),
    ("Tom", "Segura", 4, 4);