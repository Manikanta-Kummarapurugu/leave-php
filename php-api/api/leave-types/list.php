
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM tblleavetype ORDER BY LEAVETYPE";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $leaveTypes = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $leaveTypes[] = $row;
    }
    
    echo json_encode($leaveTypes);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only GET method allowed"
    ]);
}
?>
