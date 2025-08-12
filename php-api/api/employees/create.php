
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->EMPNAME) && !empty($data->USERNAME) && !empty($data->PASSWRD) && !empty($data->EMPLOYID)) {
        $query = "INSERT INTO tblemployee (EMPNAME, EMPPOSITION, USERNAME, PASSWRD, ACCSTATUS, EMPSEX, COMPANY, DEPARTMENT, EMPLOYID, AVELEAVE) 
                  VALUES (:empname, :empposition, :username, :passwrd, 'YES', :empsex, :company, :department, :employid, 18)";
        
        $stmt = $db->prepare($query);
        
        $hashed_password = sha1($data->PASSWRD);
        
        $stmt->bindParam(":empname", $data->EMPNAME);
        $stmt->bindParam(":empposition", $data->EMPPOSITION);
        $stmt->bindParam(":username", $data->USERNAME);
        $stmt->bindParam(":passwrd", $hashed_password);
        $stmt->bindParam(":empsex", $data->EMPSEX);
        $stmt->bindParam(":company", $data->COMPANY);
        $stmt->bindParam(":department", $data->DEPARTMENT);
        $stmt->bindParam(":employid", $data->EMPLOYID);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Employee created successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to create employee"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Required fields missing"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only POST method allowed"
    ]);
}
?>
