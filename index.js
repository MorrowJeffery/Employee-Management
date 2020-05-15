const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Maybe$diddentdo1t",
    database: "employeeManagement"
  });

async function getTask() {
    inquirer
    .prompt({
      name: "task",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add Employee",
        "Add Role",
        "Add Department",
        "View All Employees",
        "View Employees by Department",
        "Update Employee Role",
        "View Roles",
        "View Departments",
      ]
    })
    .then(function(answer) {
      switch (answer.task) {
      case "Add Employee":
        addEmployee();
        break;

      case "Add Role":
        addRole();
        break;

      case "Add Department":
        addDepartment();
        break;

      case "View All Employees":
        viewEmployees();
        break;

      case "View Employees by Department":
        viewEmployeesByDept();
        break;
      
      case "Update Employee Role":
        updateEmployeeRole();
        break;

      case "View Roles":
        viewRoles();
        break;
      case "View Departments":
        viewDepartments();
        break;
      }

    });
}

function sayHello() {
    //make a generic into to app thing
}

async function viewEmployeesByDept() {
    let employees = await getEmployees();
    let roles = await getRoles();
    let departments = await getDepts();
    deptList = [];
    departments.forEach(x => {
        deptList.push(x.dept_name)
    })

    let dept = await inquirer.prompt(
        {
            name: "dept",
            type: "rawlist",
            choices: deptList,
            message: "Which department would you like to view?"
        }
    )
    var deptID = departments.find(x=> dept.dept == x.dept_name);
    employees.forEach(emp => {
        var empDeptId = roles.find(x => x.id == emp.role_id)
        if (empDeptId.dept_id == deptID.id) {

        var role = roles.find(x => x.id == emp.role_id)
        var dept = departments.find(x => x.id == role.dept_id);

        console.log("Employee: " + emp.first_name + " " + emp.last_name);
        console.log("Department: " + dept.dept_name);
        console.log("Title: " + role.title);
        console.log("Salary: " + role.salary);
        if (emp.manager_id) {
            var myManager = employees.find(x => x.id == emp.manager_id);
            console.log("Manager: " + myManager.first_name + " " + myManager.last_name)
        }
        console.log("");
    }
    })
    connection.end();
}

async function updateEmployeeRole() {
    let employees = await getEmployees();
    let roles = await getRoles();
    var empNames = [];
    var roleNames = [];
    employees.forEach(emp => {
        empNames.push(emp.first_name)
    })
    roles.forEach(roleEle => {
        roleNames.push(roleEle.title)
    })

    let employee = await inquirer.prompt(
        [
            {
                name: "name",
                type: "rawlist",
                message: "Which Employee?",
                choices: empNames
            },
            {
                name: "newRole",
                type: "rawlist",
                message: "What is their new role?",
                choices: roleNames
            }
        ]
    )
    let employeeID = employees.find(x => x.first_name === employee.name);
    let roleID = roles.find(x => x.title == employee.newRole)

    connection.query(`UPDATE Employee SET role_id = '${roleID.id}' WHERE id = '${employeeID.id}'`, function(err, data) {
        if (err) console.log(err, this.sql);
        else console.log("Employee Updated Successfully");
    })

    connection.end();
}

async function viewDepartments() {
    let departments = await getDepts();

    console.log("Departments:");
    console.log("");
    departments.forEach(dept => {
        console.log(dept.dept_name)
    })
    console.log("");
    connection.end();
}

async function viewEmployees() {
    let employees = await getEmployees();
    let roles = await getRoles();
    let departments = await getDepts();

    employees.forEach(emp => {
        var role = roles.find(x => x.id == emp.role_id)
        var dept = departments.find(x => x.id == role.dept_id);

        console.log("Employee: " + emp.first_name + " " + emp.last_name);
        console.log("Department: " + dept.dept_name);
        console.log("Title: " + role.title);
        console.log("Salary: " + role.salary);
        if (emp.manager_id) {
            var myManager = employees.find(x => x.id == emp.manager_id);
            console.log("Manager: " + myManager.first_name + " " + myManager.last_name)
        }
        console.log("");
    })
    connection.end();
}

