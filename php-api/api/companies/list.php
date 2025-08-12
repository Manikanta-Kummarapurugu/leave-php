
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM tblcompany ORDER BY COMPANY";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $companies = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $companies[] = $row;
    }
    
    echo json_encode($companies);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only GET method allowed"
    ]);
}
?>
