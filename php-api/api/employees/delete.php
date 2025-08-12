
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!empty($_GET['id'])) {
        $query = "DELETE FROM tblemployee WHERE EMPID = :id LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $_GET['id']);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Employee deleted successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to delete employee"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Employee ID required"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only DELETE method allowed"
    ]);
}
?>
