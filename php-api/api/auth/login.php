
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, "Method not allowed");
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->username) || empty($data->password)) {
    sendResponse(false, "Username and password are required");
}

try {
    $query = "SELECT u.USERID, u.FNAME, u.LNAME, u.USERNAME, u.PASS, u.TYPE, u.EMPID,
                     e.FNAME as EMP_FNAME, e.LNAME as EMP_LNAME, e.EMPID as EMPLOYEE_ID,
                     c.COMPANYNAME, d.DEPARTMENT 
              FROM tbluser u 
              LEFT JOIN tblemployees e ON u.EMPID = e.EMPID 
              LEFT JOIN tblcompany c ON e.COMPANYID = c.COMPANYID 
              LEFT JOIN tbldepartment d ON e.DEPARTMENTID = d.DEPARTMENTID 
              WHERE u.USERNAME = :username AND u.PASS = :password";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $data->username);
    $stmt->bindParam(':password', $data->password);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Generate a simple token (you can enhance this with JWT)
        $token = base64_encode($user['USERID'] . ':' . time() . ':' . $data->username);
        
        $response_data = array(
            "user" => array(
                "id" => $user['USERID'],
                "username" => $user['USERNAME'],
                "firstName" => $user['FNAME'],
                "lastName" => $user['LNAME'],
                "type" => $user['TYPE'],
                "empId" => $user['EMPID'],
                "employeeFirstName" => $user['EMP_FNAME'],
                "employeeLastName" => $user['EMP_LNAME'],
                "company" => $user['COMPANYNAME'],
                "department" => $user['DEPARTMENT']
            ),
            "token" => $token
        );
        
        sendResponse(true, "Login successful", $response_data);
    } else {
        sendResponse(false, "Invalid username or password");
    }
} catch (Exception $e) {
    sendResponse(false, "Login failed: " . $e->getMessage());
}
?>