async function viewRoles() {
    let employees = await getEmployees();
    let roles = await getRoles();
    let departments = await getDepts();

    roles.forEach(role => {
        var dept = departments.find(x => x.id == role.dept_id);

        console.log("Title: " + role.title);
        console.log("Department: " + dept.dept_name);
        console.log("Salary: " + role.salary);
        console.log("");
    })
    connection.end();
}

async function addDepartment() {
    let deptname = await inquirer.prompt(
        {
            name: "depName",
            message: "What is the name of this new department?"
        }
    )
    name = deptname.depName;
    connection.query(`INSERT INTO Department(dept_name) VALUES ("${name}")`, function(err, data) {
        if (err) console.log(err, this.sql);
        else console.log("Database Added Successfully");
    })
    connection.end();
}

function getDepts() {

    return new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM Department",
          (err, data) => {
            return err ? reject(err) : resolve(data);
          });
      });

}

function getRoles() {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM Role",
            (err, data) => {
                return err ? reject(err) : resolve(data);
            })
    })
}

function getEmployees() {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM Employee",
            (err, data) => {
                return err ? reject(err) : resolve(data);
            }
        )
    })
}

async function addRole() {
    let depts = await getDepts();
    let deptNames = [];
    depts.forEach(department => {
        deptNames.push(department.dept_name);
    })

    let roleData = await inquirer.prompt(
        [
        {
            name: "roleName",
            message: "What is the new role?"
        },
        {
            name: "roleDept",
            type: "rawlist",
            message: "What Department is this role in?",
            choices: deptNames
        },
        {
            name: "roleSalary",
            message: "What is the salary of this role?"
        }
    ]
    )
    var deptID = depts.find(x => x.dept_name == roleData.roleDept)

    connection.query(`INSERT INTO Role(title, salary, dept_id) VALUES ("${roleData.roleName}","${roleData.roleSalary}","${deptID.id}")`, function(err, data) {
        if (err) console.log(err, this.sql);
        else console.log("Role Added Successfully");
    })
    connection.end();
}

async function addEmployee() {

    let depts = await getDepts();
    let deptNames = [];
    depts.forEach(department => {
        deptNames.push(department.dept_name);
    })
    let roles = await getRoles();

    let chozDept = await inquirer.prompt(
        {
            name: "dept",
            type: "rawlist",
            message: "What department is this new employee in?",
            choices: deptNames
        }
    )
    var deptID = depts.find(x => x.dept_name == chozDept.dept);
    
    var listedRolesFull = roles.filter(x => x.dept_id === deptID.id);
    let listedRoleNames = [];
    listedRolesFull.forEach(role => {
        listedRoleNames.push(role.title);
    })
    
    let chozRole = await inquirer.prompt(
        {
            name: "cRole",
            type: "rawlist",
            message: "What role will this new employee fill?",
            choices: listedRoleNames
        }
    )

    let empData = await inquirer.prompt(
        [
            {
                name: "fname",
                message: "New employee's first name?",
            },
            {
                name: "lname",
                message: "New employee's last name?"
            },
            {
                name: "hasManager",
                type: "rawlist",
                message: "does this employee have a manager?",
                choices: ["Yes", "No"]
            }
        ]
    )
    chozRoleID = roles.find(x => x.title == chozRole.cRole);
    employees = [];
    empNames = [];
    if (empData.hasManager == "Yes") {
        employees = await getEmployees();
        employees.forEach(emp => {
            empNames.push(emp.first_name)
        })
        let chozManager = await inquirer.prompt(
            {
                name: "manager",
                type: "rawlist",
                message: "Who is their manager?",
                choices: empNames
            }
        )
        let managerID = employees.find(x => x.first_name === chozManager.manager)
        
        connection.query(
            `INSERT INTO Employee(first_name, last_name, role_id, manager_id) VALUES ("${empData.fname}","${empData.lname}","${chozRoleID.id}","${managerID.id}")`, 
            function(err, data) {
            if (err) console.log(err, this.sql);
            else console.log("Employee Added Successfully");
        })

    }
    else if (empData.hasManager == "No") {
        connection.query(
            `INSERT INTO Employee(first_name, last_name, role_id) VALUES ("${empData.fname}","${empData.lname}","${chozRoleID.id}")`, 
            function(err, data) {
            if (err) console.log(err, this.sql);
            else console.log("Employee Added Successfully");
        })
    }    

    connection.end();
}

connection.connect(function(err) {
    if (err) throw err;
    sayHello();
    getTask();
  });