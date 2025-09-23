




```
# 📚 API Documentation – Employee Management System

```bash
PORT=5000
DB_NAME=Employee_management
DB_USER=[YOURUSER]
DB_PASS=[YOURPASS]
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=[YOURSECRET]

SENDGRID_API_KEY=[YOURKEY]
EMAIL_USER=[YOUREMAIL]


CLOUDINARY_CLOUD_NAME=[YOURCLOUDNAME]
CLOUDINARY_API_KEY=[YOURKEY]
CLOUDINARY_API_SECRET=[YOURSCRET]
```



This document describes all available API endpoints, organized by modules.  
Authentication uses **JWT tokens** (bearer in headers). Access is restricted by user roles (Admin, HR Manager, Department Manager, Employee).

---

## 🔑 Authentication (`/api/auth`)

| Method | Endpoint      | Description |
|--------|--------------|-------------|
| POST   | `/register`  | Register a new user (supports profile photo upload) |
| POST   | `/login`     | Login and receive JWT token |
| POST   | `/logout`    | Logout (requires authentication) |
| GET    | `/profile`   | Get logged-in user profile |
| PUT    | `/profile`   | Update logged-in user profile |

---

## 👥 Employee Management (`/api/employees`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET    | `/` | Admin, HR | Get all employees (with pagination, search, filters) |
| GET    | `/dashboard` | Admin, HR | Get employee dashboard overview |
| POST   | `/` | Admin, HR | Create new employee |
| GET    | `/statistics` | Admin, HR | Get employee statistics |
| GET    | `/department/:departmentId` | Admin, HR | Get employees by department |
| GET    | `/:id/reporting-structure` | Admin, HR | Get reporting structure |
| GET    | `/:id` | Admin, HR, Self | Get employee profile |
| PUT    | `/:id` | Admin, HR, Self | Update employee profile |
| PATCH  | `/:id/status` | Admin, HR | Change employee status |
| DELETE | `/:id` | Admin | Delete employee |

---

## 🕒 Attendance Management (`/api/attendance`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST   | `/check-in` | HR | Record employee check-in |
| POST   | `/check-out` | HR | Record employee check-out |
| GET    | `/employee/:id` | HR | Get attendance by employee (optionally by month) |
| GET    | `/summary/department/:deptId` | HR | Get department attendance summary |
| PUT    | `/:id` | HR | Update an attendance record |

---

## 🏢 Department Management (`/api/department`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET    | `/` | Public | Get all departments |
| POST   | `/` | Admin | Add new department |
| GET    | `/managers` | Admin, HR | Get all department managers |
| GET    | `/:id` | Admin, HR, Dept Manager | Get department by ID |
| PUT    | `/:id` | Admin | Update department |
| DELETE | `/:id` | Admin | Delete department |

---

## 📌 Designation Management (`/api/designations`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET    | `/` | Public | Get all designations |
| POST   | `/` | Admin, HR | Create designation |
| GET    | `/:id` | Admin, HR | Get designation by ID |
| PUT    | `/:id` | Admin, HR | Update designation |
| DELETE | `/:id` | Admin | Delete designation |

---

## 🏖️ Leave Management

### Leave Applications (`/api/leave-applications`)
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST   | `/` | Employee | Apply for leave |
| GET    | `/leaves` | Authenticated | Get all leave applications |
| GET    | `/leaves/:id` | Authenticated | Get single leave application |
| PUT    | `/:id` | Authenticated | Update leave before approval |
| DELETE | `/:id` | Authenticated | Cancel leave |
| PUT    | `/:id/approve` | Manager, HR | Approve leave |
| PUT    | `/:id/reject` | Manager, HR | Reject leave |
| GET    | `/employee/:employeeId` | Employee, HR | Get leave applications by employee |
| GET    | `/pending-approvals` | Manager, HR | Get pending approvals |
| GET    | `/leave-balances/employee/:employeeId` | Employee, HR | Get leave balances |

### Leave Types (`/api/leave-types`)
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET    | `/` | Authenticated | Get all leave types |
| GET    | `/:id` | Authenticated | Get leave type by ID |
| POST   | `/` | Admin, HR | Create new leave type |
| PUT    | `/:id` | Admin, HR | Update leave type |
| DELETE | `/:id` | Admin, HR | Delete leave type |

---

## 💰 Payroll & Salary

### Payroll (`/api/payroll`)
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST   | `/generate` | HR | Generate payroll |
| GET    | `/employee/:employeeId` | HR | Get payroll by employee |
| GET    | `/payslip/:payrollId` | HR | Get payslip |
| POST   | `/payslip/:payrollId/email` | HR | Email payslip |
| GET    | `/summary` | HR | Get payroll summary |

### Salary Details (`/api/salary-details`)
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST   | `/` | HR | Create salary detail |
| GET    | `/` | HR | Get all salary details |
| GET    | `/:id` | HR | Get salary detail by ID |
| PUT    | `/:id` | HR | Update salary detail |
| DELETE | `/:id` | HR | Delete salary detail |
| GET    | `/employee/:employeeId` | Employee, HR | Get salary by employee |

---

## 📊 Performance Reviews (`/api/performance-reviews`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST   | `/` | HR, Dept Manager | Create performance review |
| GET    | `/` | Admin, HR | Get all reviews |
| GET    | `/:id` | Authenticated | Get review by ID |
| PUT    | `/:id` | HR, Dept Manager | Update review |
| DELETE | `/:id` | Admin, HR | Delete review |
| GET    | `/employee/:employeeId` | Employee, HR | Get reviews for an employee |
| PUT    | `/:id/finalize` | HR, Dept Manager | Finalize review |
| GET    | `/analytics/dashboard` | HR, Admin | Get performance analytics dashboard |
| GET    | `/analytics/top-performers` | HR, Admin | Get top performers |
| GET    | `/analytics/trends` | HR, Admin | Get performance trends |

---

## 📈 Analytics (`/api/analytics`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET    | `/dashboard` | HR, Admin | System overview dashboard |
| GET    | `/attendance-trends` | HR, Admin | Attendance trends |
| GET    | `/headcount-analysis` | HR, Admin | Headcount analysis |
| GET    | `/performance-summary` | HR, Admin | Performance summary |
| GET    | `/attrition-analysis` | HR, Admin | Attrition analysis |
| GET    | `/salary-distribution` | HR, Admin | Salary distribution |
| GET    | `/leave-utilization` | HR, Admin | Leave utilization |
| GET    | `/payroll-summary` | HR, Admin | Payroll summary |
| GET    | `/compliance-reports` | HR, Admin | Compliance reports |
| GET    | `/predictive-analytics` | HR, Admin | Predictive analytics |
| GET    | `/training-needs` | HR, Admin | Training needs |
| GET    | `/succession-planning` | HR, Admin | Succession planning |

---

## 🔒 Notes

- **Authentication**: Add `Authorization: Bearer <token>` header for all protected routes.  
- **Roles**: Access is restricted as per role (Admin, HR Manager, Department Manager, Employee).  
- **Responses**: All endpoints return JSON. Errors follow the format:  

```json
{
  "error": "Error message here"
}




