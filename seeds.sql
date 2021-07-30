USE employee_DB;

----- Department -----

INSERT INTO department_id (id, name)
VALUES (1, "IT");

INSERT INTO department_id (id, name)
VALUES (2, "HR");

INSERT INTO department_id (id, name)
VALUES (3, "Engineering");

INSERT INTO department_id (id, name)
VALUES (4, "Marketing");


----- Rolls -----

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "IT Level 1", 60000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "IT Level 2", 80000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "IT Manager", 110000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Jr Programmer", 70000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (5, "Sr Developer Manager", 120000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (6, "HR Staff", 55000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (7, "HR Manager", 85000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (8, "Marketing Staff", 65000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (9, "Marketing Manager", 4);


----- Employees -----

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "David", "Phillips", 3, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Brian", "O'Connor", 5, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Jane", "Daniels", 7, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Chelsey", "Ann", 9, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (5, "Chloe", "Marie", 2, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (6, "Avery", "Renee", 4, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (7, "Michael", "Johnson", 8, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (8, "Karen", "Thomas", 1, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (9, "Jill", "Holland", 6, 3);