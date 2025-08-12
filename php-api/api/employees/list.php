
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT EMPID, EMPNAME, EMPPOSITION, USERNAME, ACCSTATUS, EMPSEX, COMPANY, DEPARTMENT, EMPLOYID, AVELEAVE FROM tblemployee ORDER BY EMPNAME";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $employees = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $employees[] = $row;
    }
    
    echo json_encode($employees);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only GET method allowed"
    ]);
}
?>
