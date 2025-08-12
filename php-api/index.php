
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

echo json_encode([
    "message" => "Leave Management System API",
    "version" => "1.0.0",
    "endpoints" => [
        "auth" => [
            "POST /api/auth/login.php",
            "POST /api/auth/reset-password.php"
        ],
        "employees" => [
            "GET /api/employees/list.php",
            "GET /api/employees/get.php?id={id}",
            "POST /api/employees/create.php",
            "PUT /api/employees/update.php",
            "DELETE /api/employees/delete.php?id={id}"
        ],
        "leaves" => [
            "GET /api/leaves/list.php",
            "POST /api/leaves/create.php",
            "PUT /api/leaves/update.php"
        ],
        "companies" => [
            "GET /api/companies/list.php",
            "POST /api/companies/create.php",
            "PUT /api/companies/update.php",
            "DELETE /api/companies/delete.php?id={id}"
        ],
        "departments" => [
            "GET /api/departments/list.php",
            "POST /api/departments/create.php",
            "PUT /api/departments/update.php",
            "DELETE /api/departments/delete.php?id={id}"
        ],
        "leave-types" => [
            "GET /api/leave-types/list.php",
            "POST /api/leave-types/create.php",
            "PUT /api/leave-types/update.php",
            "DELETE /api/leave-types/delete.php?id={id}"
        ]
    ]
]);
?>
