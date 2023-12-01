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
    ("Billy", "Bob", 3, null),
    ("Jake", "Snake", 3, 1),
    ("James", "Fame", 3, 1),
    ("Ash", "Ketchum", 4, null),
    ("Mister", "Man", 4, 4);