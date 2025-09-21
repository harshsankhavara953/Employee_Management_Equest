# Department Controller Test Data

This directory contains comprehensive test data and scripts for testing the Department Management API.

## Files Overview

### 1. `users.json`
Contains dummy user data including:
- Department managers (required for creating departments)
- Admin user (for testing admin-only endpoints)
- HR manager (for testing HR manager permissions)

### 2. `departments.json`
Contains 10 sample departments with:
- Various department types (HR, IT, Finance, Marketing, etc.)
- Different budget ranges ($350K - $1.5M)
- Realistic descriptions
- Assigned managers

### 3. `test-requests.json`
Comprehensive test scenarios including:
- **Valid requests**: Proper department creation with all fields
- **Invalid requests**: Missing fields, duplicates, invalid data
- **Update requests**: Valid updates and error cases
- **Get requests**: Pagination, search, single department retrieval
- **Delete requests**: Valid and invalid deletions

### 4. `postman-collection.json`
Ready-to-import Postman collection with:
- Authentication setup
- All CRUD operations
- Error case testing
- Automatic token handling

### 5. `curl-commands.sh`
Bash script with curl commands for:
- Manual API testing
- Automated testing scenarios
- All endpoint coverage

## Setup Instructions

### 1. Database Setup
```bash
# First, create the users (department managers)
# Use the users.json data to create department managers

# Then create departments using departments.json
```

### 2. Authentication
Before testing, you need to authenticate:

```bash
# Login to get auth token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@company.com", "password": "AdminPass123!"}'
```

### 3. Testing Methods

#### Option A: Postman
1. Import `postman-collection.json` into Postman
2. Run the "Login Admin" request first
3. The token will be automatically set
4. Run other requests

#### Option B: cURL Script
```bash
chmod +x curl-commands.sh
./curl-commands.sh
```

#### Option C: Manual Testing
Use individual requests from `test-requests.json`

## Test Scenarios Covered

### ✅ Valid Cases
- Create department with all fields
- Create department with minimum required fields
- Update existing department
- Get all departments with pagination
- Search departments by name/code
- Get department by ID
- Get department managers list
- Delete existing department

### ❌ Error Cases
- Missing required fields (name, code, manager)
- Duplicate department name
- Duplicate department code
- Invalid manager ID (non-existent or wrong user type)
- Negative budget values
- Zero budget values
- Invalid budget format
- Non-existent department operations

## API Endpoints Tested

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/departments` | Get all departments | Admin, HR Manager |
| POST | `/departments` | Create department | Admin only |
| GET | `/departments/:id` | Get department by ID | Admin, HR Manager, Dept Manager |
| PUT | `/departments/:id` | Update department | Admin only |
| DELETE | `/departments/:id` | Delete department | Admin only |
| GET | `/departments/managers` | Get department managers | Admin, HR Manager |

## Validation Tests

### Budget Validation
The `isPositiveNumber` utility is tested with:
- ✅ Positive numbers: 1000, 1000000.50
- ❌ Negative numbers: -1000
- ❌ Zero: 0
- ❌ Invalid strings: "invalid", "abc"
- ❌ Null/undefined values

### Manager Validation
- ✅ Valid department manager IDs
- ❌ Non-existent user IDs
- ❌ Users who are not department managers

### Duplicate Validation
- ✅ Unique department names
- ✅ Unique department codes
- ❌ Duplicate names/codes

## Expected Response Format

### Success Response
```json
{
  "message": "Department added successfully",
  "department": {
    "id": 1,
    "department_name": "Engineering",
    "department_code": "ENG001",
    "description": "Software engineering team",
    "budget": "1000000.00",
    "manager_id": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "manager": {
      "id": 1,
      "full_name": "John Smith",
      "email": "john.smith@company.com"
    }
  }
}
```

### Error Response
```json
{
  "message": "Department name, code, and manager are required"
}
```

## Notes

- All department managers must be created before testing department creation
- Budget values are validated using the `isPositiveNumber` utility
- Department codes should be unique and max 10 characters
- Department names should be unique and max 100 characters
- Manager IDs must reference existing users with `user_type: "department_manager"`
