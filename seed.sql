DROP DATABASE `employeeManagement`;

CREATE DATABASE IF NOT EXISTS `employeeManagement`;

USE `employeeManagement`;

CREATE TABLE `Department` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `dept_name` VARCHAR(40) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE `Role` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(40) NOT NULL,
    `salary` DECIMAL NOT NULL,
    `dept_id` INT NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`dept_id`) REFERENCES Department(`id`)
);

CREATE TABLE `Employee` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`first_name` VARCHAR(30) NOT NULL,
	`last_name` VARCHAR(30) NOT NULL,
    `role_id` int NOT NULL,
    `manager_id` int,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`role_id`) REFERENCES Role(`id`),
    FOREIGN KEY(`manager_id`) REFERENCES Employee(`id`)
);

USE `employeeManagement`;
SELECT * FROM Department;
select * from Role;