#!/bin/bash

# Department Management API Test Script
# Make sure to set your auth token and base URL

BASE_URL="http://localhost:3000/api"
AUTH_TOKEN="" # Set this after logging in

echo "=== Department Management API Tests ==="
echo "Base URL: $BASE_URL"
echo ""

# Function to make authenticated requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -z "$AUTH_TOKEN" ]; then
        echo "ERROR: Please set AUTH_TOKEN first by logging in"
        return 1
    fi
    
    if [ -n "$data" ]; then
        curl -X $method \
             -H "Content-Type: application/json" \
             -H "Authorization: Bearer $AUTH_TOKEN" \
             -d "$data" \
             "$BASE_URL$endpoint"
    else
        curl -X $method \
             -H "Authorization: Bearer $AUTH_TOKEN" \
             "$BASE_URL$endpoint"
    fi
}

echo "1. Login to get auth token"
echo "POST $BASE_URL/auth/login"
echo "Body: {\"email\": \"admin@company.com\", \"password\": \"AdminPass123!\"}"
echo ""
echo "Copy the token from the response and set it in AUTH_TOKEN variable"
echo ""

if [ -n "$AUTH_TOKEN" ]; then
    echo "2. Get all departments"
    make_request "GET" "/departments"
    echo ""
    echo ""
    
    echo "3. Get departments with pagination"
    make_request "GET" "/departments?page=1&limit=5"
    echo ""
    echo ""
    
    echo "4. Search departments"
    make_request "GET" "/departments?search=IT"
    echo ""
    echo ""
    
    echo "5. Get department by ID"
    make_request "GET" "/departments/1"
    echo ""
    echo ""
    
    echo "6. Get department managers"
    make_request "GET" "/departments/managers"
    echo ""
    echo ""
    
    echo "7. Create a new department"
    make_request "POST" "/departments" '{
        "department_name": "Engineering",
        "department_code": "ENG001",
        "description": "Software engineering and development team",
        "budget": 1000000.00,
        "manager_id": 1
    }'
    echo ""
    echo ""
    
    echo "8. Update department"
    make_request "PUT" "/departments/1" '{
        "department_name": "Updated HR Department",
        "description": "Updated description for HR department",
        "budget": 600000.00
    }'
    echo ""
    echo ""
    
    echo "9. Test invalid requests"
    echo "9a. Create department with missing fields"
    make_request "POST" "/departments" '{
        "department_name": "Test Department"
    }'
    echo ""
    echo ""
    
    echo "9b. Create department with negative budget"
    make_request "POST" "/departments" '{
        "department_name": "Test Department",
        "department_code": "TD001",
        "budget": -1000,
        "manager_id": 1
    }'
    echo ""
    echo ""
    
    echo "9c. Get non-existent department"
    make_request "GET" "/departments/999"
    echo ""
    echo ""
    
    echo "10. Delete department"
    make_request "DELETE" "/departments/1"
    echo ""
    echo ""
    
    echo "=== Test completed ==="
else
    echo "Please set AUTH_TOKEN variable with your authentication token"
fi
