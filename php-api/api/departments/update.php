
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->DEPTID) && !empty($data->DEPTNAME) && !empty($data->DEPTSHORTNAME)) {
        $query = "UPDATE tbldepts SET DEPTNAME = :deptname, DEPTSHORTNAME = :deptshortname WHERE DEPTID = :deptid";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":deptname", $data->DEPTNAME);
        $stmt->bindParam(":deptshortname", $data->DEPTSHORTNAME);
        $stmt->bindParam(":deptid", $data->DEPTID);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Department updated successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to update department"
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
