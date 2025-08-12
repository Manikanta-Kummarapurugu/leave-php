
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM tbldepts ORDER BY DEPTNAME";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $departments = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $departments[] = $row;
    }
    
    echo json_encode($departments);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only GET method allowed"
    ]);
}
?>
