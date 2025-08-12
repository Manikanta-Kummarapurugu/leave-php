
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $where_clause = "";
    $params = array();
    
    if (!empty($_GET['employeeId'])) {
        $where_clause = " WHERE EMPLOYID = :employeeId";
        $params[':employeeId'] = $_GET['employeeId'];
    }
    
    $query = "SELECT * FROM tblleave" . $where_clause . " ORDER BY DATEPOSTED DESC";
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    
    $leaves = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $leaves[] = $row;
    }
    
    echo json_encode($leaves);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only GET method allowed"
    ]);
}
?>
