
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->LEAVTID) && !empty($data->LEAVETYPE) && !empty($data->DESCRIPTION)) {
        $query = "UPDATE tblleavetype SET LEAVETYPE = :leavetype, DESCRIPTION = :description WHERE LEAVTID = :leavtid";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":leavetype", $data->LEAVETYPE);
        $stmt->bindParam(":description", $data->DESCRIPTION);
        $stmt->bindParam(":leavtid", $data->LEAVTID);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Leave type updated successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to update leave type"
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
