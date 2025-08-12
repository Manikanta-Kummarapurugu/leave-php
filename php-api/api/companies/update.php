
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->COMPID) && !empty($data->COMPANY)) {
        $query = "UPDATE tblcompany SET COMPANY = :company WHERE COMPID = :compid";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":company", $data->COMPANY);
        $stmt->bindParam(":compid", $data->COMPID);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Company updated successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to update company"
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
