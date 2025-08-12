
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->COMPANY)) {
        $query = "INSERT INTO tblcompany (COMPANY) VALUES (:company)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":company", $data->COMPANY);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Company created successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to create company"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Company name required"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only POST method allowed"
    ]);
}
?>