```

```
# 👤 User Guide – Roles & Permissions

This system supports **role-based access control (RBAC)**.  
Each role has different permissions to ensure secure and efficient use of the system.

---

## 🛡️ Admin

**Overview:**  
Admins have the highest privileges. They manage system configuration, users, and organizational structure.

**Capabilities:**  
- ✅ Manage all employees (create, update, delete)  
- ✅ Manage departments and assign managers  
- ✅ Manage designations (create/update/delete)  
- ✅ Manage leave types  
- ✅ View and manage all employee data (attendance, payroll, performance)  
- ✅ Access full analytics dashboard (organization-wide reports)  
- ✅ Configure system policies and settings  
- ✅ Approve or reject any leave request (if needed)  
- ✅ Delete employees or sensitive records  

---

## 👩‍💼 HR Manager

**Overview:**  
HR Managers oversee employees, payroll, and organizational compliance.  

**Capabilities:**  
- ✅ Manage employees (create, update, change status)  
- ✅ View and update employee attendance  
- ✅ Approve/reject leave requests (with managers)  
- ✅ Manage payroll generation and payslips  
- ✅ Manage salary details (create, update, delete)  
- ✅ View and manage performance reviews  
- ✅ Access HR-related analytics (attendance trends, attrition, salary distribution, etc.)  
- ✅ Generate compliance and operational reports  

---

## 🧑‍💼 Department Manager

**Overview:**  
Department Managers focus on managing their own department’s employees.  

**Capabilities:**  
- ✅ View employees in their department  
- ✅ Approve/reject leave applications of their team members  
- ✅ View attendance summary for their department  
- ✅ Conduct and update performance reviews for team members  
- ✅ Access limited analytics (performance trends, department attendance, headcount in their department)  

---

## 👨‍💻 Employee

**Overview:**  
Employees have access to their own data (self-service portal).  

**Capabilities:**  
- ✅ View and update their own profile  
- ✅ Check-in and check-out attendance (if enabled)  
- ✅ View their attendance history  
- ✅ Apply for leave and check leave balances  
- ✅ View status of their leave applications  
- ✅ View their own salary details and payroll history  
- ✅ View performance reviews and feedback given to them  

---

## 🔒 Notes

- All actions require **authentication** (login with credentials).  
- Unauthorized actions will return an error:  

```json
{
  "error": "Forbidden: You do not have permission to perform this action"
}




```

```

# ⚙️ Project Setup – Employee Management System

Follow these steps to set up the project locally for development and testing.

---

## 1️⃣ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)  
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)  
- A database (e.g., MySQL / PostgreSQL / MongoDB depending on your config)  
- Git  

---

## 2️⃣ Clone the Repository

```bash
git clone https://github.com/harshsankhavara953/Employee_Management_Equest.git
cd Employee_Management_Equest

npm run dev   # for development (with nodemon)
npm start     # for production
```
#Notes
```
Some endpoints are not visible in the demo video because frontend integration is still in progress.
 However, they are fully implemented and tested using Postman.
```


#**Video file**
```
https://res.cloudinary.com/dyg8dlfbn/video/upload/v1758477611/demovideoofequest_rnqs71.mp4

```




