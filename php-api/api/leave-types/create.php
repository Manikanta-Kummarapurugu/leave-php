
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->LEAVETYPE) && !empty($data->DESCRIPTION)) {
        $query = "INSERT INTO tblleavetype (LEAVETYPE, DESCRIPTION) VALUES (:leavetype, :description)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":leavetype", $data->LEAVETYPE);
        $stmt->bindParam(":description", $data->DESCRIPTION);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Leave type created successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to create leave type"
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
