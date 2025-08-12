
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->EMPID) && !empty($data->EMPNAME) && !empty($data->USERNAME)) {
        $query = "UPDATE tblemployee SET 
                  EMPNAME = :empname, 
                  EMPPOSITION = :empposition, 
                  USERNAME = :username, 
                  EMPSEX = :empsex, 
                  COMPANY = :company, 
                  DEPARTMENT = :department, 
                  EMPLOYID = :employid,
                  AVELEAVE = :aveleave
                  WHERE EMPID = :empid";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(":empname", $data->EMPNAME);
        $stmt->bindParam(":empposition", $data->EMPPOSITION);
        $stmt->bindParam(":username", $data->USERNAME);
        $stmt->bindParam(":empsex", $data->EMPSEX);
        $stmt->bindParam(":company", $data->COMPANY);
        $stmt->bindParam(":department", $data->DEPARTMENT);
        $stmt->bindParam(":employid", $data->EMPLOYID);
        $stmt->bindParam(":aveleave", $data->AVELEAVE);
        $stmt->bindParam(":empid", $data->EMPID);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Employee updated successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to update employee"
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
        "message" => "Only PUT method allowed"
    ]);
}
?>
